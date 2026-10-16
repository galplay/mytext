/* js/store.js —— 数据层（后端版）：游客存档在本机，登录用户存档在服务器
 *
 * 两种身份、两种存档位置：
 *   - 游客（未登录）：全部数据保存在浏览器 localStorage（键前缀 quiz.u.guest.），
 *     行为和纯静态版一致；换浏览器 / 清缓存就没了。
 *   - 登录用户：页面打开时带着 token 从服务器把自己的全部学习数据拉下来，
 *     之后答题、收藏、笔记的变化实时同步到服务器的 SQLite 数据库（server/data.db）。
 *     换电脑、换浏览器，登录同一账号都能接着刷。
 *
 * 「快照对比 + 乐观更新」的增量同步（答辩可讲）：
 *   1. 打开章节时 progress.load 把该章的作答记录留一份"快照"（每题一个标准字符串）；
 *   2. progress.save 时把现在的记录和快照逐题对比，只把"变化的题"打包发给服务器
 *      （POST /api/sync），没变化的题一个字节都不传；
 *   3. 发送前先改快照（乐观更新），失败再把快照改回去（回滚）——
 *      下次保存自然会重发这批改动，所以偶尔断网也不会丢错题记录。
 *
 * 另一处细节：读服务器数据时，草稿（选了选项还没提交）不写 ok 字段，
 * 因为答题引擎用 rec.ok === undefined 判断"未提交"。
 *
 * 本机保存的键（统一前缀 quiz.）：
 *   quiz.token / quiz.user   登录凭证 token 与用户信息缓存（服务端会话）
 *   quiz.u.guest.*           游客的 progress / stars / notes（未登录时使用）
 *   quiz.theme / quiz.font   主题、字号（不区分身份的本机偏好）
 *   quiz.fold                首页题库区的折叠状态
 *
 * 累计用时 acc：与服务器同一套规则——距上次保存 10 分钟内视为连续作答，
 * 把这段间隔累加进 acc；间隔过大（挂机）只重新计时。服务器计算的为准，
 * 本机先按同样规则算一遍给界面看（提交后随响应被服务器的值替换）。
 *
 * 所有请求都走 api() 封装：永不抛异常，失败返回 { ok:false, status, err }；
 * 401（登录失效）统一走 sessionExpired()：退回游客身份并提示重新登录。
 */
window.Store = (function () {
  'use strict';

  var PREFIX = 'quiz.';
  var API = '/api';
  var SESSION_GAP_MS = 10 * 60 * 1000; // 两次保存间隔超过 10 分钟视为挂机，不计入用时

  function read(key) {
    try { return localStorage.getItem(PREFIX + key); } catch (e) { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(PREFIX + key, val); } catch (e) { /* 忽略 */ }
  }
  function remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch (e) { /* 忽略 */ }
  }
  function readJson(key, fallback) {
    var raw = read(key);
    if (raw == null) return fallback;
    try {
      var v = JSON.parse(raw);
      return (v && typeof v === 'object') ? v : fallback;
    } catch (e) { return fallback; }
  }

  /* ---------- 会话与服务端状态 ---------- */

  var cachedUser = readJson('user', null); // 登录用户信息缓存（顶栏头像、昵称等渲染要用）
  var cloud = null;    // 登录用户的云端数据在本机的一份镜像 { records, stars, notes, chapters }
  var snap = {};       // 每章快照： '题库/章节' → { q: { 题id: 单题标准串 }, pos, done }
  var noteTimers = {}; // 笔记防抖计时器（按题）
  var noteQueue = {};  // 待发送的笔记（按题）
  var lastErrToast = 0;

  function token() { return read('token'); }
  function isServer() { return !!token(); }

  function refreshAccountUI() {
    if (window.UI && UI.renderAccount) UI.renderAccount(); // 登录态变化后刷新顶栏账号位
  }

  function resetCloud() { cloud = null; snap = {}; }

  function fillCloud(data) {
    cloud = {
      records: data.records || {},
      stars: data.stars || {},
      notes: data.notes || {},
      chapters: data.chapters || {},
    };
    snap = {};
  }

  function setSession(tok, user) {
    write('token', tok);
    write('user', JSON.stringify(user));
    cachedUser = user;
  }

  function clearSession() {
    remove('token');
    remove('user');
    cachedUser = null;
    resetCloud();
  }

  /* token 失效（服务器返回 401）时的统一处理：退回游客身份 */
  function sessionExpired() {
    if (!isServer() && !cachedUser) return; // 已经是游客，不再重复提示
    clearSession();
    refreshAccountUI();
    if (window.UI) UI.toast('登录已失效，已切换为游客身份（重新登录即可继续）');
  }

  /* 报错提示做 5 秒节流：连续保存失败时不至于刷屏 */
  function saveErrToast(msg) {
    var now = Date.now();
    if (now - lastErrToast < 5000) return;
    lastErrToast = now;
    if (window.UI) UI.toast(msg);
  }

  /* fetch 的统一封装：带上 token，解析 JSON，任何失败都转成 { ok:false, ... } 返回 */
  function api(method, path, body) {
    var headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    var tok = token();
    if (tok) headers['Authorization'] = 'Bearer ' + tok;
    return fetch(API + path, {
      method: method,
      headers: headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.ok) return { ok: true, data: data };
        return { ok: false, status: res.status, err: (data && data.error) || ('请求失败（' + res.status + '）') };
      });
    }, function () {
      // 网络层失败（服务器没启动 / 断网 / file:// 打开）
      return { ok: false, status: 0, err: '连不上服务器：请确认已经运行 node server/server.js' };
    });
  }

  /* 页面打开时调用：登录用户先从服务器把自己的全部数据拉下来（拉完再渲染）。
     游客、失败都能正常继续，页面照常可用。 */
  function ready() {
    if (!isServer()) return Promise.resolve();
    return api('GET', '/my-data').then(function (res) {
      if (res.ok) {
        fillCloud(res.data);
        if (res.data.user) setSession(token(), res.data.user);
        refreshAccountUI();
      } else if (res.status === 401) {
        sessionExpired();
      } else {
        if (window.UI) UI.toast('无法连接服务器，登录数据暂时无法同步：' + res.err);
      }
    });
  }

  /* ---------- 游客模式：全部写在本机 localStorage ---------- */

  function upref(u) { return 'u.' + (u || 'guest') + '.'; }

  function guestProgressLoad(bankId, chapterId) {
    return readJson(upref('guest') + 'progress.' + bankId + '.' + chapterId,
      { i: 0, r: {}, done: false, t: 0, acc: 0 });
  }

  function guestProgressSave(bankId, chapterId, data) {
    var now = Date.now();
    data.acc = data.acc || 0;
    if (data.t) {
      var gap = now - data.t;
      if (gap > 0 && gap < SESSION_GAP_MS) data.acc += gap;
    }
    data.t = now;
    write(upref('guest') + 'progress.' + bankId + '.' + chapterId, JSON.stringify(data));
  }

  function guestStarsLoad(bankId) {
    return readJson(upref('guest') + 'stars.' + bankId, {});
  }

  function guestStarsToggle(bankId, qid) {
    var all = guestStarsLoad(bankId);
    var on;
    if (all[qid]) { delete all[qid]; on = false; } else { all[qid] = Date.now(); on = true; }
    write(upref('guest') + 'stars.' + bankId, JSON.stringify(all));
    return on;
  }

  function guestNotesLoad(bankId) {
    return readJson(upref('guest') + 'notes.' + bankId, {});
  }

  function guestNotesSet(bankId, qid, text) {
    var all = guestNotesLoad(bankId);
    if (text && text.trim()) all[qid] = text; else delete all[qid];
    write(upref('guest') + 'notes.' + bankId, JSON.stringify(all));
  }

  /* 本机游客数据的所有键（导入账号 / 清空游客数据时用） */
  function guestKeys() {
    var prefix = PREFIX + upref('guest');
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) out.push(k);
      }
    } catch (e) { /* 忽略 */ }
    return out;
  }

  function removeGuestKeys() {
    guestKeys().forEach(function (k) { remove(k.slice(PREFIX.length)); });
  }

  /* ---------- 登录用户：云端镜像 + 增量同步 ---------- */

  // 一条作答记录的标准串，仅用于快照对比：
  // D = 草稿（选了选项没提交），T = 答对，F = 答错
  function recStr(rec) {
    if (!rec || !rec.c) return '';
    return (rec.ok === undefined ? 'D' : (rec.ok ? 'T' : 'F')) + JSON.stringify(rec.c);
  }

  function chapterKey(bankId, chapterId) { return bankId + '/' + chapterId; }

  /* 云端 chapters 行 + records 表 → 前端进度对象，同时留一份快照给 save 做增量对比 */
  function serverProgressLoad(bankId, chapterId) {
    var key = chapterKey(bankId, chapterId);
    var data = { i: 0, r: {}, done: false, t: 0, acc: 0 };
    var chap = cloud && cloud.chapters[key];
    if (chap) {
      data.i = chap.pos | 0;
      data.done = !!chap.done;
      data.t = chap.lastTs | 0;
      data.acc = chap.acc | 0;
    }
    if (cloud) {
      var prefix = chapterId + '-'; // 题号形如 web-1-3，本章题目的前缀就是 web-1-
      Object.keys(cloud.records).forEach(function (qid) {
        if (qid.indexOf(prefix) !== 0) return;
        var rec = cloud.records[qid];
        var o = { c: rec.c };
        if (rec.ok != null) o.ok = rec.ok; // 草稿不带 ok，答题引擎用 ok === undefined 识别
        data.r[qid] = o;
      });
    }
    var q = {};
    Object.keys(data.r).forEach(function (qid) { q[qid] = recStr(data.r[qid]); });
    snap[key] = { q: q, pos: data.i, done: data.done };
    return data;
  }

  function applyChangesToCloud(changes) {
    if (!cloud) return;
    changes.forEach(function (ch) {
      if (ch.remove) delete cloud.records[ch.qid];
      else cloud.records[ch.qid] = { c: ch.c.slice(), ok: ch.ok };
    });
  }

  /* 把一批作答改动同步到服务器：
     先按本地规则累计用时并更新快照（乐观），再发 POST /api/sync，
     成功后采用服务器算的 acc、把改动落进本机云端镜像；失败则回滚快照等着重发。 */
  function serverProgressSave(bankId, chapterId, data) {
    var now = Date.now();
    data.acc = data.acc || 0;
    if (data.t) {
      var gap = now - data.t;
      if (gap > 0 && gap < SESSION_GAP_MS) data.acc += gap;
    }
    data.t = now;
    if (!cloud) return; // 云端数据没拉下来（服务器没连上）：只留内存里，不落盘

    var key = chapterKey(bankId, chapterId);
    var s = snap[key];
    var newQ = {};
    var changes = [];
    Object.keys(data.r).forEach(function (qid) {
      var str = recStr(data.r[qid]);
      newQ[qid] = str;
      if (!s || s.q[qid] !== str) {
        var rec = data.r[qid];
        changes.push({ qid: qid, c: rec.c, ok: rec.ok === undefined ? null : rec.ok });
      }
    });
    if (s) {
      Object.keys(s.q).forEach(function (qid) {
        if (!newQ[qid]) changes.push({ qid: qid, remove: true }); // 本地删掉的题（重做错题）
      });
    }

    var pos = data.i | 0;
    var done = !!data.done;
    var posChanged = !s || s.pos !== pos;
    var doneChanged = !s || s.done !== done;
    if (!changes.length && !posChanged && !doneChanged) return; // 没有变化，不发请求

    snap[key] = { q: newQ, pos: pos, done: done }; // 乐观更新快照
    var payload = { bank: bankId, chapter: chapterId, changes: changes };
    if (posChanged) payload.pos = pos;
    if (doneChanged) payload.done = done;

    api('POST', '/sync', payload).then(function (res) {
      if (res.ok) {
        data.acc = res.data.acc; // 服务器算的累计用时为准
        applyChangesToCloud(changes);
        if (cloud) {
          cloud.chapters[key] = {
            pos: res.data.pos,
            done: res.data.done,
            acc: res.data.acc,
            lastTs: now,
          };
        }
      } else {
        snap[key] = s; // 回滚：下次保存会把这批改动重新发一遍
        if (res.status === 401) sessionExpired();
        else saveErrToast('保存失败：' + res.err);
      }
    });
  }

  /* ---------- 笔记：更新本机缓存后防抖发送（500ms），关页面前兜底再发一次 ---------- */

  function scheduleNoteSync(qid) {
    noteQueue[qid] = true;
    if (noteTimers[qid]) clearTimeout(noteTimers[qid]);
    noteTimers[qid] = setTimeout(function () { flushNote(qid); }, 500);
  }

  function flushNote(qid) {
    if (noteTimers[qid]) { clearTimeout(noteTimers[qid]); delete noteTimers[qid]; }
    if (!noteQueue[qid] || !cloud) { delete noteQueue[qid]; return; }
    delete noteQueue[qid];
    var text = cloud.notes[qid] || ''; // 以本机缓存里的最新文本为准
    fetch(API + '/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token() },
      body: JSON.stringify({ qid: qid, text: text }),
      keepalive: true, // 即使这是页面关闭时发出的请求，浏览器也会尽量送出去
    }).then(function (res) {
      if (res.status === 401) sessionExpired();
    }, function () { /* 网络失败：文本还在本机缓存里，下次输入同一题会再发一遍 */ });
  }

  function flushNotes() {
    Object.keys(noteQueue).forEach(flushNote);
  }
  window.addEventListener('pagehide', flushNotes); // 关页 / 跳转前把没发出的笔记送出去

  /* ---------- 对外接口 ---------- */

  var AVATAR_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

  var store = {
    SESSION_GAP_MS: SESSION_GAP_MS,
    avatarColors: AVATAR_COLORS,

    /* 打开页面后等 ready() 完成再渲染（游客立即完成） */
    ready: ready,

    theme: {
      get: function () { return read('theme') || 'light'; },
      set: function (t) { write('theme', t); },
    },

    font: {
      get: function () { return read('font') || 'normal'; },
      set: function (f) { write('font', f); },
    },

    /* 首页题库区的折叠状态：{ web: true } 表示 Web 区收起 */
    fold: {
      load: function () { return readJson('fold', {}); },
      save: function (map) { write('fold', JSON.stringify(map)); },
    },

    /* ---------- 登录状态 ---------- */
    session: {
      /* 当前身份：登录用户名；未登录返回 'guest' */
      get: function () { return cachedUser ? cachedUser.name : 'guest'; },
      /* 当前用户的完整信息（昵称、头像、好友……），未登录返回 null */
      user: function () { return cachedUser; },

      /* 登录 / 注册都返回 Promise<{ ok:true, rec } | { ok:false, err }> */
      login: function (name, pass) {
        return api('POST', '/login', { name: name, pass: pass }).then(function (res) {
          if (!res.ok) return { ok: false, err: res.err };
          setSession(res.data.token, res.data.user);
          resetCloud(); // 登录后等 ready() / 首屏拉取属于自己的数据
          refreshAccountUI();
          return { ok: true, rec: res.data.user };
        });
      },

      register: function (name, pass, nick) {
        return api('POST', '/register', { name: name, pass: pass, nick: nick }).then(function (res) {
          if (!res.ok) return { ok: false, err: res.err };
          setSession(res.data.token, res.data.user);
          resetCloud();
          refreshAccountUI();
          return { ok: true, rec: res.data.user };
        });
      },

      logout: function () {
        return api('POST', '/logout').then(function () {
          // 就算服务器没连上，本机也照常退出（token 留在服务器上无妨，下次登录会换新的）
          clearSession();
          refreshAccountUI();
        });
      },
    },

    /* ---------- 账号资料 / 好友 / 排行榜（都要登录，401 自动退回游客） ---------- */

    /* 我的资料 + 战绩（个人主页用）：{ ok, data:{ user, stats } } */
    me: function () {
      return api('GET', '/me').then(function (res) {
        if (res.ok && res.data.user) {
          setSession(token(), res.data.user); // 顺带刷新本机缓存的资料
          refreshAccountUI();
        } else if (res.status === 401) {
          clearSession();
          refreshAccountUI();
        }
        return res;
      });
    },

    /* 更新资料（昵称 / 签名 / 头像） */
    updateProfile: function (patch) {
      return api('POST', '/profile', patch).then(function (res) {
        if (res.ok && res.data.user) {
          setSession(token(), res.data.user);
          refreshAccountUI();
        } else if (res.status === 401) {
          clearSession();
          refreshAccountUI();
        }
        return res;
      });
    },

    friendAdd: function (name) {
      return api('POST', '/friend/add', { name: name }).then(function (res) {
        if (res.ok && cachedUser) {
          // 先记进本机缓存，界面立即显示"已是好友"；页面随后再 me() 拉到完整昵称头像
          cachedUser.friends = cachedUser.friends || [];
          var has = cachedUser.friends.some(function (f) { return f.name === name; });
          if (!has) cachedUser.friends.push({ name: name, nick: name, avatar: null });
          write('user', JSON.stringify(cachedUser));
        } else if (res.status === 401) {
          clearSession();
          refreshAccountUI();
        }
        return res;
      });
    },

    friendRemove: function (name) {
      return api('POST', '/friend/remove', { name: name }).then(function (res) {
        if (res.ok && cachedUser && cachedUser.friends) {
          cachedUser.friends = cachedUser.friends.filter(function (f) { return f.name !== name; });
          write('user', JSON.stringify(cachedUser));
        } else if (res.status === 401) {
          clearSession();
          refreshAccountUI();
        }
        return res;
      });
    },

    /* 排行榜（公开接口）：{ ok, rows? , err? } */
    leaderboard: function () {
      return api('GET', '/leaderboard').then(function (res) {
        if (res.ok) return { ok: true, rows: res.data.rows || [] };
        return { ok: false, err: res.err };
      });
    },

    /* 首页小统计：{ ok, users?, err? } */
    overview: function () {
      return api('GET', '/stats').then(function (res) {
        if (res.ok) return { ok: true, users: res.data.users | 0 };
        return { ok: false, err: res.err };
      });
    },

    /* ---------- 答题数据（按当前身份自动分流：游客写本机 / 登录用户同步服务器） ---------- */

    progress: {
      load: function (bankId, chapterId) {
        return isServer() ? serverProgressLoad(bankId, chapterId) : guestProgressLoad(bankId, chapterId);
      },
      /* 与纯静态版相同的调用方式（同步返回）；登录用户内部做增量同步 */
      save: function (bankId, chapterId, data) {
        if (isServer()) serverProgressSave(bankId, chapterId, data);
        else guestProgressSave(bankId, chapterId, data);
      },
      /* 重新开始本章：返回 Promise，等服务器确实清完再刷新页面 */
      clear: function (bankId, chapterId) {
        if (!isServer()) {
          remove(upref('guest') + 'progress.' + bankId + '.' + chapterId);
          return Promise.resolve({ ok: true });
        }
        var key = chapterKey(bankId, chapterId);
        if (cloud) {
          var prefix = chapterId + '-';
          Object.keys(cloud.records).forEach(function (qid) {
            if (qid.indexOf(prefix) === 0) delete cloud.records[qid];
          });
          delete cloud.chapters[key];
        }
        delete snap[key];
        return api('POST', '/reset-chapter', { bank: bankId, chapter: chapterId }).then(function (res) {
          if (res.status === 401) sessionExpired();
          else if (!res.ok) saveErrToast('重置失败：' + res.err);
          return res;
        });
      },
    },

    stars: {
      load: function (bankId) {
        if (!isServer()) return guestStarsLoad(bankId);
        var out = {};
        if (cloud) {
          var prefix = bankId + '-';
          Object.keys(cloud.stars).forEach(function (qid) {
            if (qid.indexOf(prefix) === 0) out[qid] = cloud.stars[qid];
          });
        }
        return out;
      },
      /* 同步返回新的收藏状态（true = 已收藏），界面不用等网络 */
      toggle: function (bankId, qid) {
        if (!isServer()) return guestStarsToggle(bankId, qid);
        if (!cloud) return false;
        var on;
        if (cloud.stars[qid]) { delete cloud.stars[qid]; on = false; }
        else { cloud.stars[qid] = Date.now(); on = true; }
        api('POST', '/star', { qid: qid, on: on }).then(function (res) {
          if (res.status === 401) sessionExpired();
          else if (!res.ok) saveErrToast('收藏没有存到服务器：' + res.err);
        });
        return on;
      },
    },

    /* 题目笔记：按题库存 { 题id: 文本 }，内容为空时自动删除该条 */
    notes: {
      load: function (bankId) {
        if (!isServer()) return guestNotesLoad(bankId);
        var out = {};
        if (cloud) {
          var prefix = bankId + '-';
          Object.keys(cloud.notes).forEach(function (qid) {
            if (qid.indexOf(prefix) === 0) out[qid] = cloud.notes[qid];
          });
        }
        return out;
      },
      set: function (bankId, qid, text) {
        if (!isServer()) { guestNotesSet(bankId, qid, text); return; }
        if (!cloud) return; // 没连上服务器：这轮先不保存
        if (text && text.trim()) cloud.notes[qid] = text; else delete cloud.notes[qid];
        scheduleNoteSync(qid); // 防抖 500ms 后发服务器
      },
    },

    /* 汇总某一章的统计（入口页使用）：按章节的题目清单清点，
       忽略存储中不属于本章的历史记录
       answered = 已提交题数，correct = 答对题数，wrong = 答错题数 */
    chapterStats: function (bankId, chapterId, questions) {
      var p = this.progress.load(bankId, chapterId);
      var total = questions.length;
      var answered = 0;
      var correct = 0;
      for (var qi = 0; qi < questions.length; qi++) {
        var rec = p.r[questions[qi].id];
        if (!rec || rec.ok === undefined) continue;
        answered++;
        if (rec.ok) correct++;
      }
      return {
        answered: answered,
        correct: correct,
        wrong: answered - correct,
        total: total,
        done: !!p.done,
        percent: total ? Math.round((answered / total) * 100) : 0,
      };
    },

    /* ---------- 游客数据迁移 / 清空 ---------- */

    /* 本机游客身份下存了多少条数据（键数量）：登录成功后提示"上传到账号"用 */
    guestDataCount: function () {
      return guestKeys().length;
    },

    /* 把游客存档上传到当前登录账号（登录 / 注册成功后调用）。
       收件方（服务器 importData）已有的题不覆盖，只补缺失的；
       上传成功后才清除本机游客键，失败则原样保留，可稍后再试。
       返回 Promise<{ ok, data:{ moved } } | { ok:false, err }>。 */
    importGuestData: function () {
      if (!isServer()) return Promise.resolve({ ok: false, status: 400, err: '请先登录' });
      var payload = { records: {}, stars: {}, notes: {}, chapters: {} };
      var prefix = PREFIX + upref('guest');
      guestKeys().forEach(function (k) {
        var suffix = k.slice(prefix.length);
        var v = null;
        try { v = JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return; }
        if (!v || typeof v !== 'object') return;

        var m = /^progress\.([a-z]+)\.([a-z]+-\d+)$/.exec(suffix);
        if (m) {
          Object.keys(v.r || {}).forEach(function (qid) {
            var rec = v.r[qid];
            if (rec && rec.c && rec.c.length) {
              payload.records[qid] = { c: rec.c, ok: rec.ok === undefined ? null : rec.ok };
            }
          });
          payload.chapters[m[1] + '/' + m[2]] = { pos: v.i | 0, done: !!v.done, acc: v.acc | 0 };
          return;
        }
        m = /^stars\.([a-z]+)$/.exec(suffix);
        if (m) {
          Object.keys(v).forEach(function (qid) { payload.stars[qid] = 1; });
          return;
        }
        m = /^notes\.([a-z]+)$/.exec(suffix);
        if (m) {
          Object.keys(v).forEach(function (qid) {
            if (typeof v[qid] === 'string' && v[qid].trim()) payload.notes[qid] = v[qid];
          });
        }
      });
      return api('POST', '/import', payload).then(function (res) {
        if (res.ok) removeGuestKeys();
        return res;
      });
    },

    /* 清除当前身份的全部学习数据（账号本身、主题、字号、折叠状态保留） */
    clearAll: function () {
      if (!isServer()) {
        removeGuestKeys();
        return Promise.resolve({ ok: true });
      }
      if (cloud) {
        cloud.records = {};
        cloud.stars = {};
        cloud.notes = {};
        cloud.chapters = {};
      }
      snap = {};
      return api('POST', '/clear-my-data').then(function (res) {
        if (res.status === 401) sessionExpired();
        else if (!res.ok) saveErrToast('服务器清除失败：' + res.err);
        return res;
      });
    },
  };

  /* 旧版（还没有账号体系时的第一版）遗留数据：quiz.progress.* / quiz.stars.* / quiz.notes.*
     首次加载时并入游客身份，避免老用户进度丢失 */
  function migrateLegacy() {
    try {
      var legacy = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf(PREFIX) !== 0) continue;
        if (/^(progress|stars|notes)\./.test(k.slice(PREFIX.length))) legacy.push(k);
      }
      for (var j = 0; j < legacy.length; j++) {
        var key = legacy[j];
        var val = localStorage.getItem(key);
        var target = PREFIX + upref('guest') + key.slice(PREFIX.length);
        if (val != null && localStorage.getItem(target) == null) {
          localStorage.setItem(target, val);
        }
        localStorage.removeItem(key);
      }
    } catch (e) { /* 忽略 */ }
  }
  migrateLegacy();

  /* file:// 直接双击打开时的横幅提示：后端版需要先启动服务器 */
  (function fileNotice() {
    if (location.protocol !== 'file:') return;
    function show() {
      var host = document.getElementById('view') || document.body;
      if (!host || document.getElementById('backendNotice')) return;
      var p = document.createElement('p');
      p.id = 'backendNotice';
      p.className = 'notice notice--error';
      p.textContent = '这是「后端版」：请先在项目目录运行 node server/server.js，然后访问 ' +
        'http://localhost:3000。现在用文件方式打开时只能用游客模式，登录、排行榜、好友等功能不可用。';
      host.insertBefore(p, host.firstChild);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  })();

  return store;
})();
