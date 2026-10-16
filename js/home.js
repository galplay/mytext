/* js/home.js —— 入口页：渲染两个题库的章节卡片与学习进度 */
(function () {
  'use strict';

  var banks = window.QUIZ_BANKS || {};
  var BANK_ORDER = ['web', 'java'];

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function chapterFile(bankId, idx) {
    return 'chapters/' + bankId + '-' + String(idx + 1).padStart(2, '0') + '.html';
  }

  function render() {
    var host = document.getElementById('bankSections');
    host.innerHTML = '';

    var bankCount = 0;
    var chapterCount = 0;
    var qTotal = 0;
    var qAnswered = 0;
    var fold = Store.fold.load(); // { web: true } —— true 表示该区收起（默认收起）

    BANK_ORDER.forEach(function (bankId) {
      var bank = banks[bankId];
      if (!bank) return;
      bankCount++;

      var nQ = bank.chapters.reduce(function (s, c) { return s + c.questions.length; }, 0);
      var bankAnswered = 0;
      var folded = fold[bankId] !== false; // 没有记录或记的是 true → 收起

      var section = el('section', 'bank-section');

      // 折叠标题栏：点击展开 / 收起本区章节（状态记在 quiz.fold 里，下次打开保持）
      var head = el('h2', 'bank-head');
      var toggle = el('button', 'bank-toggle');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', folded ? 'false' : 'true');
      toggle.setAttribute('aria-controls', 'grid-' + bankId);
      toggle.appendChild(el('span', 'bank-toggle__title', bank.short));
      var metaEl = el('span', 'bank-toggle__meta', bank.chapters.length + ' 个章节 · ' + nQ + ' 题');
      toggle.appendChild(metaEl);
      toggle.appendChild(el('span', 'bank-toggle__caret', '▾'));
      head.appendChild(toggle);
      section.appendChild(head);

      var grid = el('div', 'chapter-grid');
      grid.id = 'grid-' + bankId;
      grid.hidden = folded;
      bank.chapters.forEach(function (c, idx) {
        var st = Store.chapterStats(bankId, c.id, c.questions);
        chapterCount++;
        qTotal += st.total;
        qAnswered += st.answered;
        bankAnswered += st.answered;

        var card = el('a', 'chapter-card');
        card.href = chapterFile(bankId, idx);

        var top = el('div', 'chapter-card__top');
        top.appendChild(el('h3', 'chapter-card__title', c.title));
        top.appendChild(el('span', 'chapter-card__count', c.questions.length + ' 题'));
        card.appendChild(top);

        var bar = el('div', 'progressbar');
        var fill = el('span', 'progressbar__fill');
        fill.style.width = st.percent + '%';
        bar.appendChild(fill);
        card.appendChild(bar);

        if (st.answered === 0) {
          card.appendChild(el('p', 'chapter-card__meta is-new', '未开始'));
        } else {
          var rate = Math.round((st.correct / st.answered) * 100);
          card.appendChild(el('p', 'chapter-card__meta',
            '已答 ' + st.answered + ' / ' + st.total + ' · 正确率 ' + rate + '%' + (st.done ? ' · 已完成' : '')));
        }

        card.appendChild(el('span', 'chapter-card__cta',
          st.answered === 0 ? '开始刷题' : (st.done ? '再刷一遍' : '继续作答')));

        grid.appendChild(card);
      });

      if (bankAnswered > 0) metaEl.textContent += ' · 已答 ' + bankAnswered;
      toggle.addEventListener('click', function () {
        grid.hidden = !grid.hidden;
        toggle.setAttribute('aria-expanded', grid.hidden ? 'false' : 'true');
        var f = Store.fold.load();
        f[bankId] = grid.hidden; // true = 收起
        Store.fold.save(f);
      });

      section.appendChild(grid);
      host.appendChild(section);
    });

    var statsHost = document.getElementById('heroStats');
    statsHost.innerHTML = '';
    var chips = [bankCount + ' 个题库', chapterCount + ' 个章节', qTotal + ' 道题'];
    chips.push(qAnswered > 0
      ? '累计已答 ' + qAnswered + ' 道'
      : (Store.session.get() !== 'guest' ? '数据与服务器实时同步' : '进度保存在本机浏览器'));
    chips.forEach(function (t) { statsHost.appendChild(el('span', 'stat-chip', t)); });

    refreshTools();
  }

  /* ---------- 错题本 / 收藏夹 ---------- */

  // 题干是 Markdown（可能含代码块），列表里只截取纯文本摘要
  function snippet(text, max) {
    var s = text
      .replace(/```[\s\S]*?```/g, ' [代码] ')
      .replace(/[`*#>\n|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return s.length > max ? s.slice(0, max) + '…' : s;
  }

  /* 扫描全部题库：收集「最近一次作答为错」的题与「已收藏」的题 */
  function collect() {
    var wrong = [];
    var starred = [];
    BANK_ORDER.forEach(function (bankId) {
      var bank = banks[bankId];
      if (!bank) return;
      var stars = Store.stars.load(bankId);
      bank.chapters.forEach(function (c, ci) {
        var prog = Store.progress.load(bankId, c.id);
        c.questions.forEach(function (q, qi) {
          var item = {
            bankShort: bank.short,
            chapterTitle: c.title,
            page: chapterFile(bankId, ci),
            no: qi + 1,
            qid: q.id,
            snippet: snippet(q.text, 46),
          };
          var rec = prog.r && prog.r[q.id];
          if (rec && rec.ok === false) wrong.push(item);
          if (stars[q.id]) starred.push(item);
        });
      });
    });
    return { wrong: wrong, starred: starred };
  }

  /* 把收集结果按「题库 · 章节」分组（收集顺序已定，遇到新章节就开新组） */
  function groupByChapter(list) {
    var groups = [];
    var seen = {};
    list.forEach(function (it) {
      var key = it.page + '|' + it.chapterTitle;
      if (!seen[key]) {
        seen[key] = { title: it.bankShort + ' · ' + it.chapterTitle, page: it.page, items: [] };
        groups.push(seen[key]);
      }
      seen[key].items.push(it);
    });
    return groups;
  }

  var TOOLS = {
    wrong: { card: 'wrongBookBtn', count: 'wrongBookCount', desc: 'wrongBookDesc', panel: 'wrongBookPanel' },
    starred: { card: 'starBookBtn', count: 'starBookCount', desc: 'starBookDesc', panel: 'starBookPanel' },
  };
  var openTool = null; // 当前展开的面板：null | 'wrong' | 'starred'

  function renderToolRows(panel, kind, list) {
    panel.innerHTML = '';
    if (!list.length) {
      panel.appendChild(el('p', 'tool-empty', kind === 'wrong'
        ? '错题本是空的，继续保持！之后答错的题会自动汇总到这里；把某道错题重做对了，它就会自动移出。'
        : '收藏夹是空的。答题时点右上角「☆ 收藏」（快捷键 S），想复习的题就会收集到这里。'));
      return;
    }
    groupByChapter(list).forEach(function (g) {
      var group = el('div', 'tool-group');

      var head = el('div', 'tool-group__head');
      head.appendChild(el('strong', null, g.title));
      var link = el('a', 'tool-group__link', kind === 'wrong' ? '只看本章错题 →' : '只看本章收藏 →');
      link.href = g.page + '?mode=' + (kind === 'wrong' ? 'wrong' : 'star');
      head.appendChild(link);
      group.appendChild(head);

      var rows = el('div', 'tool-list');
      g.items.forEach(function (it) {
        var row = el('a', 'tool-row');
        row.href = it.page + '?q=' + encodeURIComponent(it.qid); // 深链接：章节页定位到这道题
        row.title = '第 ' + it.no + ' 题：' + it.snippet;
        row.appendChild(el('span', 'tool-row__no', '第 ' + it.no + ' 题'));
        row.appendChild(el('span', 'tool-row__text', it.snippet));
        row.appendChild(el('span', 'tool-row__go', kind === 'wrong' ? '去重做 →' : '去复习 →'));
        rows.appendChild(row);
      });
      group.appendChild(rows);
      panel.appendChild(group);
    });
  }

  function setOpenTool(key) {
    openTool = (openTool === key) ? null : key;
    var data = collect();
    Object.keys(TOOLS).forEach(function (k) {
      var def = TOOLS[k];
      var on = k === openTool;
      $(def.panel).hidden = !on;
      $(def.card).setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) renderToolRows($(def.panel), k, k === 'wrong' ? data.wrong : data.starred);
    });
    syncToolHash();
  }

  // 展开状态记录在地址栏 #wrong / #starred 上：刷新、返回首页后仍保持展开
  function syncToolHash() {
    try {
      history.replaceState(null, '', location.pathname + location.search + (openTool ? '#' + openTool : ''));
    } catch (e) { /* 个别浏览器在 file:// 下可能拒绝，忽略即可 */ }
  }

  /* 刷新两张卡片的数量与文案；面板开着就同步重画列表 */
  function refreshTools() {
    var data = collect();
    [['wrong', data.wrong], ['starred', data.starred]].forEach(function (pair) {
      var kind = pair[0];
      var list = pair[1];
      var def = TOOLS[kind];
      $(def.count).textContent = String(list.length);
      $(def.card).classList.toggle('is-empty', list.length === 0);
      $(def.desc).textContent = kind === 'wrong'
        ? (list.length ? '错题待重做，点开逐题过关' : '答错的题会自动汇总到这里')
        : (list.length ? '想重点复习的题，点开查看' : '答题时点「☆ 收藏」把题收进来');
      if (!$(def.panel).hidden) renderToolRows($(def.panel), kind, list);
    });
  }

  function bindTools() {
    Object.keys(TOOLS).forEach(function (k) {
      $(TOOLS[k].card).addEventListener('click', function () { setOpenTool(k); });
    });
    var h = location.hash.slice(1);
    if (h === 'wrong' || h === 'starred') setOpenTool(h);
  }

  /* 排行榜卡片：游客提示登录，登录后点开看名次、和好友 PK。
     卡片右上角的数字 = 服务器上注册的账号总数（从 /api/stats 取） */
  function updateRankCard() {
    var num = $('rankCount');
    var desc = $('rankDesc');
    if (!num || !desc) return;
    num.textContent = '…';
    desc.textContent = Store.session.get() !== 'guest'
      ? '看看自己的名次，和好友 PK'
      : '登录后可参与排行与好友 PK';
    Store.overview().then(function (res) {
      num.textContent = res.ok ? String(res.users) : '—';
    });
  }

  function init() {
    if (!window.QUIZ_BANKS || !banks.web || !banks.java) {
      document.getElementById('bankSections').innerHTML =
        '<p class="notice notice--error">题库数据没有加载成功：请确认 data/web.js、data/java.js 存在，并通过 index.html 打开本页。</p>';
      var tools = document.getElementById('myTools');
      if (tools) tools.hidden = true; // 数据都没加载上，错题本/收藏夹也就无从谈起
      return;
    }

    UI.bindHeaderTools();
    // 等 Store.ready()：登录用户先把学习数据从服务器拉下来，再渲染进度（游客立即开始）
    Store.ready().then(function () {
      render();
      bindTools();
      updateRankCard();
    });

    var clearBtn = document.getElementById('clearAll');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        var who = Store.session.get();
        var where = who === 'guest' ? '本机的' : '服务器上的';
        if (!window.confirm('清除' + (who === 'guest' ? '游客身份' : '「' + who + '」账号') + '在' + where +
          '全部学习数据？所有章节的进度、错题、收藏与笔记都会被清空（账号、主题、字号保留）。')) return;
        Store.clearAll().then(function () {
          render();
          UI.toast('已清除当前身份的数据');
        });
      });
    }
  }

  init();
})();
