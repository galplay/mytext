/* js/quiz.js —— 章节答题引擎（由 chapters/*.html 共用）
 *
 * 设计要点：
 *   - 判分幂等：一道题提交过一次就锁定，「重复点提交成绩不变」
 *   - 断点续答：当前题号 + 已作答记录实时保存（游客存本机浏览器；登录用户
 *     由 js/store.js 增量同步到服务器），刷新后接着做
 *   - 选择题草稿也会即时保存（做到一半被叫走，回来选项还在）
 *   - 筛选：只看错题 / 只看收藏；交卷后出结果页，可重做错题
 *   - 深链接：首页「错题本 / 收藏夹」可带 ?q=<题id> 直达某题、?mode=wrong|star 只看筛选题
 *   - 题目笔记：每题一个自动保存的笔记框，写到一半切题 / 刷新都不会丢
 */
(function () {
  'use strict';

  var body = document.body;
  var bankId = body.dataset.bank;
  var chapterId = body.dataset.chapter;
  var bank = window.QUIZ_BANKS && window.QUIZ_BANKS[bankId];
  var $ = function (id) { return document.getElementById(id); };

  if (!bank || !window.Store || !window.MD) {
    $('quizView').hidden = true;
    $('quizMeta').textContent = '初始化失败：题库数据或基础模块没有加载成功，请从 index.html 首页进入本章。';
    return;
  }

  var chapter = null;
  for (var ci = 0; ci < bank.chapters.length; ci++) {
    if (bank.chapters[ci].id === chapterId) { chapter = bank.chapters[ci]; break; }
  }
  if (!chapter) {
    $('quizView').hidden = true;
    $('quizMeta').textContent = '没有找到章节「' + chapterId + '」对应的数据。';
    return;
  }

  var questions = chapter.questions;
  var total = questions.length;
  var indexOfQid = {};
  questions.forEach(function (q, idx) { indexOfQid[q.id] = idx; });

  // 答题数据等 boot() 里加载：登录用户要先把数据从服务器拉下来（Store.ready()）
  var progress = null;
  var stars = {};
  var notes = {};

  var state = { mode: 'all', order: [], pos: 0 };

  /* ---------- 统计 ---------- */

  function answeredCount() {
    return questions.filter(function (q) {
      var rec = progress.r[q.id];
      return rec && rec.ok !== undefined;
    }).length;
  }
  function correctCount() {
    return questions.filter(function (q) {
      var rec = progress.r[q.id];
      return rec && rec.ok === true;
    }).length;
  }
  function wrongIndexes() {
    var out = [];
    questions.forEach(function (q, idx) {
      var rec = progress.r[q.id];
      if (rec && rec.ok === false) out.push(idx);
    });
    return out;
  }
  function starIndexes() {
    var out = [];
    questions.forEach(function (q, idx) { if (stars[q.id]) out.push(idx); });
    return out;
  }

  function buildOrder(mode) {
    if (mode === 'wrong') return wrongIndexes();
    if (mode === 'star') return starIndexes();
    return questions.map(function (_, idx) { return idx; });
  }

  function save() { Store.progress.save(bankId, chapterId, progress); }
  function currentIndex() { return state.order[state.pos]; }
  function currentQ() { return questions[currentIndex()]; }
  function isLastInOrder() { return state.pos >= state.order.length - 1; }
  function orderAllAnswered() {
    return state.order.every(function (idx) {
      var rec = progress.r[questions[idx].id];
      return rec && rec.ok !== undefined;
    });
  }

  /* ---------- 渲染 ---------- */

  function renderMeta() {
    var answered = answeredCount();
    var correct = correctCount();
    $('quizMeta').innerHTML = '本章共 ' + total + ' 题 · 已答 <strong>' + answered + '</strong> / ' + total + ' · 答对 ' + correct;
    var bar = $('globalProgressBar');
    var pct = total ? Math.round((answered / total) * 100) : 0;
    bar.setAttribute('aria-valuenow', String(pct));
    bar.querySelector('.progressbar__fill').style.width = pct + '%';
  }

  function renderModes() {
    var bar = $('modeBar');
    bar.innerHTML = '';
    var defs = [
      { mode: 'all', label: '全部', n: total },
      { mode: 'wrong', label: '错题', n: wrongIndexes().length },
      { mode: 'star', label: '收藏', n: starIndexes().length },
    ];
    if (state.mode === 'redo') {
      defs.unshift({ mode: 'redo', label: '重做错题中', n: state.order.length });
    }
    defs.forEach(function (d) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip-btn' + (state.mode === d.mode ? ' is-active' : '');
      btn.textContent = d.label + ' ' + d.n;
      if (d.mode !== 'all' && d.mode !== 'redo' && d.n === 0) btn.disabled = true;
      btn.addEventListener('click', function () { switchMode(d.mode); });
      bar.appendChild(btn);
    });
  }

  function renderOptions(q, rec) {
    var box = $('qOptions');
    box.innerHTML = '';
    if (!q.options.length) {
      var note = document.createElement('p');
      note.className = 'notice notice--info';
      note.textContent = '本题在题库原文中缺少选项，无法作答；答案与解析见下方。';
      box.appendChild(note);
      return;
    }
    var submitted = rec && rec.ok !== undefined;
    var draft = rec && rec.ok === undefined ? rec.c : null;
    q.options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.dataset.key = opt.k;

      var key = document.createElement('span');
      key.className = 'option__key';
      key.textContent = opt.k;

      var txt = document.createElement('span');
      txt.className = 'option__text';
      txt.innerHTML = MD.render(opt.t);

      btn.appendChild(key);
      btn.appendChild(txt);

      if (submitted) {
        btn.disabled = true;
        var chosen = rec.c.indexOf(opt.k) >= 0;
        var isAnswer = q.answer.indexOf(opt.k) >= 0;
        if (isAnswer) btn.classList.add('is-correct');
        else if (chosen) btn.classList.add('is-wrong');
        else btn.classList.add('is-muted');
      } else {
        if (draft && draft.indexOf(opt.k) >= 0) btn.classList.add('is-selected');
        btn.addEventListener('click', function () { selectOption(opt.k); });
      }
      box.appendChild(btn);
    });
  }

  function judgeText(letter) { return letter === 'A' ? '正确' : '错误'; }

  function renderVerdictAndAnalysis(q, rec) {
    var verdict = $('qVerdict');
    var analysis = $('qAnalysis');
    var submitted = rec && rec.ok !== undefined;

    if (submitted) {
      verdict.hidden = false;
      verdict.className = 'qcard__verdict ' + (rec.ok ? 'is-ok' : 'is-bad');
      var answerText = q.type === 'judge'
        ? judgeText(q.answer[0] || 'A')
        : q.answer.join('、');
      if (rec.ok) {
        verdict.textContent = '✓ 回答正确';
      } else {
        verdict.textContent = '✗ 回答错误 · 你的答案：' + rec.c.join('、') + ' · 正确答案：' + answerText;
      }
    } else {
      verdict.hidden = true;
      verdict.textContent = '';
    }

    var showAnalysis = submitted || !q.options.length;
    analysis.hidden = !showAnalysis;
    if (showAnalysis) {
      $('qAnalysisBody').innerHTML = q.analysis
        ? MD.render(q.analysis)
        : '<p>（题库原文未提供解析）</p>';
    }
  }

  function renderStar(q) {
    var btn = $('starBtn');
    var on = !!stars[q.id];
    btn.classList.toggle('is-starred', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? '★ 已收藏' : '☆ 收藏';
  }

  /* 笔记框：有笔记自动展开；同一题重渲染时保留用户手动展开的状态 */
  function renderNote(q) {
    var box = $('qNoteBox');
    var text = notes[q.id] || '';
    $('qNoteText').value = text;
    if (text) box.open = true;
    else if (box.dataset.qid !== q.id) box.open = false;
    box.dataset.qid = q.id;
    $('qNoteState').textContent = text ? '已保存' : '';
  }

  function renderButtons(q, rec) {
    var submitted = rec && rec.ok !== undefined;
    var submitBtn = $('submitBtn');
    if (!q.options.length) {
      submitBtn.disabled = false;
      submitBtn.textContent = '跳过本题 →';
      submitBtn.dataset.action = 'skip';
    } else if (submitted) {
      submitBtn.disabled = false;
      submitBtn.textContent = isLastInOrder() ? '看结果' : '下一题';
      submitBtn.dataset.action = 'next';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = '提交答案';
      submitBtn.dataset.action = 'submit';
    }
    $('prevBtn').disabled = state.pos <= 0;
    $('nextBtn').disabled = isLastInOrder();
  }

  function renderQuestion() {
    var q = currentQ();
    if (!q) return;
    var idx = currentIndex();
    var rec = progress.r[q.id];

    var typeLabel = { single: '单选题', multi: '多选题（可多选）', judge: '判断题' }[q.type] || '单选题';
    $('qType').textContent = typeLabel;
    $('qNo').textContent = '第 ' + (idx + 1) + ' / ' + total + ' 题';
    $('qText').innerHTML = MD.render(q.text);

    renderOptions(q, rec);
    renderVerdictAndAnalysis(q, rec);
    renderStar(q);
    renderNote(q);
    renderButtons(q, rec);
    renderMeta();
    renderModes();
    if (!$('pad').hidden) renderPad();
  }

  function renderPad() {
    var grid = $('padGrid');
    grid.innerHTML = '';
    var cur = currentIndex();
    questions.forEach(function (q, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(idx + 1);
      var rec = progress.r[q.id];
      if (rec && rec.ok === true) btn.classList.add('is-ok');
      else if (rec && rec.ok === false) btn.classList.add('is-bad');
      if (idx === cur) btn.classList.add('is-cur');
      btn.addEventListener('click', function () { padJump(idx); });
      grid.appendChild(btn);
    });
  }

  /* ---------- 交互 ---------- */

  function selectOption(key) {
    var q = currentQ();
    var rec = progress.r[q.id];
    if (rec && rec.ok !== undefined) return; // 已提交，锁定

    if (q.type === 'multi') {
      var cur = rec && rec.c ? rec.c.slice() : [];
      var at = cur.indexOf(key);
      if (at >= 0) cur.splice(at, 1); else cur.push(key);
      cur.sort();
      if (cur.length) progress.r[q.id] = { c: cur };
      else delete progress.r[q.id];
    } else {
      progress.r[q.id] = { c: [key] };
    }
    save();
    renderQuestion();
  }

  function submitCurrent() {
    var q = currentQ();
    if (!q || !progress) return; // 数据还没加载完（服务器较慢时点得早），忽略
    var rec = progress.r[q.id];
    if (rec && rec.ok !== undefined) return; // 幂等保护：重复提交不改成绩
    if (!rec || !rec.c || !rec.c.length) { UI.toast('请先选择答案'); return; }

    var sel = rec.c.slice().sort();
    var ans = q.answer.slice().sort();
    var ok = sel.length === ans.length && sel.every(function (k, i) { return k === ans[i]; });

    progress.r[q.id] = { c: rec.c.slice(), ok: ok };
    save();
    renderQuestion();
  }

  function nextOrFinish() {
    if (!isLastInOrder()) {
      goTo(state.pos + 1);
      return;
    }
    if (state.mode === 'redo') { progress.done = true; save(); showResult(); return; }
    finish();
  }

  function goTo(pos) {
    if (pos < 0 || pos >= state.order.length) return;
    state.pos = pos;
    if (state.mode === 'all') { progress.i = state.order[pos]; save(); }
    renderQuestion();
    var card = $('qcard');
    if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function switchMode(mode) {
    if (mode === state.mode) return;
    var order = buildOrder(mode);
    if (!order.length && mode !== 'all') return;
    state.mode = mode;
    state.order = order;
    state.pos = 0;
    renderQuestion();
  }

  function padJump(idx) {
    closePad();
    if (state.mode !== 'all') {
      state.mode = 'all';
      state.order = buildOrder('all');
    }
    goTo(state.order.indexOf(idx));
  }

  function openPad() {
    renderPad();
    $('pad').hidden = false;
    $('padClose').focus();
  }
  function closePad() {
    $('pad').hidden = true;
    $('padBtn').focus();
  }

  function toggleStar() {
    var q = currentQ();
    if (!q || !progress) return;
    var on = Store.stars.toggle(bankId, q.id);
    stars = Store.stars.load(bankId);
    renderStar(q);
    renderModes();
    UI.toast(on ? '已收藏本题' : '已取消收藏');
  }

  /* ---------- 结果页 ---------- */

  function showResult() {
    $('quizView').hidden = true;
    $('resultView').hidden = false;
    var correct = correctCount();
    var wrong = wrongIndexes().length;
    var unanswered = total - answeredCount();
    var pct = total ? Math.round((correct / total) * 100) : 0;

    $('resultScore').textContent = '答对 ' + correct + ' / ' + total + '（' + pct + '%）';
    var sub = '答错 ' + wrong + ' 道 · 未作答 ' + unanswered + ' 道';
    if (progress.acc > 0) sub += ' · 累计用时 ' + UI.fmtDur(progress.acc);
    $('resultSub').textContent = sub;

    var list = $('resultWrong');
    list.innerHTML = '';
    var wrongIdx = wrongIndexes();
    if (!wrongIdx.length) {
      var p = document.createElement('p');
      p.className = 'quiz__meta';
      p.textContent = unanswered ? '没有答错的题。' : '全部题目都已答对，太棒了。';
      list.appendChild(p);
    } else {
      wrongIdx.forEach(function (idx) {
        var q = questions[idx];
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'wrong-item';

        var no = document.createElement('span');
        no.className = 'wrong-item__no';
        no.textContent = '第 ' + (idx + 1) + ' 题';

        var txt = document.createElement('span');
        txt.className = 'wrong-item__text';
        txt.textContent = q.text.replace(/[`*#>\n]/g, ' ').slice(0, 40);

        var go = document.createElement('span');
        go.className = 'wrong-item__go';
        go.textContent = '查看';

        item.appendChild(no); item.appendChild(txt); item.appendChild(go);
        item.addEventListener('click', function () { reviewWrongQuestion(idx); });
        list.appendChild(item);
      });
    }
    $('redoWrongBtn').disabled = wrong === 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reviewWrongQuestion(idx) {
    $('resultView').hidden = true;
    $('quizView').hidden = false;
    state.mode = 'all';
    state.order = buildOrder('all');
    goTo(state.order.indexOf(idx));
  }

  function finish() {
    if (!progress) return;
    var unanswered = total - answeredCount();
    if (unanswered > 0 && !window.confirm('还有 ' + unanswered + ' 题未作答，仍要交卷吗？')) return;
    progress.done = true;
    save();
    showResult();
  }

  function redoWrong() {
    if (!progress) return;
    var wrongIdx = wrongIndexes();
    if (!wrongIdx.length) return;
    wrongIdx.forEach(function (idx) { delete progress.r[questions[idx].id]; });
    progress.done = false;
    progress.i = wrongIdx[0];
    save();
    state.mode = 'redo';
    state.order = wrongIdx;
    state.pos = 0;
    $('resultView').hidden = true;
    $('quizView').hidden = false;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    UI.toast('重做错题：共 ' + wrongIdx.length + ' 道');
  }

  function restart() {
    if (!window.confirm('重新开始本章？所有作答记录与错题会清空（收藏与笔记会保留）。')) return;
    // 登录用户需等服务器确实清完再刷新（游客立即完成）
    Store.progress.clear(bankId, chapterId).then(function () {
      window.location.reload();
    });
  }

  /* ---------- 主题 / 字号（切换逻辑在 js/util.js，两处页面共用） ---------- */

  UI.bindHeaderTools();

  /* ---------- 事件绑定 ---------- */

  $('prevBtn').addEventListener('click', function () { goTo(state.pos - 1); });
  $('nextBtn').addEventListener('click', function () { goTo(state.pos + 1); });
  $('padBtn').addEventListener('click', openPad);
  $('padClose').addEventListener('click', closePad);
  $('pad').addEventListener('click', function (e) { if (e.target === $('pad')) closePad(); });
  $('starBtn').addEventListener('click', toggleStar);

  // 笔记：每次输入即时写入 localStorage，切题、刷新都不丢
  $('qNoteText').addEventListener('input', function () {
    var q = currentQ();
    if (!q) return;
    var text = this.value;
    Store.notes.set(bankId, q.id, text);
    if (text.trim()) notes[q.id] = text; else delete notes[q.id];
    $('qNoteState').textContent = text.trim() ? '已保存' : '';
  });
  $('qNoteClear').addEventListener('click', function () {
    var q = currentQ();
    if (!q) return;
    Store.notes.set(bankId, q.id, '');
    delete notes[q.id];
    $('qNoteText').value = '';
    $('qNoteState').textContent = '';
    UI.toast('已清空本题笔记');
  });
  $('submitBtn').addEventListener('click', function () {
    var action = $('submitBtn').dataset.action;
    if (action === 'submit') submitCurrent();
    else nextOrFinish();
  });
  $('toResultBtn').addEventListener('click', finish);
  $('redoWrongBtn').addEventListener('click', redoWrong);
  $('reviewBtn').addEventListener('click', function () {
    if (!progress) return;
    $('resultView').hidden = true;
    $('quizView').hidden = false;
    state.mode = 'all';
    state.order = buildOrder('all');
    state.pos = Math.min(Math.max(progress.i | 0, 0), total - 1);
    renderQuestion();
  });
  $('restartBtn').addEventListener('click', restart);

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (!$('pad').hidden) {
      if (e.key === 'Escape') closePad();
      return;
    }

    var q = currentQ();
    if (!q) return;
    var tag = (e.target && e.target.tagName) || '';
    var isButton = tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'TEXTAREA';

    // 正在输入笔记时，键盘（字母、方向键、Enter、S）全部留给输入框，不触发答题快捷键
    if (tag === 'TEXTAREA' || tag === 'INPUT' || (e.target && e.target.isContentEditable)) return;

    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(state.pos - 1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(state.pos + 1); return; }
    if (e.key === 'Escape') { /* 面板未开时无操作 */ return; }

    if (e.key === 's' || e.key === 'S') { toggleStar(); return; }

    if (e.key === 'Enter') {
      if (isButton) return; // 焦点在按钮上：交给按钮自身的原生点击，避免双重触发
      e.preventDefault();
      var action = $('submitBtn').dataset.action;
      if (action === 'submit') submitCurrent();
      else nextOrFinish();
      return;
    }

    var letter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      var rec = progress.r[q.id];
      if (rec && rec.ok !== undefined) return;
      var has = q.options.some(function (o) { return o.k === letter; });
      if (has) { e.preventDefault(); selectOption(letter); }
    }
  });

  /* ---------- 滑动手势（移动端单手操作）：在题卡上左右滑动切换上一题 / 下一题 ---------- */
  (function bindSwipe() {
    var startX = 0;
    var startY = 0;
    var tracking = false;
    var card = $('qcard');

    card.addEventListener('touchstart', function (e) {
      // 在笔记框里滑动（写字、选词）不参与切题手势
      tracking = e.touches.length === 1 && $('pad').hidden &&
        !(e.target && e.target.closest && e.target.closest('.qcard__note'));
      if (!tracking) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    card.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      // 水平方向明显大于垂直方向，且滑动距离足够，才判定为切题（不影响纵向滚动与点选）
      if (Math.abs(dx) < 60 || Math.abs(dy) > 45) return;
      goTo(state.pos + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // 触屏设备首次进入时提示一次手势用法
    try {
      if ('ontouchstart' in window && !sessionStorage.getItem('quiz.swipeHint')) {
        sessionStorage.setItem('quiz.swipeHint', '1');
        UI.toast('提示：左右滑动可切换题目');
      }
    } catch (err) { /* 隐私模式忽略 */ }
  })();

  /* ---------- 启动 ----------
     先等 Store.ready()：游客立即开始；登录用户先把数据从服务器拉下来。
     拉完再加载本章进度、处理深链接、决定显示结果页还是接着答。 */

  function boot() {
    progress = Store.progress.load(bankId, chapterId);
    if (!progress.r || typeof progress.r !== 'object') progress.r = {};
    stars = Store.stars.load(bankId);
    notes = Store.notes.load(bankId);

    // 清理无效的历史记录：题库重新分组后，旧题号可能已不属于本章
    var pruned = false;
    for (var rk in progress.r) {
      if (!(rk in indexOfQid)) { delete progress.r[rk]; pruned = true; }
    }
    if (pruned) Store.progress.save(bankId, chapterId, progress);

    // 解析深链接参数（来自首页错题本 / 收藏夹的跳转链接）
    var deepParams = null;
    try { deepParams = new URLSearchParams(window.location.search); } catch (e) { deepParams = null; }
    var deepQ = deepParams && deepParams.get('q');
    var deepMode = deepParams && deepParams.get('mode');

    state.order = buildOrder('all');

    if (deepMode === 'wrong' || deepMode === 'star') {
      var deepOrder = buildOrder(deepMode);
      if (deepOrder.length) { state.mode = deepMode; state.order = deepOrder; state.pos = 0; }
    }

    if (deepQ) {
      if (Object.prototype.hasOwnProperty.call(indexOfQid, deepQ)) {
        var dIdx = indexOfQid[deepQ];
        if (state.order.indexOf(dIdx) < 0) { // 目标题不在筛选结果里，回退到全部模式再定位
          state.mode = 'all';
          state.order = buildOrder('all');
        }
        state.pos = state.order.indexOf(dIdx);
        renderQuestion();
        UI.toast('已定位到第 ' + (dIdx + 1) + ' 题');
        return; // 有明确目标题时直接进入作答视图，不再走“结果页 / 续答”
      }
      UI.toast('链接里的题目不存在，已正常打开本章');
    }

    if ((deepMode === 'wrong' || deepMode === 'star') && state.mode !== 'all') {
      renderQuestion(); // 只看错题 / 只看收藏模式
      return;
    }

    if (progress.done) {
      showResult();
    } else {
      state.pos = Math.min(Math.max(progress.i | 0, 0), total - 1);
      renderQuestion();
      if (answeredCount() > 0) UI.toast('已恢复上次进度');
    }
  }

  Store.ready().then(boot);
})();
