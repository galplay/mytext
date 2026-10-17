/* js/mascot.js —— DeepSeek 娘看板娘（首页右上角 + 做题页右侧空白处）
 *
 * 素材是两张绿幕立绘（img/deepseek-chan.png 睁眼 / deepseek-chan-closed.png 眯眼笑）。
 * 浏览器里没法直接用 PS 抠图，所以沿用桌面看板娘项目的做法——运行时抠图：
 *   1. 把图片画进离屏 canvas，逐像素判断「绿色超出红/蓝的程度」：
 *      超出很多 → 完全透明（纯背景）；超出一点 → 半透明并压掉绿溢（边缘羽化）；
 *   2. 同时统计不透明像素的包围盒（头顶/脚底/左右），用来把两张构图略有
 *      差异的立绘对齐到同一位置；
 *   3. 眨眼不整图切换（两张图姿势不同会跳动），而是把闭眼图的眼部圆形
 *      区域羽化后「贴」到睁眼图上，只换眼睛。
 * 动画：轻微摇摆 + 呼吸起伏 + 定时眨眼；点她一下会眯眼笑、像果冻一样
 * 压缩回弹（脚底不离开地面）并说句话；答对一题时（quiz.js 调 Mascot.rice()）
 * 播放「天降米饭」庆祝序列：铁盆砸下来 → 慌忙接住 → 埋头干饭 → 回到默认站姿；
 * 答错一题时（Mascot.fail()）播放「宕机」失败序列：直挺挺倒下 → X 眼躺平、
 * 灵魂出窍冒「死掉了」贴纸 → 灵魂回体满血复活 → 回到默认站姿。
 * 系统设置「减弱动态效果」时只画一帧静态图，不做动画。
 */
(function () {
  'use strict';

  var box = document.getElementById('mascot');
  var canvas = document.getElementById('mascotCanvas');
  var bubble = document.getElementById('mascotBubble');
  if (!box || !canvas || !canvas.getContext) return; // 页面上没有看板娘容器就直接退出

  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var S = 0; // 画布 CSS 边长（正方形）

  /* ---------- 绿幕抠图 + 轮廓包围盒（与桌面看板娘项目同一算法） ---------- */

  function keyImage(src) {
    return new Promise(function (resolve, reject) {
      var im = new Image();
      im.onload = function () {
        var c = document.createElement('canvas');
        c.width = c.height = 1024;
        var cc = c.getContext('2d');
        cc.drawImage(im, 0, 0, 1024, 1024);
        var d = cc.getImageData(0, 0, 1024, 1024), p = d.data;
        var x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
        for (var i = 0; i < p.length; i += 4) {
          var r = p[i], g = p[i + 1], b = p[i + 2];
          var key = g - Math.max(r, b);        // 绿色超出多少
          if (key > 40) { p[i + 3] = 0; continue; } // 纯背景：全透明
          if (key > 5) {                        // 边缘：羽化 + 去绿溢
            p[i + 3] = Math.round(255 * (1 - (key - 5) / 35));
            p[i + 1] = Math.max(r, b) + 6;
          }
          if (p[i + 3] > 24) {                  // 统计不透明像素包围盒
            var px = (i / 4) % 1024, py = (i / 4) / 1024 | 0;
            if (px < x0) x0 = px; if (px > x1) x1 = px;
            if (py < y0) y0 = py; if (py > y1) y1 = py;
          }
        }
        cc.putImageData(d, 0, 0);
        resolve({
          canvas: c,
          // 包围盒：躺平图 / 幽灵要对齐用，需要完整的 x0/y0/宽高
          bbox: { x0: x0, y0: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, bottom: y1 },
        });
      };
      im.onerror = reject;
      im.src = src;
    });
  }

  /* 立绘路径：默认按站点根目录的页面写（首页、错题清零页）。
     章节页在 chapters/ 子目录里，就在 #mascot 上用 data-img-base="../img/"
     指到上一级目录，脚本本身不用改。 */
  var IMG_BASE = box.getAttribute('data-img-base') || 'img/';

  var open = null, closed = null; // 睁眼 / 眯眼笑 两张抠好的立绘
  Promise.all([
    keyImage(IMG_BASE + 'deepseek-chan.png'),
    keyImage(IMG_BASE + 'deepseek-chan-closed.png'),
  ]).then(function (list) {
    open = list[0]; closed = list[1];
    start();
  }, function () { /* 图片加载失败：静默不显示，不影响页面功能 */ });

  /* 天降米饭用的三张图（接盆立绘 / 干饭立绘 / 铁盆道具）单独加载：
     慢一点或者缺图都不影响她平时的眨眼摇摆，只是不放米饭动画。 */
  var riceSp = null; // { catchSp, eatSp, bowlSp }
  Promise.all([
    keyImage(IMG_BASE + 'deepseek-chan-catch.png'),
    keyImage(IMG_BASE + 'deepseek-chan-eat.png'),
    keyImage(IMG_BASE + 'deepseek-chan-bowl.png'),
  ]).then(function (list) {
    riceSp = { catchSp: list[0], eatSp: list[1], bowlSp: list[2] };
  }, function () { /* 没有这三张图：米饭动画自动禁用 */ });

  /* 宕机用的两张图（X 眼躺平立绘 / 小幽灵灵魂），同样单独加载、缺图自动禁用 */
  var deadSp = null; // { lying, soul }
  Promise.all([
    keyImage(IMG_BASE + 'deepseek-chan-dead.png'),
    keyImage(IMG_BASE + 'deepseek-chan-ghost.png'),
  ]).then(function (list) {
    deadSp = { lying: list[0], soul: list[1] };
  }, function () { /* 没有这两张图：宕机动画自动禁用 */ });

  /* 立绘按包围盒对齐到睁眼图：同高、底边中心重合（sp 省略时对闭眼图）。
     这样切换姿势（笑 / 接盆 / 干饭）时脚不会漂移，构图差异被自动修正。 */
  function applyAlign(g, sp) {
    sp = sp || closed;
    var ob = open.bbox, cb = sp.bbox;
    var s = ob.h / cb.h;
    s = Math.max(0.85, Math.min(1.15, s)); // 防止离谱缩放
    g.translate(ob.cx, ob.bottom);
    g.scale(s, s);
    g.translate(-cb.cx, -cb.bottom);
  }
  function drawAligned(g, sp) {
    g.save(); applyAlign(g, sp); g.drawImage(sp.canvas, 0, 0); g.restore();
  }

  /* ---------- 眨眼：只把闭眼图的眼部圆形区域羽化贴到睁眼图上 ---------- */

  var EYE_PATCH = 170;               // 取样窗口边长（立绘 1024 坐标系）
  var EYE_MASK_R = [58, 82];         // 羽化：实心半径 → 透明半径
  var PATCH_ADJ = { dx: 0, dy: 6 };  // 闭眼图眼部相对偏移微调
  var EYES = [{ x: 418, y: 383 }, { x: 583, y: 383 }]; // 两只眼睛的位置
  var patchBuf = null, maskBuf = null;

  function ensurePatchBuffers() {
    if (patchBuf) return;
    patchBuf = document.createElement('canvas');
    patchBuf.width = patchBuf.height = EYE_PATCH;
    maskBuf = document.createElement('canvas');
    maskBuf.width = maskBuf.height = EYE_PATCH;
    var m = maskBuf.getContext('2d');
    var c = EYE_PATCH / 2;
    var gr = m.createRadialGradient(c, c, EYE_MASK_R[0], c, c, EYE_MASK_R[1]);
    gr.addColorStop(0, 'rgba(0,0,0,1)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = gr;
    m.fillRect(0, 0, EYE_PATCH, EYE_PATCH);
  }

  function drawEyePatch(g, e) {
    ensurePatchBuffers();
    var p = patchBuf.getContext('2d');
    p.setTransform(1, 0, 0, 1, 0, 0);
    p.clearRect(0, 0, EYE_PATCH, EYE_PATCH);
    p.save();
    p.translate(EYE_PATCH / 2 - e.x + PATCH_ADJ.dx, EYE_PATCH / 2 - e.y + PATCH_ADJ.dy);
    applyAlign(p);
    p.drawImage(closed.canvas, 0, 0);
    p.restore();
    p.globalCompositeOperation = 'destination-in'; // 只保留圆形羽化区域
    p.drawImage(maskBuf, 0, 0);
    p.globalCompositeOperation = 'source-over';
    g.drawImage(patchBuf, e.x - EYE_PATCH / 2, e.y - EYE_PATCH / 2);
  }

  /* ---------- 台词：结合刷题网站场景的小彩蛋 ---------- */

  var LINES = {
    hi: [
      '你好呀~ 我是 DeepSeek 娘！',
      '今天也要一起刷题吗？',
      '深海信号接收中……🐋',
      '错题清零，我陪你！',
    ],
    pet: [
      '嘿嘿，头发会乱掉的啦~',
      '摸我一下，做题 buff 加成！',
      '咿——（开心到喷水）',
      '摸头可以，不许拽呆毛！',
    ],
  };
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  var bubbleTimer = null;
  function say(text, ms) {
    bubble.textContent = text;
    bubble.classList.add('is-show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.classList.remove('is-show'); }, ms || 2600);
  }

  /* ---------- 状态与动画 ---------- */

  var st = {
    happyUntil: 0,   // 被点击后眯眼笑到什么时候
    squash: 0,       // 果冻压弹振幅：点击设为 1，随时间衰减到 0
    deadRot: 0,      // 宕机倒下时叠加在摇摆上的额外旋转（弧度）
    blinkUntil: 0,
    nextBlink: 2000,
  };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 天降米饭庆祝序列（答对一题时 quiz.js / wrongquiz.js 调 Mascot.rice()） ----------
     阶段：fall（铁盆从天外砸下）→ catch（慌忙接住 + 果冻压弹）→ eat（埋头干饭冒饭粒）
     → done（眯眼笑收尾）→ 回到默认站姿。素材与算法来自桌面看板娘项目。 */
  var BOWL_ANCHOR = { x: 512, y: 150 }; // 盆底中心在「接盆立绘」1024 坐标系里的位置
  var BOWL_SCALE = 0.27;                // 道具图缩到立绘大小的比例
  var rice = { active: false, t0: 0, phase: 'fall', said: {} };
  var RICE_T = { fall: 900, catch: 1100, eat: 3400, done: 400 }; // 各阶段时长 ms

  function startRice() {
    if (rice.active || dead.active || !open || !riceSp) return; // 正在放 / 立绘没抠好：不重复触发
    if (reduced) { say('答对啦！（安静地开心一下）', 2400); return; } // 减弱动态：只说话不放动画
    rice.active = true; rice.phase = 'fall'; rice.t0 = performance.now(); rice.said = {};
  }
  /* 暴露给答题引擎的全局小接口：quiz.js / wrongquiz.js 提交时按对错调
     rice() / fail()；页面没加载 mascot.js 时 window.Mascot 不存在，
     调用方判空后自动跳过，所以首页等没有看板娘的页面也不报错 */
  window.Mascot = { rice: startRice, fail: startDead };

  function riceStep(now) {
    var e = now - rice.t0;
    if (rice.phase === 'fall') {
      if (!rice.said.a) { rice.said.a = 1; say('咦？天上有什么——', 1400); }
      if (e >= RICE_T.fall) {
        rice.phase = 'catch'; rice.t0 = now;
        st.squash = 1; // 盆落进手里：整个人果冻压弹一下
        say('哇啊——接、接住了！', 2200);
      }
    } else if (rice.phase === 'catch') {
      if (e >= RICE_T.catch) {
        rice.phase = 'eat'; rice.t0 = now;
        say('干饭中，勿扰 🍚', RICE_T.eat);
      }
    } else if (rice.phase === 'eat') {
      if (e >= RICE_T.eat) {
        rice.phase = 'done'; rice.t0 = now;
        st.happyUntil = now + 2400; // 收尾：眯眼笑
        say('吃饱啦~ 嗝！', 2400);
      }
    } else { // done：再站一会儿就彻底回默认
      if (e >= RICE_T.done) rice.active = false;
    }
  }

  /* 在立绘坐标系（1024×1024）里画当前阶段；外层 draw() 已摆好身体变换 */
  function drawRice(now) {
    var e = now - rice.t0;
    if (rice.phase === 'fall') {
      ctx.drawImage(open.canvas, 0, 0); // 她还是站姿，盆从天上来
      var t = Math.min(1, e / RICE_T.fall);
      var y = -210 * (1 - t * t); // 越落越快（重力加速）
      var wob = Math.sin(t * 9) * 0.06 * (1 - t); // 下落时轻微摇晃
      ctx.save();
      ctx.translate(0, y); // 偏移在原始立绘空间：盆从画布外落进来
      applyAlign(ctx, riceSp.catchSp); // 借用接盆立绘坐标系，盆才刚好落在她手上
      ctx.translate(BOWL_ANCHOR.x, BOWL_ANCHOR.y);
      ctx.rotate(wob);
      ctx.scale(BOWL_SCALE, BOWL_SCALE);
      ctx.drawImage(riceSp.bowlSp.canvas, -riceSp.bowlSp.bbox.cx, -riceSp.bowlSp.bbox.bottom);
      ctx.restore();
    } else if (rice.phase === 'catch') {
      drawAligned(ctx, riceSp.catchSp); // 双手接盆
    } else if (rice.phase === 'eat') {
      drawAligned(ctx, riceSp.eatSp); // 埋头干饭
      var n = 5; // 饭粒小粒子从嘴边冒出来（循环错开相位，像连续冒泡）
      for (var i = 0; i < n; i++) {
        var ph = (e / 900 + i / n) % 1;
        ctx.save();
        ctx.globalAlpha = 0.9 * (1 - ph);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(470 + i * 14 + ph * 40, 330 - ph * 90 + Math.sin(ph * 6 + i) * 12,
          5, 3.5, ph * 3 + i, 0, 7);
        ctx.fill();
        ctx.restore();
      }
    } else if (now < st.happyUntil) {
      drawAligned(ctx, closed); // done 收尾：眯眼笑
    } else {
      ctx.drawImage(open.canvas, 0, 0); // done 结束前的最后一帧
    }
  }

  /* ---------- 宕机失败序列（答错一题时 quiz.js / wrongquiz.js 调 Mascot.fail()） ----------
     阶段：fall（直挺挺向左倒下）→ dead（X 眼躺平 + 灵魂出窍 + 「死掉了」贴纸字）
     → revive（灵魂回体）→ 满血复活回默认。素材与算法来自桌面看板娘项目。 */
  var DEAD_T = { fall: 520, dead: 3600, revive: 900 }; // 各阶段时长 ms
  var dead = { active: false, t0: 0, phase: 'fall', said: {} };

  function startDead() {
    if (dead.active || rice.active || !open || !deadSp) return; // 正在放 / 图没抠好：不重复触发
    if (reduced) { say('呜呜…答错了，下次一定！', 2400); return; } // 减弱动态：只说话不放动画
    dead.active = true; dead.phase = 'fall'; dead.t0 = performance.now(); dead.said = {};
    say('电量不足……先走一', 1600);
  }

  function deadStep(now) {
    var e = now - dead.t0;
    if (dead.phase === 'fall') {
      var t = Math.min(1, e / DEAD_T.fall);
      st.deadRot = -1.35 * (t * t); // 加速向左倒下（draw 里叠加进 rotate）
      if (e >= DEAD_T.fall) {
        dead.phase = 'dead'; dead.t0 = now; st.deadRot = 0;
        st.squash = 1; // 落地弹一下
        say('啊——我死掉了……', 2800);
      }
    } else if (dead.phase === 'dead') {
      if (e >= DEAD_T.dead) { dead.phase = 'revive'; dead.t0 = now; }
    } else { // revive：灵魂回体，重启成功
      if (e >= DEAD_T.revive) {
        dead.active = false;
        st.happyUntil = now + 2200;
        st.squash = 1;
        say('呜哇！重启成功，满血复活！', 2600);
      }
    }
  }

  /* 躺平图对齐：包围盒「底边中心」钉在站立图脚底。躺姿是横着的，
     横向跨度≈站姿身高，所以用躺平图的「宽」（bbox.w）来换算缩放 */
  function applyLying(g) {
    var ob = open.bbox, lb = deadSp.lying.bbox;
    var s = ob.h / lb.w;
    s = Math.max(0.55, Math.min(1.1, s)); // 防止离谱缩放
    g.translate(ob.cx, ob.bottom);
    g.scale(s, s);
    g.translate(-lb.cx, -lb.bottom);
  }
  function drawLying(g) {
    g.save(); applyLying(g); g.drawImage(deadSp.lying.canvas, 0, 0); g.restore();
  }
  /* 灵魂出窍：从躺平图的头部位置向上飘（rise 0→1），左右晃、渐渐透明 */
  function drawSoul(g, rise, alpha) {
    var lb = deadSp.lying.bbox;
    var hx = lb.x0 + lb.w * 0.32, hy = lb.y0 + lb.h * 0.28; // 头在躺平图中的位置
    var ss = 150 / deadSp.soul.bbox.w; // 幽灵缩到 150px 宽
    g.save();
    applyLying(g);
    g.globalAlpha = alpha;
    g.translate(hx + rise * 90 + Math.sin(rise * 7) * 22, hy - 60 - rise * 240);
    g.scale(ss, ss);
    g.drawImage(deadSp.soul.canvas, -deadSp.soul.bbox.cx, -deadSp.soul.bbox.bottom + 60);
    g.restore();
  }
  /* 在立绘坐标系（1024×1024）里画宕机各阶段；外层 draw() 已摆好身体变换 */
  function drawDead(now) {
    var e = now - dead.t0;
    if (dead.phase === 'fall') {
      ctx.drawImage(open.canvas, 0, 0); // 倒下是整体旋转（st.deadRot），图本身不变
    } else if (dead.phase === 'dead') {
      drawLying(ctx);
      var t = Math.min(1, e / 1100);
      drawSoul(ctx, t * t * (3 - 2 * t), Math.min(1, e / 350)); // smoothstep 上浮
      // 「死掉了」贴纸字：弹出 + 轻微旋转
      var pop = Math.min(1, e / 320);
      var sc = 1 + (1 - pop) * (1 - pop) * -0.4;
      ctx.save();
      ctx.translate(215, 255); ctx.rotate(-0.12); ctx.scale(sc, sc);
      ctx.font = 'bold 78px "PingFang SC","Microsoft YaHei",sans-serif';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 14; ctx.strokeText('死掉了', 0, 0);
      ctx.fillStyle = '#7b8ce0'; ctx.fillText('死掉了', 0, 0);
      ctx.restore();
    } else { // revive：灵魂回落淡出
      drawLying(ctx);
      var rt = e / DEAD_T.revive;
      drawSoul(ctx, (1 - rt) * (1 - rt), 1 - rt);
    }
  }

  function sizeCanvas() {
    var w = box.clientWidth || 200;
    if (w === S) return;
    S = w;
    canvas.width = Math.round(S * DPR);
    canvas.height = Math.round(S * DPR);
  }

  /* 画一帧：以脚底中心为支点做摇摆/呼吸/果冻压弹 */
  function draw(now) {
    sizeCanvas();
    var happy = now < st.happyUntil;
    var blink = now < st.blinkUntil;

    var sway = Math.sin(now / 1100) * 0.012;  // 缓慢左右摇摆
    var brth = Math.sin(now / 620);           // 呼吸
    var sq = st.squash;
    /* 果冻压弹（阻尼振荡）：
       sq 从 1 衰减到 0 当"振幅"，(1 - sq) 当"相位"推进；
       cos 起步是 +1（点下瞬间压到最扁），随后正负交替 = 压扁→反向拉伸→再压扁……
       振幅越摆越小，最后静止。整段只改 scale，人物不离开地面。 */
    var jelly = sq > 0 ? Math.cos((1 - sq) * Math.PI * 4.5) * sq : 0;

    var k = S / 1024 * DPR * 0.93; // 0.93：头顶留一点余量，回弹拉伸时呆毛不被画布裁掉
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var sy = jelly > 0 ? jelly * 0.12 : jelly * 0.07; // 压扁给足，反向拉伸收一点，更像果冻
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height); // 支点：脚底中心，固定不动
    ctx.rotate(sway + st.deadRot); // 宕机倒下时叠加 deadRot 整体旋转
    // 压扁时变矮变胖、反向时变高变瘦（x/y 一增一减，体积感守恒）
    ctx.scale(k * (1 + jelly * 0.10 + brth * 0.004), k * (1 - sy - brth * 0.006));
    ctx.translate(-512, -1024); // 立绘坐标（1024×1024）的脚底中心对到支点上

    if (dead.active) {
      drawDead(now); // 宕机序列：倒下 → 躺平 + 灵魂 → 复活
    } else if (rice.active) {
      drawRice(now); // 米饭序列播放中：姿势由阶段决定
    } else if (happy) {
      ctx.save(); applyAlign(ctx); ctx.drawImage(closed.canvas, 0, 0); ctx.restore();
    } else {
      ctx.drawImage(open.canvas, 0, 0);
      if (blink) { drawEyePatch(ctx, EYES[0]); drawEyePatch(ctx, EYES[1]); }
    }
    ctx.restore();

    if (st.squash > 0) st.squash = Math.max(0, st.squash - 16 / 900); // 约 0.9 秒摆完收住
  }

  function start() {
    if (reduced) { draw(performance.now()); return; } // 减弱动态：只画一帧

    (function frame() {
      var now = performance.now();
      if (rice.active) riceStep(now);      // 推进天降米饭序列
      if (dead.active) deadStep(now);      // 推进宕机序列
      if (now > st.nextBlink && !rice.active && !dead.active) { // 眨眼调度：眨 150ms，隔 2~5 秒再眨（序列中暂停）
        st.blinkUntil = now + 150;
        st.nextBlink = now + 2000 + Math.random() * 3000;
      }
      draw(now);
      requestAnimationFrame(frame);
    })();

    // 偶尔自己冒一句话（约 20 秒一次、四分之一概率），安静学习时不打扰
    setInterval(function () {
      if (bubble.classList.contains('is-show')) return;
      if (performance.now() < st.happyUntil || rice.active || dead.active) return;
      if (Math.random() < 0.25) say(pick(LINES.hi), 2400);
    }, 20000);
  }

  /* ---------- 点击音效：摸她一下，就播放 img/mascot-voice.m4a 录音 ----------
     第一次点击时才创建 <audio>（懒加载，不点就不下载这 27KB）；
     再点一下从头播（currentTime 归零），音量收到 0.9 免得吓到人；
     浏览器自动播放策略偶尔会拒绝 play()，catch 掉保持安静，不影响页面 */
  var voice = null;
  function playVoice() {
    try {
      if (!voice) {
        voice = document.createElement('audio');
        voice.src = IMG_BASE + 'mascot-voice.m4a'; // 章节页 IMG_BASE 是 ../img/，自动指对目录
        voice.preload = 'auto';
        voice.volume = 0.9;
        box.appendChild(voice); // 挂在她身上，audio 不放 controls 不占画面
      }
      voice.currentTime = 0;
      var p = voice.play();
      if (p && p.catch) p.catch(function () { /* 被拦截就只出文字气泡 */ });
    } catch (e) { /* 老浏览器缺函数也不报错 */ }
  }

  /* ---------- 交互：点一下 → 眯眼笑 + 弹跳 + 说话；按住拖动 → 松开停在新位置 ---------- */

  box.addEventListener('click', function () {
    // 刚拖完抬手会顺手触发一次 click：300ms 内的点击忽略，只当"放好了"
    if (drag.lastEnd && performance.now() - drag.lastEnd < 300) return;
    if (!open || rice.active || dead.active) return; // 米饭 / 宕机序列播放中不打断
    st.happyUntil = performance.now() + 1800;
    st.squash = 1;
    say(pick(LINES.pet));
    playVoice(); // 摸头音效
  });
  box.addEventListener('mouseenter', function () {
    if (!open || box.dataset.greeted) return;
    box.dataset.greeted = '1';
    say(pick(LINES.hi)); // 第一次鼠标经过时打个招呼
  });

  /* 拖动（鼠标 / 单指 / 触屏笔通用）：
     1. pointerdown 记下"按住点"相对她左上角的偏移，并 setPointerCapture 抓牢指针
        —— 哪怕手指滑出她身体外面，事件也照样回到 box，不会中途丢失；
     2. pointermove 超过 6px 才算真在拖（防止手抖一下把"点她"误判成"拖她"），
        之后把 box 的 top/right 换成 left/top 定位，每帧跟随手指；
     3. 用「视口坐标 + 滚动量」算页面绝对位置再扣掉她所在容器（.hero / 做题区，
        都是 position:relative）的位置，所以怎么滚动页面都能精准贴手；
     4. 始终 clamp 在可视范围内，不会拖出屏幕找不回来；松手就停在那儿（不做动画）。
     注意 CSS 里 .mascot 的 touch-action 是 none：手指在她身上滑动时页面不跟着滚。 */
  var drag = { on: false, moved: false, lastEnd: 0 };
  var DRAG_TH = 6; // 拖动判定阈值（px）

  function parentLeftTop(el) { // 容器（相对定位的 .hero / 做题区）左上角的页面绝对坐标
    var b = el.getBoundingClientRect();
    return { l: b.left + window.pageXOffset, t: b.top + window.pageYOffset };
  }

  box.addEventListener('pointerdown', function (ev) {
    drag.on = true; drag.moved = false;
    var b = box.getBoundingClientRect();
    drag.ox = ev.clientX - b.left; // 按住点离她左边缘多远
    drag.oy = ev.clientY - b.top;  // 离上边缘多远
    drag.pid = ev.pointerId;
    try { box.setPointerCapture(ev.pointerId); } catch (e) { /* 老浏览器没有就退回普通点击 */ }
  });

  box.addEventListener('pointermove', function (ev) {
    if (!drag.on || ev.pointerId !== drag.pid) return;
    var b = box.getBoundingClientRect();
    var cx = ev.clientX - b.left - drag.ox; // 相对上一次位置该移动的距离
    var cy = ev.clientY - b.top - drag.oy;
    if (!drag.moved && Math.abs(cx) + Math.abs(cy) < DRAG_TH) return; // 还没过阈值：只当按住了
    drag.moved = true;
    ev.preventDefault();
    var p = parentLeftTop(box.offsetParent || box); // 她的定位基准容器（页面绝对坐标）
    var l = ev.pageX - drag.ox - p.l; // 目标 left = 手指页面位置 − 按住偏移 − 容器位置
    var t = ev.pageY - drag.oy - p.t;
    // 容器左上角当前在视口里的位置（减掉滚动量），用来把她 clamp 在屏幕内不拖丢
    var pvL = p.l - window.pageXOffset, pvT = p.t - window.pageYOffset;
    l = Math.max(-pvL, Math.min(window.innerWidth - box.offsetWidth - pvL, l));
    t = Math.max(-pvT, Math.min(window.innerHeight - box.offsetHeight - pvT, t));
    box.style.left = l + 'px';
    box.style.top = t + 'px';
    box.style.right = 'auto'; // 覆盖 CSS 里写死的 right / bottom，否则两者打架
    box.style.bottom = 'auto';
    if (reduced) draw(performance.now()); // 无动画循环的场合补画一帧，防止画布留白
  });

  function endDrag(ev) { // pointerup（松手）和 pointercancel（被系统打断）都走这里
    if (!drag.on || (ev && ev.pointerId !== drag.pid)) return;
    drag.on = false;
    try { box.releasePointerCapture(drag.pid); } catch (e) { /* 没抓到就不用放 */ }
    if (drag.moved) {
      drag.lastEnd = performance.now(); // 记时间：随后的 click 要忽略
      say('嘿嘿，我会动啦~', 1800);     // 拖动了才打招呼，普通点按还是走摸头台词
    }
    drag.moved = false;
  }
  box.addEventListener('pointerup', endDrag);
  box.addEventListener('pointercancel', endDrag);
})();
