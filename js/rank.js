/* js/rank.js —— 排行榜 + 好友 PK（后端版）
 *
 * 数据来源：服务器的 /api/leaderboard（所有账号的战绩，SQL 聚合好的），
 * 每次点「刷新」重新拉一遍，所以名次是全体账号的实时排名。
 *
 * 排序规则（在浏览器里对拉回来的行排序，逻辑和纯静态版一致）：
 *   - 默认按正确率从高到低；点表头可切换按 已答 / 正确率 / 用时 / 完成章节 排；
 *   - 用时是"越低越好"，其他指标"越高越好"；再点一次同一表头反向；
 *   - 一题都没答过的账号永远沉底，名次显示「—」（不给虚假名次）。
 *
 * PK：地址带 ?with=用户名 时，页顶出现双方对比面板（逐项对比，占优的一方标绿）。
 * 未登录只能看榜；登录后还能"只看好友"、加好友、发起 PK。
 */
(function () {
  'use strict';

  var me = Store.session.get(); // 'guest' 或登录用户名（拉取数据后可能因 token 失效变回 guest）
  var banks = window.QUIZ_BANKS || {};

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* 排序状态：key = 排序字段，dir = 'asc' | 'desc' */
  var state = { key: 'rate', dir: 'desc', friendsOnly: false };

  /* 每个指标"自然方向"：点表头第一次按自然方向排 */
  var NATURAL_DIR = { rate: 'desc', answered: 'desc', elapsed: 'asc', chapters: 'desc' };

  /* --- 从服务器拿到的数据 --- */
  var allRows = [];    // 榜单行：{ name, nick, avatar, answered, correct, rate, elapsed, chaptersDone, stars, notes }
  var friendSet = {};  // 我的好友用户名集合（登录后才有）

  function rowOf(name) {
    for (var i = 0; i < allRows.length; i++) {
      if (allRows[i].name === name) return allRows[i];
    }
    return null;
  }

  /* 题库总章节数（PK 面板里显示 "x / 总数" 用） */
  function totalChaptersCount() {
    var n = 0;
    Object.keys(banks).forEach(function (k) {
      var b = banks[k];
      if (b) n += (b.chapters || []).length;
    });
    return n;
  }

  /* ---------- ?with=用户名（PK 面板） ---------- */
  function withName() {
    var m = /[?&]with=([^&#]+)/.exec(location.search);
    if (!m) return '';
    var v;
    try { v = decodeURIComponent(m[1]); } catch (e) { return ''; }
    return v && rowOf(v) ? v : '';
  }

  /* ---------- 排行数据 ---------- */
  function buildRows() {
    var rows = allRows.map(function (r) {
      return { name: r.name, rec: { nick: r.nick, avatar: r.avatar }, st: r };
    });
    if (state.friendsOnly && me !== 'guest') {
      rows = rows.filter(function (r) { return r.name === me || friendSet[r.name]; });
    }
    var k = state.key;
    var mul = state.dir === 'asc' ? 1 : -1;
    rows.sort(function (a, b) {
      // 一题没答的永远沉底
      var az = a.st.answered === 0 ? 1 : 0;
      var bz = b.st.answered === 0 ? 1 : 0;
      if (az !== bz) return az - bz;
      var va = a.st[k === 'chapters' ? 'chaptersDone' : k];
      var vb = b.st[k === 'chapters' ? 'chaptersDone' : k];
      if (va !== vb) return (va - vb) * mul;
      if (a.st.correct !== b.st.correct) return b.st.correct - a.st.correct; // 同分比答对数
      return String(a.name).localeCompare(String(b.name), 'zh');
    });
    return rows;
  }

  /* ---------- 表格渲染 ---------- */
  function renderTable() {
    var rows = buildRows();
    var tbody = $('rankBody');
    var scroll = $('rankScroll');
    var empty = $('rankEmpty');
    tbody.innerHTML = '';

    if (!rows.length) {
      scroll.hidden = true;
      empty.hidden = false;
      if (!allRows.length) {
        empty.textContent = '服务器上还没有账号。点右上角「登录」注册一个，刷几题就会出现在排行榜上。';
      } else if (state.friendsOnly) {
        empty.textContent = '好友列表是空的。在下面（或对方的行里）点「加好友」，从这里就能一键 PK 了。';
      } else {
        empty.textContent = '没有可显示的数据。';
      }
      return;
    }
    scroll.hidden = false;
    empty.hidden = true;

    var rankNo = 0;
    rows.forEach(function (r) {
      var ranked = r.st.answered > 0;
      if (ranked) rankNo++;

      var tr = el('tr');
      if (r.name === me) tr.className = 'is-me';

      tr.appendChild(el('td', 'rank-no' + (ranked && rankNo <= 3 ? ' is-top' : ''), ranked ? String(rankNo) : '—'));

      var userTd = el('td');
      var u = el('div', 'rank-user');
      /* 头像 + 昵称做成链接：点开 TA 的个人主页（profile.html?u= 只读模式） */
      var profHref = 'profile.html?u=' + encodeURIComponent(r.name);
      var avLink = el('a', 'rank-user__link');
      avLink.href = profHref;
      avLink.title = '查看 ' + (r.rec.nick || r.name) + ' 的主页';
      avLink.appendChild(UI.avatarEl(r.rec, 'sm'));
      u.appendChild(avLink);
      var ub = el('div', 'rank-user__text');
      var nickA = el('a', 'rank-user__link');
      nickA.href = profHref;
      nickA.title = avLink.title;
      nickA.appendChild(el('strong', null, r.rec.nick || r.name));
      ub.appendChild(nickA);
      ub.appendChild(el('span', 'rank-user__name', '@' + r.name));
      u.appendChild(ub);
      userTd.appendChild(u);
      tr.appendChild(userTd);

      tr.appendChild(el('td', 'rank-num', String(r.st.answered)));
      tr.appendChild(el('td', 'rank-num', r.st.answered ? r.st.rate + '%' : '—'));
      tr.appendChild(el('td', 'rank-num', UI.fmtDur(r.st.elapsed)));
      tr.appendChild(el('td', 'rank-num', r.st.chaptersDone + ' / ' + totalChaptersCount()));

      /* 操作列：PK（谁都能比）；加好友按钮只在"已登录 + 不是自己 + 还不是好友"时出现 */
      var act = el('td');
      var wrap = el('div', 'rank-actions');

      if (r.name === me) {
        wrap.appendChild(el('span', 'rank-self-tag', '我'));
      } else {
        var pk = el('a', 'btn btn--ghost btn--sm', 'PK');
        if (me === 'guest') {
          pk.href = 'account.html?next=rank.html';
          pk.title = '登录后才能发起 PK';
        } else {
          pk.href = 'rank.html?with=' + encodeURIComponent(r.name);
          pk.title = '和 ' + (r.rec.nick || r.name) + ' 对比战绩';
        }
        wrap.appendChild(pk);

        if (me !== 'guest') {
          if (friendSet[r.name]) {
            wrap.appendChild(el('span', 'rank-friend-tag', '✓ 好友'));
          } else {
            var add = el('button', 'btn btn--ghost btn--sm', '加好友');
            add.type = 'button';
            add.addEventListener('click', function () {
              add.disabled = true;
              Store.friendAdd(r.name).then(function (res) {
                if (!res.ok) { add.disabled = false; UI.toast(res.err); return; }
                friendSet[r.name] = true;
                UI.toast('已和 ' + (r.rec.nick || r.name) + ' 成为好友');
                renderTable();
              });
            });
            wrap.appendChild(add);
          }
        }
      }
      act.appendChild(wrap);
      tr.appendChild(act);

      tbody.appendChild(tr);
    });
  }

  /* ---------- PK 面板 ---------- */
  function renderPk() {
    var name = withName();
    var panel = $('pkPanel');
    if (!name || me === 'guest' || name === me) {
      panel.hidden = true;
      return;
    }
    var mine = rowOf(me);
    var theirs = rowOf(name);
    if (!mine || !theirs) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;

    /* 头部：我 VS TA */
    var head = $('pkHead');
    head.innerHTML = '';
    function side(r) {
      var d = el('div', 'pk-head__side');
      d.appendChild(UI.avatarEl({ nick: r.nick, avatar: r.avatar }, 'lg'));
      d.appendChild(el('strong', 'pk-head__nick', r.nick || r.name));
      d.appendChild(el('span', 'pk-head__user', '@' + r.name));
      return d;
    }
    head.appendChild(side(mine));
    head.appendChild(el('div', 'pk-head__vs', 'VS'));
    head.appendChild(side(theirs));

    /* 对比行：lower=true 表示越小越好（用时）；空值显示「—」不判胜负 */
    var total = totalChaptersCount();
    var defs = [
      { label: '已答题数', a: mine.answered, b: theirs.answered, fmt: function (v) { return v + ' 题'; } },
      { label: '正确率', a: mine.answered ? mine.rate : null, b: theirs.answered ? theirs.rate : null, fmt: function (v) { return v + '%'; } },
      { label: '累计用时', a: mine.elapsed >= 1000 ? mine.elapsed : null, b: theirs.elapsed >= 1000 ? theirs.elapsed : null, lower: true, fmt: function (v) { return UI.fmtDur(v); } },
      { label: '完成章节', a: mine.chaptersDone, b: theirs.chaptersDone, fmt: function (v) { return v + ' / ' + total; } },
      { label: '收藏', a: mine.stars, b: theirs.stars, fmt: function (v) { return v + ' 题'; } },
      { label: '笔记', a: mine.notes, b: theirs.notes, fmt: function (v) { return v + ' 条'; } },
    ];

    var host = $('pkRows');
    host.innerHTML = '';
    defs.forEach(function (d) {
      var row = el('div', 'pk-row');

      var aWin = false;
      var bWin = false;
      if (d.a != null && d.b != null && d.a !== d.b) {
        var aBetter = d.lower ? d.a < d.b : d.a > d.b;
        aWin = aBetter;
        bWin = !aBetter;
      }

      var va = el('span', 'pk-val' + (aWin ? ' is-win' : ''), d.a == null ? '—' : d.fmt(d.a));
      var vb = el('span', 'pk-val' + (bWin ? ' is-win' : ''), d.b == null ? '—' : d.fmt(d.b));
      row.appendChild(va);
      row.appendChild(el('span', 'pk-label', d.label));
      row.appendChild(vb);
      host.appendChild(row);
    });
  }

  /* ---------- 表头排序按钮 ---------- */
  var SORTS = [
    ['sortAnswered', 'answered', '已答'],
    ['sortRate', 'rate', '正确率'],
    ['sortElapsed', 'elapsed', '用时'],
    ['sortChapters', 'chapters', '完成章节'],
  ];

  function syncSortButtons() {
    SORTS.forEach(function (s) {
      var btn = $(s[0]);
      var active = state.key === s[1];
      btn.textContent = s[2] + (active ? (state.dir === 'asc' ? ' ↑' : ' ↓') : '');
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  /* ---------- 页面初始化 ---------- */

  function stamp() {
    var d = new Date();
    $('rankTime').textContent =
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0') + ':' +
      String(d.getSeconds()).padStart(2, '0');
  }

  function renderAll() {
    stamp();
    renderPk();
    renderTable();
    syncSortButtons();
  }

  /* 顶部提示条：游客看「登录后参与」，登录用户看「只看好友」按钮 */
  function syncChrome() {
    $('guestBanner').hidden = me !== 'guest';
    $('friendFilter').hidden = me === 'guest';
  }

  /* 从服务器拉数据：排行榜（公开）+ 我的资料（登录时，用于"只看好友"与 PK） */
  function load() {
    var needMe = Store.session.get() !== 'guest';
    return Promise.all([
      Store.leaderboard(),
      needMe ? Store.me() : Promise.resolve(null),
    ]).then(function (pair) {
      var lb = pair[0];
      var mr = pair[1];
      if (lb.ok) allRows = lb.rows;
      else UI.toast('排行榜加载失败：' + lb.err);

      if (mr) {
        if (mr.ok) {
          me = mr.data.user.name;
          friendSet = {};
          (mr.data.user.friends || []).forEach(function (f) { friendSet[f.name] = true; });
        } else if (mr.status === 401) {
          me = 'guest'; // token 失效：Store 已切回游客身份
          friendSet = {};
        }
      }
      syncChrome();
      renderAll();
    });
  }

  function init() {
    UI.bindHeaderTools();
    syncChrome();

    SORTS.forEach(function (s) {
      $(s[0]).addEventListener('click', function () {
        if (state.key === s[1]) {
          state.dir = state.dir === 'asc' ? 'desc' : 'asc';
        } else {
          state.key = s[1];
          state.dir = NATURAL_DIR[s[1]];
        }
        syncSortButtons();
        renderTable();
      });
    });

    $('friendFilter').addEventListener('click', function () {
      state.friendsOnly = !state.friendsOnly;
      this.classList.toggle('is-on', state.friendsOnly);
      this.setAttribute('aria-pressed', state.friendsOnly ? 'true' : 'false');
      renderTable();
    });

    $('refreshBtn').addEventListener('click', function () {
      load().then(function () { UI.toast('已刷新'); });
    });

    renderAll(); // 先把空表 / 提示画出来，数据到了再刷一遍
    load();
  }

  init();
})();
