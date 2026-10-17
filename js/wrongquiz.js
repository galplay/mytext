/* js/wrongquiz.js —— 错题清零练习引擎（wrong-practice.html 专用）
 *
 * 这是 js/quiz.js（章节答题引擎）的「错题变体」，页面布局、判分交互、
 * 题号面板、收藏 / 笔记 / 反馈都和章节页一致，区别只有三点：
 *   1. 题目集不来自单个章节文件，而是打开页面时跨章节收集
 *      「最近一次作答为错」的题（web + java 全部题库），汇成新一轮；
 *   2. 本轮作答独立记账（每题从「未答」开始，不受章节页旧记录锁死），
 *      提交那一刻才写回各题【原章节】的进度——所以答对一题，
 *      它就自动从错题本移走，原章节里的该题也变成已答对；
 *   3. 本组题目在开轮时固定，中途答对答错不会改变本组范围；
 *      本轮作答与断点记在 sessionStorage，刷新可接着刷（换标签页则重新开始）。
 */
(function () {
  'use strict';

  var banks = window.QUIZ_BANKS || {};
  var BANK_ORDER = ['web', 'java'];
  var $ = function (id) { return document.getElementById(id); };

  if (!window.Store || !window.MD || !banks.web || !banks.java) {
    $('quizView').hidden = true;
    $('emptyView').hidden = false;
    return;
  }

  /* ---------- 收集错题（跨章节） ---------- */

  function chapterFile(bankId, idx) {
    return 'chapters/' + bankId + '-' + String(idx + 1).padStart(2, '0') + '.html';
  }

  /* 遍历全部章节，把「最近一次作答为错」的题收进本轮清单 */
  function collectWrong() {
    var items = [];
    BANK_ORDER.forEach(function (bankId) {
      var bank = banks[bankId];
      if (!bank) return;
      bank.chapters.forEach(function (c, ci) {
        var p = Store.progress.load(bankId, c.id);
        if (!p || !p.r) return;
        c.questions.forEach(function (q, qi) {
          var rec = p.r[q.id];
          if (rec && rec.ok === false) {
            items.push({
              bankId: bankId,
              chapterId: c.id,
              source: bank.short + ' · ' + c.title + ' 第 ' + (qi + 1) + ' 题',
              page: chapterFile(bankId, ci),
              q: q,
            });
          }
        });
      });
    });
    return items;
  }

  /* ---------- 原章节进度缓存：仅在提交写回时用，同一章只 load 一次 ---------- */

  var progCache = {}; // 'web/web-1' → progress 对象

  function progOf(item) {
    var key = item.bankId + '/' + item.chapterId;
    if (!progCache[key]) {
      var p = Store.progress.load(item.bankId, item.chapterId);
      if (!p.r || typeof p.r !== 'object') p.r = {};
      progCache[key] = p;
    }
    return progCache[key];
  }

  function saveProg(item) {
    var key = item.bankId + '/' + item.chapterId;
    Store.progress.save(item.bankId, item.chapterId, progCache[key]);
  }

  function recOf(item) { return roundState[item.q.id]; }

  /* ---------- 本组状态与断点（sessionStorage：只活在当前标签页会话里） ---------- */

  var SESSION_KEY = 'quiz.wrongSession';
  var items = [];   // 本组题目（开轮时固定）
  var pos = 0;
  /* roundState：本轮自己的作答账本 { 题id: {c:[选项], ok?:true/false} }。
     错题在章节页里是「已提交、已锁定」的记录，若直接沿用就无法重做；
     所以本轮从「未答」重新记，提交时再把结果写回原章节（见 submitCurrent）。 */
  var roundState = {};

  function readSession() {
    try {
      var s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      return (s && Array.isArray(s.ids) && s.ids.length) ? s : null;
    } catch (e) { return null; }
  }
  function writeSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        ids: items.map(function (it) { return it.q.id; }),
        pos: pos,
        state: roundState,
      }));
    } catch (e) { /* 隐私模式忽略 */ }
  }

  /* ---------- 统计 ---------- */

  function answeredCount() {
    return items.filter(function (it) {
      var rec = recOf(it);
      return rec && rec.ok !== undefined;
    }).length;
  }
  function correctCount() {
    return items.filter(function (it) {
      var rec = recOf(it);
      return rec && rec.ok === true;
    }).length;
  }

  function current() { return items[pos]; }

  /* ---------- 渲染（结构与 quiz.js 一致） ---------- */

  function renderMeta() {
    var n = items.length;
    var answered = answeredCount();
    var correct = correctCount();
    $('quizMeta').innerHTML = '本组共 <strong>' + n + '</strong> 道错题 · 已答 ' + answered + ' / ' + n +
      ' · 本轮答对 ' + correct;
    var bar = $('globalProgressBar');
    var pct = n ? Math.round((answered / n) * 100) : 0;
    bar.setAttribute('aria-valuenow', String(pct));
    bar.querySelector('.progressbar__fill').style.width = pct + '%';
  }

  function renderOptions(item, rec) {
    var q = item.q;
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

  function renderVerdictAndAnalysis(item, rec) {
    var q = item.q;
    var verdict = $('qVerdict');
    var analysis = $('qAnalysis');
    var submitted = rec && rec.ok !== undefined;

    if (submitted) {
      verdict.hidden = false;
      verdict.className = 'qcard__verdict ' + (rec.ok ? 'is-ok' : 'is-bad');
      var answerText = q.type === 'judge' ? judgeText(q.answer[0] || 'A') : q.answer.join('、');
      if (rec.ok) {
        verdict.textContent = '✓ 回答正确 · 这道题已移出错题本';
      } else {
        verdict.textContent = '✗ 又错了 · 你的答案：' + rec.c.join('、') + ' · 正确答案：' + answerText;
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

  function renderStar(item) {
    var btn = $('starBtn');
    var stars = Store.stars.load(item.bankId);
    var on = !!stars[item.q.id];
    btn.classList.toggle('is-starred', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? '★ 已收藏' : '☆ 收藏';
  }

  function renderNote(item) {
    var notes = Store.notes.load(item.bankId);
    var box = $('qNoteBox');
    var text = notes[item.q.id] || '';
    $('qNoteText').value = text;
    if (text) box.open = true;
    else if (box.dataset.qid !== item.q.id) box.open = false;
    box.dataset.qid = item.q.id;
    $('qNoteState').textContent = text ? '已保存' : '';
  }

  /* ---------- 题目反馈（与章节页同一套组件和逻辑） ---------- */

  var fbType = null;

  function fbTypeButtons() {
    return Array.prototype.slice.call(document.querySelectorAll('.qcard__fb-type'));
  }

  function closeFbPanel() {
    $('fbPanel').hidden = true;
    $('fbToggle').setAttribute('aria-expanded', 'false');
    fbType = null;
    $('fbText').value = '';
    $('fbState').textContent = '';
    fbTypeButtons().forEach(function (b) { b.classList.remove('is-active'); });
  }

  function renderFeedback(item) {
    var n = Store.feedback.countOf(item.q.id);
    var countEl = $('fbCount');
    countEl.hidden = !n;
    countEl.textContent = n ? '已收到 ' + n + ' 条反馈' : '';
    if ($('qFeedback').dataset.qid !== item.q.id) {
      $('qFeedback').dataset.qid = item.q.id;
      closeFbPanel();
    }
  }

  function renderButtons(rec) {
    var item = current();
    var submitBtn = $('submitBtn');
    if (!item.q.options.length) {
      submitBtn.textContent = '跳过本题 →';
      submitBtn.dataset.action = 'next';
    } else if (rec && rec.ok !== undefined) {
      submitBtn.textContent = pos >= items.length - 1 ? '看结果' : '下一题';
      submitBtn.dataset.action = 'next';
    } else {
      submitBtn.textContent = '提交答案';
      submitBtn.dataset.action = 'submit';
    }
    $('prevBtn').disabled = pos <= 0;
    $('nextBtn').disabled = pos >= items.length - 1;
  }

  function renderQuestion() {
    var item = current();
    if (!item) return;
    var rec = recOf(item);

    var typeLabel = { single: '单选题', multi: '多选题（可多选）', judge: '判断题' }[item.q.type] || '单选题';
    $('qType').textContent = typeLabel;
    $('qNo').textContent = '本组第 ' + (pos + 1) + ' / ' + items.length + ' 题';
    var src = $('qSource');
    src.textContent = item.source + ' ↗';
    src.href = item.page + '?q=' + encodeURIComponent(item.q.id);
    $('qText').innerHTML = MD.render(item.q.text);

    renderOptions(item, rec);
    renderVerdictAndAnalysis(item, rec);
    renderStar(item);
    renderNote(item);
    renderFeedback(item);
    renderButtons(rec);
    renderMeta();
    writeSession();
    if (!$('pad').hidden) renderPad();
  }

  function renderPad() {
    var grid = $('padGrid');
    grid.innerHTML = '';
    items.forEach(function (it, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(idx + 1);
      var rec = recOf(it);
      if (rec && rec.ok === true) btn.classList.add('is-ok');
      else if (rec && rec.ok === false) btn.classList.add('is-bad');
      if (idx === pos) btn.classList.add('is-cur');
      btn.addEventListener('click', function () {
        closePad();
        goTo(idx);
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- 交互 ---------- */

  function selectOption(key) {
    var item = current();
    var q = item.q;
    var rec = roundState[q.id];
    if (rec && rec.ok !== undefined) return; // 本轮已提交，锁定

    if (q.type === 'multi') {
      var cur = rec && rec.c ? rec.c.slice() : [];
      var at = cur.indexOf(key);
      if (at >= 0) cur.splice(at, 1); else cur.push(key);
      cur.sort();
      if (cur.length) roundState[q.id] = { c: cur };
      else delete roundState[q.id];
    } else {
      roundState[q.id] = { c: [key] };
    }
    // 草稿只记在本轮账本里，不写回原章节：
    // 章节页的草稿没有对错（ok 未定义），写回后反而会让它暂时不算「错题」
    renderQuestion();
  }

  function submitCurrent() {
    var item = current();
    var q = item.q;
    var rec = roundState[q.id];
    if (rec && rec.ok !== undefined) return; // 幂等保护：重复提交不改成绩
    if (!rec || !rec.c || !rec.c.length) { UI.toast('请先选择答案'); return; }

    var sel = rec.c.slice().sort();
    var ans = q.answer.slice().sort();
    var ok = sel.length === ans.length && sel.every(function (k, i) { return k === ans[i]; });

    roundState[q.id] = { c: rec.c.slice(), ok: ok };
    // 提交时才写回原章节：答对 → 错题本自动移走这题；答错 → 继续留着
    var prog = progOf(item);
    prog.r[q.id] = { c: rec.c.slice(), ok: ok };
    saveProg(item);
    renderQuestion();
    if (ok) UI.toast('回答正确！这道题已移出错题本');
    // 答对放「天降米饭」庆祝，答错放「宕机」失败动画（页面没有看板娘时自动跳过）
    if (window.Mascot) { if (ok) Mascot.rice(); else Mascot.fail(); }
  }

  function nextOrFinish() {
    if (pos < items.length - 1) { goTo(pos + 1); return; }
    showResult();
  }

  function goTo(p) {
    if (p < 0 || p >= items.length) return;
    pos = p;
    renderQuestion();
    var card = $('qcard');
    if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openPad() { renderPad(); $('pad').hidden = false; $('padClose').focus(); }
  function closePad() { $('pad').hidden = true; $('padBtn').focus(); }

  function toggleStar() {
    var item = current();
    if (!item) return;
    var on = Store.stars.toggle(item.bankId, item.q.id);
    renderStar(item);
    UI.toast(on ? '已收藏本题' : '已取消收藏');
  }

  /* ---------- 结果页 ---------- */

  function showResult() {
    $('quizView').hidden = true;
    $('resultView').hidden = false;
    var n = items.length;
    var correct = correctCount();
    var answered = answeredCount();
    var stillWrong = answered - correct;
    var unanswered = n - answered;

    $('resultScore').textContent = '本轮答对 ' + correct + ' / ' + n + '（' + (n ? Math.round((correct / n) * 100) : 0) + '%）';
    $('resultSub').textContent = '还是错的 ' + stillWrong + ' 道 · 未作答 ' + unanswered + ' 道' +
      (stillWrong ? ' · 它们仍留在错题本里' : ' · 错题本已清空，太棒了！');

    var list = $('resultWrong');
    list.innerHTML = '';
    var still = items.filter(function (it) {
      var rec = recOf(it);
      return rec && rec.ok === false;
    });
    if (!still.length) {
      var p = document.createElement('p');
      p.className = 'quiz__meta';
      p.textContent = unanswered ? '没有答错的题。' : '全部题目都已答对，太棒了。';
      list.appendChild(p);
    } else {
      still.forEach(function (it) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wrong-item';

        var no = document.createElement('span');
        no.className = 'wrong-item__no';
        no.textContent = '第 ' + (items.indexOf(it) + 1) + ' 题';

        var txt = document.createElement('span');
        txt.className = 'wrong-item__text';
        txt.textContent = it.source + ' · ' + it.q.text.replace(/[`*#>\n]/g, ' ').slice(0, 30);

        var go = document.createElement('span');
        go.className = 'wrong-item__go';
        go.textContent = '查看';

        btn.appendChild(no); btn.appendChild(txt); btn.appendChild(go);
        btn.addEventListener('click', function () {
          $('resultView').hidden = true;
          $('quizView').hidden = false;
          goTo(items.indexOf(it));
        });
        list.appendChild(btn);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* 再来一轮：重新收集当前错题（答对的已移走，答错的还在），开一组新的 */
  function newRound() {
    var fresh = collectWrong();
    if (!fresh.length) {
      UI.toast('错题本已经清空，没有新题可刷了');
      return;
    }
    items = fresh;
    pos = 0;
    progCache = {};
    roundState = {}; // 新一轮：所有题重新从「未答」开始
    $('resultView').hidden = true;
    $('emptyView').hidden = true;
    $('quizView').hidden = false;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    UI.toast('新一轮开始：共 ' + fresh.length + ' 道错题');
  }

  /* ---------- 主题 / 字号 + 事件绑定 ---------- */

  UI.bindHeaderTools();

  $('prevBtn').addEventListener('click', function () { goTo(pos - 1); });
  $('nextBtn').addEventListener('click', function () { goTo(pos + 1); });
  $('padBtn').addEventListener('click', openPad);
  $('padClose').addEventListener('click', closePad);
  $('pad').addEventListener('click', function (e) { if (e.target === $('pad')) closePad(); });
  $('starBtn').addEventListener('click', toggleStar);

  $('qNoteText').addEventListener('input', function () {
    var item = current();
    if (!item) return;
    Store.notes.set(item.bankId, item.q.id, this.value);
    $('qNoteState').textContent = this.value.trim() ? '已保存' : '';
  });
  $('qNoteClear').addEventListener('click', function () {
    var item = current();
    if (!item) return;
    Store.notes.set(item.bankId, item.q.id, '');
    $('qNoteText').value = '';
    $('qNoteState').textContent = '';
    UI.toast('已清空本题笔记');
  });

  $('fbToggle').addEventListener('click', function () {
    var willOpen = $('fbPanel').hidden;
    $('fbPanel').hidden = !willOpen;
    $('fbToggle').setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen) $('fbText').focus();
  });
  fbTypeButtons().forEach(function (btn) {
    btn.addEventListener('click', function () {
      fbType = btn.dataset.fbtype;
      fbTypeButtons().forEach(function (b) { b.classList.toggle('is-active', b === btn); });
    });
  });
  $('fbSubmit').addEventListener('click', function () {
    var item = current();
    if (!item) return;
    var res = Store.feedback.add({
      qid: item.q.id,
      bank: item.bankId,
      chapter: item.chapterId,
      qNo: parseInt(item.source.replace(/^.*第 /, ''), 10) || 0, // 原章节里的题号
      type: fbType,
      text: $('fbText').value,
    });
    if (!res.ok) { UI.toast(res.err); return; }
    closeFbPanel();
    renderFeedback(item);
    UI.toast('反馈已提交，首页「维护日志」可查看');
  });

  $('submitBtn').addEventListener('click', function () {
    if ($('submitBtn').dataset.action === 'submit') submitCurrent();
    else nextOrFinish();
  });
  $('toResultBtn').addEventListener('click', showResult);
  $('newRoundBtn').addEventListener('click', newRound);
  $('reviewBtn').addEventListener('click', function () {
    $('resultView').hidden = true;
    $('quizView').hidden = false;
    renderQuestion();
  });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (!$('pad').hidden) {
      if (e.key === 'Escape') closePad();
      return;
    }
    if ($('quizView').hidden) return; // 结果页不响应答题快捷键

    var item = current();
    if (!item) return;

    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'TEXTAREA' || tag === 'INPUT' || (e.target && e.target.isContentEditable)) return;

    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(pos - 1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(pos + 1); return; }
    if (e.key === 's' || e.key === 'S') { toggleStar(); return; }

    if (e.key === 'Enter') {
      if (tag === 'BUTTON' || tag === 'A') return; // 焦点在按钮上：交给按钮原生点击
      e.preventDefault();
      if ($('submitBtn').dataset.action === 'submit') submitCurrent();
      else nextOrFinish();
      return;
    }

    var letter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      var rec = recOf(item);
      if (rec && rec.ok !== undefined) return;
      var has = item.q.options.some(function (o) { return o.k === letter; });
      if (has) { e.preventDefault(); selectOption(letter); }
    }
  });

  /* 滑动手势：与章节页一致（笔记 / 反馈区不参与） */
  (function bindSwipe() {
    var startX = 0, startY = 0, tracking = false;
    var card = $('qcard');

    card.addEventListener('touchstart', function (e) {
      tracking = e.touches.length === 1 && $('pad').hidden &&
        !(e.target && e.target.closest && e.target.closest('.qcard__note, .qcard__feedback'));
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
      if (Math.abs(dx) < 60 || Math.abs(dy) > 45) return;
      goTo(pos + (dx < 0 ? 1 : -1));
    }, { passive: true });
  })();

  /* ---------- 启动 ---------- */

  function boot() {
    items = collectWrong();

    // 断点续刷：本标签页里上一轮没刷完的，接着刷（题目已被移出错题本的自动跳过）
    var saved = readSession();
    var startMsg = '';
    if (saved && saved.ids.length) {
      var byId = {};
      items.forEach(function (it) { byId[it.q.id] = it; });
      var keep = saved.ids.map(function (id) { return byId[id]; }).filter(Boolean);
      if (keep.length) {
        items = keep;
        // 恢复本轮账本：刷新前答过的题保持已答状态，没答的继续答
        roundState = (saved.state && typeof saved.state === 'object') ? saved.state : {};
        pos = Math.min(Math.max(saved.pos | 0, 0), keep.length - 1);
        startMsg = keep.length < saved.ids.length
          ? '已恢复上轮错题组（' + keep.length + ' 道，答对的已自动移出）'
          : '已恢复上轮错题组：共 ' + keep.length + ' 道';
      }
    }

    if (!items.length) {
      $('quizView').hidden = true;
      $('emptyView').hidden = false;
      return;
    }

    $('emptyView').hidden = true;
    $('quizView').hidden = false;
    renderQuestion();
    if (startMsg) UI.toast(startMsg);
  }

  // 后端版的 Store 有 ready()（先拉服务器数据）；静态版没有，直接开
  var p = Store.ready ? Store.ready() : Promise.resolve();
  p.then(boot);
})();
