/* server/server.js —— HTTP 服务器（网站的「前台大门」）
 *
 * 职责只有两件事：
 *   1. 静态文件：把 index.html、chapters/、css/、js/、data/ 等直接发给浏览器
 *   2. JSON 接口：/api/xxx —— 注册登录、答题数据、排行榜、好友，全部在服务器处理
 *
 * 启动：在项目根目录运行   node server/server.js   （或 npm start）
 * 然后浏览器访问            http://localhost:3000
 *
 * 零依赖：只用 Node 自带的 http / fs / path / crypto / node:sqlite，没有 npm 包。
 *
 * 安全上的几个关键做法（答辩常被问）：
 *   1. 会话 token：登录成功后服务器发一个随机 token，浏览器以后每次请求都带上它
 *      （Authorization: Bearer <token>），服务器由此知道"你是谁"。密码本身永远不会反复传输。
 *   2. 静态文件防目录穿越：请求 /../../Windows 这种路径会被拦下（只允许访问网站根目录内的文件）。
 *   3. server/、tools/、*.md、package.json 一律不对外提供下载（后端代码和题库原文不该被访问到）。
 *   4. 所有接口输入都做校验（用户名格式、字段长度、数组条数上限），不合规直接返回 400。
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./db.js');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, '..'); // 网站根目录 = server 文件夹的上一层
const BODY_LIMIT = 4 * 1024 * 1024; // 请求体上限 4MB（头像图片转 base64 后可能偏大）

/* ---------- 小工具 ---------- */

function sendJson(res, status, obj) {
  const text = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(text);
}

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

/* 读取并解析 JSON 请求体（带大小限制） */
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (d) => {
      size += d.length;
      if (size > BODY_LIMIT) {
        reject(Object.assign(new Error('请求体过大'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(d);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8')));
      } catch (e) {
        reject(Object.assign(new Error('请求体不是合法的 JSON'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function tokenOf(req) {
  const h = String(req.headers.authorization || '');
  return h.startsWith('Bearer ') ? h.slice(7).trim() : '';
}

/* ---------- 输入校验（所有接口的输入都先过滤一遍） ---------- */

const NAME_RE = /^[\w\u4e00-\u9fa5]{2,16}$/;
const BANK_RE = /^[a-z]{2,8}$/;
const CHAPTER_RE = /^[a-z]{2,8}-\d{1,3}$/;
const QID_RE = /^[a-z]{2,8}-\d{1,3}-\d{1,4}$/;
const RESERVED_NAMES = ['guest', '__proto__'];
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function validName(name) {
  return typeof name === 'string' && NAME_RE.test(name) && RESERVED_NAMES.indexOf(name) === -1;
}

function validChoice(c) {
  return Array.isArray(c) && c.length >= 1 && c.length <= 8 &&
    c.every((k) => typeof k === 'string' && /^[A-F]$/.test(k));
}

/* 头像只接受两种形态：色块 { type:'color', c:'#xxxxxx' } 或
   上传图片 { type:'img', d:'data:image/...', c:'#xxxxxx' }（d 是压缩后的 128px JPEG，约几 KB~几十 KB） */
function validAvatar(a) {
  if (!a || typeof a !== 'object') return null;
  if (a.type === 'color' && COLOR_RE.test(a.c)) return { type: 'color', c: a.c };
  if (a.type === 'img' && typeof a.d === 'string' && a.d.startsWith('data:image/') && a.d.length <= 600000) {
    return { type: 'img', d: a.d, c: COLOR_RE.test(a.c) ? a.c : '#4f46e5' };
  }
  return null;
}

/* ---------- 接口实现 ----------
 * 每个处理函数的签名：(req, res, body, token, user)
 * user 为 null 表示未登录（需要登录的接口自己返回 401） */

const api = {

  /* 注册：创建账号 + 直接发登录 token */
  'POST /api/register': (req, res, body) => {
    const name = String(body.name || '').trim();
    const pass = String(body.pass || '');
    if (!validName(name)) return sendJson(res, 400, { error: '用户名需为 2-16 位字母、数字、下划线或中文（guest 为保留名）' });
    if (pass.length < 4 || pass.length > 64) return sendJson(res, 400, { error: '密码长度需为 4-64 位' });
    if (db.getUser(name)) return sendJson(res, 400, { error: '用户名「' + name + '」已被注册' });
    const nick = String(body.nick || '').trim().slice(0, 12) || name;
    const user = db.createUser(name, pass, nick);
    const token = db.createSession(name);
    sendJson(res, 200, { token, user });
  },

  /* 登录 */
  'POST /api/login': (req, res, body) => {
    const name = String(body.name || '').trim();
    const pass = String(body.pass || '');
    if (!name) return sendJson(res, 400, { error: '请输入用户名' });
    if (!pass) return sendJson(res, 400, { error: '请输入密码' });
    const user = db.verifyLogin(name, pass);
    if (!user) {
      // 不区分"用户不存在/密码错误"，避免帮别人试探出哪些用户名已注册
      return sendJson(res, 400, { error: '用户名或密码不对，再试一次' });
    }
    const token = db.createSession(name);
    sendJson(res, 200, { token, user });
  },

  /* 登出：删掉这次会话的 token（其他设备上的登录不受影响） */
  'POST /api/logout': (req, res, body, token) => {
    db.deleteSession(token);
    sendJson(res, 200, { ok: true });
  },

  /* 我的资料 + 战绩（个人主页用） */
  'GET /api/me': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    sendJson(res, 200, { user, stats: db.myStats(user.name) });
  },

  /* 查看他人主页：GET /api/user?name=xxx —— 公开接口（游客也能看）。
     只返回「公开资料（昵称/头像/签名/注册时间/好友）+ 汇总战绩」，
     答题记录、笔记原文等隐私细节一概不出服务器；
     userPublic() 本来就不含密码盐和散列，这里直接复用。 */
  'GET /api/user': (req, res, body, token, user) => {
    let name = '';
    try {
      name = String(new URL(req.url, 'http://localhost').searchParams.get('name') || '').trim();
    } catch (e) { /* 非法 URL：按空处理 */ }
    if (!name || name.length > 16) return sendJson(res, 400, { error: '用户名不正确' });
    const target = db.userPublic(name);
    if (!target) return sendJson(res, 404, { error: '没有找到用户「' + name + '」' });
    sendJson(res, 200, { user: target, stats: db.myStats(name), isSelf: !!user && user.name === name });
  },

  /* 页面打开时一次性拉取我的全部学习数据（答题记录/收藏/笔记/章节进度） */
  'GET /api/my-data': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const data = db.getMyData(user.name);
    sendJson(res, 200, Object.assign({ user }, data));
  },

  /* 保存一批章节改动：答题、草稿、删除（重做错题）、断点位置、交卷 */
  'POST /api/sync': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const bank = String(body.bank || '');
    const chapter = String(body.chapter || '');
    if (!BANK_RE.test(bank) || !CHAPTER_RE.test(chapter) || chapter.indexOf(bank + '-') !== 0) {
      return sendJson(res, 400, { error: '章节参数不正确' });
    }
    const posOk = body.pos === undefined || (Number.isInteger(body.pos) && body.pos >= 0 && body.pos <= 10000);
    const doneOk = body.done === undefined || typeof body.done === 'boolean';
    if (!posOk || !doneOk) return sendJson(res, 400, { error: 'pos / done 参数不正确' });

    const rawChanges = body.changes === undefined ? [] : body.changes;
    if (!Array.isArray(rawChanges) || rawChanges.length > 300) {
      return sendJson(res, 400, { error: 'changes 需为不超过 300 条的数组' });
    }
    const changes = [];
    for (const ch of rawChanges) {
      if (!ch || typeof ch !== 'object' || !QID_RE.test(String(ch.qid || ''))) {
        return sendJson(res, 400, { error: 'changes 里存在不合法的题目编号' });
      }
      if (ch.remove === true) {
        changes.push({ qid: ch.qid, remove: true });
      } else if (validChoice(ch.c) && (ch.ok === undefined || ch.ok === null || typeof ch.ok === 'boolean')) {
        changes.push({ qid: ch.qid, c: ch.c, ok: ch.ok == null ? null : ch.ok });
      } else {
        return sendJson(res, 400, { error: 'changes 里存在不合法的作答记录' });
      }
    }

    const result = db.syncChapter(user.name, bank, chapter, body.pos, body.done, changes);
    sendJson(res, 200, result); // { acc, pos, done }：服务器算好的累计用时等，前端用它更新界面
  },

  /* 收藏 / 取消收藏 */
  'POST /api/star': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    if (!QID_RE.test(String(body.qid || '')) || typeof body.on !== 'boolean') {
      return sendJson(res, 400, { error: '参数不正确' });
    }
    db.toggleStar(user.name, body.qid, body.on);
    sendJson(res, 200, { ok: true });
  },

  /* 保存 / 清空一条题目笔记 */
  'POST /api/note': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    if (!QID_RE.test(String(body.qid || ''))) return sendJson(res, 400, { error: '参数不正确' });
    const text = body.text == null ? '' : String(body.text);
    if (text.length > 4000) return sendJson(res, 400, { error: '笔记过长（最多 4000 字）' });
    db.setNote(user.name, body.qid, text);
    sendJson(res, 200, { ok: true });
  },

  /* 重新开始本章：清掉本章的作答记录 */
  'POST /api/reset-chapter': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const bank = String(body.bank || '');
    const chapter = String(body.chapter || '');
    if (!BANK_RE.test(bank) || !CHAPTER_RE.test(chapter) || chapter.indexOf(bank + '-') !== 0) {
      return sendJson(res, 400, { error: '章节参数不正确' });
    }
    db.resetChapter(user.name, bank, chapter);
    sendJson(res, 200, { ok: true });
  },

  /* 导入游客数据：把本机游客身份下的进度/收藏/笔记搬进账号（已有的不覆盖） */
  'POST /api/import': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const p = body || {};
    const clean = { records: {}, stars: {}, notes: {}, chapters: {} };

    const recKeys = Object.keys(p.records || {});
    if (recKeys.length > 2000) return sendJson(res, 400, { error: 'records 过多' });
    for (const qid of recKeys) {
      const rec = p.records[qid];
      if (!QID_RE.test(qid) || !rec || !validChoice(rec.c)) return sendJson(res, 400, { error: 'records 里有不合法的记录' });
      clean.records[qid] = { c: rec.c, ok: rec.ok == null ? null : !!rec.ok };
    }

    const starKeys = Object.keys(p.stars || {});
    if (starKeys.length > 2000) return sendJson(res, 400, { error: 'stars 过多' });
    for (const qid of starKeys) {
      if (!QID_RE.test(qid)) return sendJson(res, 400, { error: 'stars 里有不合法的记录' });
      clean.stars[qid] = 1;
    }

    const noteKeys = Object.keys(p.notes || {});
    if (noteKeys.length > 500) return sendJson(res, 400, { error: 'notes 过多' });
    for (const qid of noteKeys) {
      const text = p.notes[qid];
      if (!QID_RE.test(qid) || typeof text !== 'string' || text.length > 4000) {
        return sendJson(res, 400, { error: 'notes 里有不合法的记录' });
      }
      clean.notes[qid] = text;
    }

    const chapKeys = Object.keys(p.chapters || {});
    if (chapKeys.length > 100) return sendJson(res, 400, { error: 'chapters 过多' });
    for (const key of chapKeys) {
      const parts = String(key).split('/'); // "web/web-1"
      const info = p.chapters[key] || {};
      if (parts.length !== 2 || !BANK_RE.test(parts[0]) || !CHAPTER_RE.test(parts[1])) {
        return sendJson(res, 400, { error: 'chapters 里有不合法的记录' });
      }
      clean.chapters[key] = {
        pos: Number.isInteger(info.pos) ? info.pos : 0,
        done: !!info.done,
        acc: Number.isInteger(info.acc) ? info.acc : 0,
      };
    }

    const moved = db.importData(user.name, clean);
    sendJson(res, 200, { moved });
  },

  /* 更新资料（昵称 / 签名 / 头像） */
  'POST /api/profile': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const patch = {};
    if (body.nick !== undefined) {
      const nick = String(body.nick || '').trim();
      if (!nick) return sendJson(res, 400, { error: '昵称不能为空' });
      if (nick.length > 12) return sendJson(res, 400, { error: '昵称最多 12 个字' });
      patch.nick = nick;
    }
    if (body.sig !== undefined) {
      if (String(body.sig).length > 60) return sendJson(res, 400, { error: '签名最多 60 个字' });
      patch.sig = String(body.sig);
    }
    if (body.avatar !== undefined) {
      const av = validAvatar(body.avatar);
      if (!av) return sendJson(res, 400, { error: '头像格式不正确' });
      patch.avatar = av;
    }
    const updated = db.updateUser(user.name, patch);
    sendJson(res, 200, { user: updated });
  },

  /* 加好友 / 删好友 */
  'POST /api/friend/add': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const name = String(body.name || '').trim();
    if (name === user.name) return sendJson(res, 400, { error: '不能加自己为好友' });
    if (!db.getUser(name)) return sendJson(res, 400, { error: '没有找到用户名「' + name + '」' });
    if (user.friends.some((f) => f.name === name)) return sendJson(res, 400, { error: '你们已经是好友了' });
    db.addFriend(user.name, name);
    sendJson(res, 200, { ok: true });
  },

  'POST /api/friend/remove': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const name = String(body.name || '').trim();
    db.removeFriend(user.name, name);
    sendJson(res, 200, { ok: true });
  },

  /* 排行榜：公开接口，未登录也能看（游客页面会提示登录后才能 PK） */
  'GET /api/leaderboard': (req, res) => {
    sendJson(res, 200, { rows: db.leaderboard() });
  },

  /* 首页小统计：注册用户数 */
  'GET /api/stats': (req, res) => {
    sendJson(res, 200, db.overview());
  },

  /* ---------- 题目反馈（维护日志）：全站公共数据 ---------- */

  /* 提交一条反馈：游客也能提（name 存 NULL，显示为「游客」） */
  'POST /api/feedback': (req, res, body, token, user) => {
    const qid = String(body.qid || '');
    const bank = String(body.bank || '');
    const chapter = String(body.chapter || '');
    if (!QID_RE.test(qid) || !BANK_RE.test(bank) || !CHAPTER_RE.test(chapter) || chapter.indexOf(bank + '-') !== 0) {
      return sendJson(res, 400, { error: '题目定位参数不正确' });
    }
    if (['question', 'answer', 'analysis'].indexOf(body.type) < 0) {
      return sendJson(res, 400, { error: '反馈类型不正确' });
    }
    if (!Number.isInteger(body.qNo) || body.qNo < 1 || body.qNo > 10000) {
      return sendJson(res, 400, { error: '题号不正确' });
    }
    const text = String(body.text || '').trim();
    if (!text) return sendJson(res, 400, { error: '请先写下你的判断依据' });
    if (text.length > 500) return sendJson(res, 400, { error: '反馈最多 500 字' });
    const rec = db.feedbackInsert({ qid, bank, chapter, qNo: body.qNo, type: body.type, text }, user ? user.name : null);
    sendJson(res, 200, { ok: true, rec });
  },

  /* 反馈列表：公开接口（游客也能看待处理清单）；登录时每条会带 mine 标记 */
  'GET /api/feedback': (req, res, body, token, user) => {
    sendJson(res, 200, { list: db.feedbackList(user ? user.name : null) });
  },

  /* 标记 / 取消标记「已处理」：登录用户即可（本站的维护者就是使用者） */
  'POST /api/feedback/done': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const id = String(body.id || '');
    if (!id || id.length > 64) return sendJson(res, 400, { error: '参数不正确' });
    if (!db.feedbackSetDone(id, !!body.done)) return sendJson(res, 400, { error: '这条反馈不存在（可能已被删除）' });
    sendJson(res, 200, { ok: true });
  },

  /* 删除反馈：仅限本人登录时提交的（SQL 里限定 name，游客提交的删不掉） */
  'POST /api/feedback/remove': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    const id = String(body.id || '');
    if (!db.feedbackRemove(id, user.name)) return sendJson(res, 400, { error: '只能删除自己登录时提交的反馈' });
    sendJson(res, 200, { ok: true });
  },

  /* 清空我的全部学习数据（账号保留） */
  'POST /api/clear-my-data': (req, res, body, token, user) => {
    if (!user) return sendJson(res, 401, { error: '请先登录' });
    db.clearMyData(user.name);
    sendJson(res, 200, { ok: true });
  },
};

/* ---------- 静态文件（网站前端部分） ---------- */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function serveStatic(req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    return sendText(res, 400, '路径格式不正确');
  }
  if (urlPath === '/') urlPath = '/index.html';

  // 敏感文件拦截：后端代码、构建工具、题库原文（.md）、package.json 不对外提供。
  // 注意按小写匹配：Windows 文件系统不区分大小写，/SERVER/server.js 也会指向真文件
  const lower = urlPath.toLowerCase();
  if (lower === '/package.json' || /^\/server(\/|$)/.test(lower) ||
      /^\/tools(\/|$)/.test(lower) || /\.md$/.test(lower) || lower === '/data.db') {
    return sendText(res, 404, 'Not Found');
  }

  const abs = path.join(ROOT, urlPath);
  // 防目录穿越：解析后的路径必须仍在网站根目录内（比如 /../Windows 会被拦下）
  const rel = path.relative(ROOT, abs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return sendText(res, 403, 'Forbidden');
  }

  fs.stat(abs, (err, stat) => {
    if (err) return sendText(res, 404, 'Not Found：' + urlPath);
    const file = stat.isDirectory() ? path.join(abs, 'index.html') : abs;
    fs.readFile(file, (err2, buf) => {
      if (err2) return sendText(res, 404, 'Not Found：' + urlPath);
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache', // 开发时改了文件刷新就能看到效果
      });
      res.end(buf);
    });
  });
}

/* ---------- 请求分发 ---------- */

const server = http.createServer(async (req, res) => {
  let pathname = '/';
  try {
    pathname = new URL(req.url, 'http://localhost').pathname;
  } catch (e) { /* 保持默认 '/' */ }

  // ---- /api/ 开头：走 JSON 接口 ----
  if (pathname.startsWith('/api/')) {
    const key = req.method + ' ' + pathname;
    const handler = api[key];
    if (!handler) {
      return sendJson(res, 404, { error: '接口不存在：' + key });
    }
    try {
      let body = {};
      if (req.method === 'POST') body = await readBody(req);
      const token = tokenOf(req);
      const user = db.sessionUser(token); // 没带 token 或 token 过期 → null（未登录）
      handler(req, res, body, token, user);
    } catch (err) {
      console.error('[接口出错]', key, err.message);
      if (!res.headersSent) sendJson(res, err.status || 500, { error: err.status ? err.message : '服务器内部错误' });
    }
    return;
  }

  // ---- 其余：静态文件 ----
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendText(res, 405, 'Method Not Allowed');
  }
  serveStatic(req, res);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('端口 ' + PORT + ' 已被占用：可能已经有一个服务器在运行。');
    console.error('先关掉旧的（Ctrl+C），或换个端口：PORT=3001 node server/server.js');
  } else {
    console.error('服务器启动失败：', err.message);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log('✔ 刷题后端已启动');
  console.log('  浏览器访问：http://localhost:' + PORT);
  console.log('  数据库文件：server/data.db（首次运行自动创建）');
  console.log('  当前注册用户：' + db.overview().users + ' 个');
  console.log('  按 Ctrl+C 停止服务器');
});
