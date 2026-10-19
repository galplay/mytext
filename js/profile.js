/* js/profile.js —— 个人主页（后端版）：资料 / 战绩 / 好友全部读写服务器
 *
 * 打开页面：
 *   1. 本机没有登录凭证 → 直接去登录页（登录成功后回到本页）；
 *   2. 有凭证 → Store.me() 向服务器拉「我的资料 + 战绩」；
 *      token 失效（401）→ Store 自动退回游客身份，这里跳去登录页；
 *   3. 拉到数据后渲染：大头像、昵称、签名、六项战绩指标、好友列表。
 *
 * 头像方案（和纯静态版一致，只是保存位置换成了服务器）：
 *   - 默认「底色 + 昵称首字」的色块头像；
 *   - 也可以上传图片：FileReader 读入 → canvas 居中裁剪成正方形 → 缩到 128×128
 *     → 导出 JPEG（质量 0.85）→ 存进服务器（服务器限制头像数据约 600KB 以内）。
 */
(function () {
  'use strict';

  /* 带 ?u=用户名 打开 = 查看他人主页（只读，游客也能看，不用登录）；
     不带参数 = 我的主页（没登录凭证则先去登录页）。 */
  var target = '';
  try { target = (new URLSearchParams(location.search).get('u') || '').trim(); } catch (e) { target = ''; }
  var viewingOther = false; // 拉到数据后确认「看的不是自己」才置 true

  if (!target && Store.session.get() === 'guest') {
    // 本机没有任何登录凭证：先去登录，登录成功后回到本页
    location.replace('account.html?next=profile.html');
    return;
  }

  var me = null;      // 服务器上的当前用户（资料 + 好友）
  var myStats = null; // 服务器算好的战绩

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function fmtDate(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /* ---------- 头部（大头像 + 昵称 + 用户名 + 签名） ---------- */

  function renderHead() {
    if (!me) return;
    var host = $('profileHead');
    host.innerHTML = '';
    host.appendChild(UI.avatarEl(me, 'lg'));
    var box = el('div', 'profile-head__meta');
    box.appendChild(el('h1', 'profile-head__nick', me.nick || me.name));
    box.appendChild(el('p', 'profile-head__user', '@' + me.name + (me.created ? ' · ' + fmtDate(me.created) + ' 注册' : '')));
    if (me.sig) box.appendChild(el('p', 'profile-head__sig', me.sig));
    else box.appendChild(el('p', 'profile-head__sig is-empty', '还没有个性签名，写一句吧'));
    host.appendChild(box);
  }

  /* ---------- 头像编辑 ---------- */

  function renderAvatarPreview() {
    if (!me) return;
    var host = $('avatarPreview');
    host.innerHTML = '';
    host.appendChild(UI.avatarEl(me, 'lg'));
  }

  function renderSwatches() {
    var av = (me && me.avatar) || {};
    var row = $('swatchRow');
    row.innerHTML = '';
    Store.avatarColors.forEach(function (color) {
      var b = el('button', 'swatch');
      b.type = 'button';
      b.style.background = color;
      b.title = '用这个颜色做头像底色';
      b.setAttribute('aria-label', '头像底色 ' + color);
      if (av.type === 'color' && av.c === color) b.classList.add('is-active');
      b.addEventListener('click', function () {
        applyAvatar({ type: 'color', c: color }, '头像已更新');
      });
      row.appendChild(b);
    });
    $('avatarReset').hidden = av.type !== 'img';
  }

  /* 换头像统一走这里：把新头像传给服务器，成功后再刷新界面 */
  function applyAvatar(avatar, okMsg) {
    if (!me) return;
    Store.updateProfile({ avatar: avatar }).then(function (res) {
      if (!res.ok) { UI.toast(res.err); return; }
      me = res.data.user;
      refreshAvatarUI();
      UI.toast(okMsg);
    });
  }

  /* 头像变化的统一刷新（不碰昵称/签名输入框，避免覆盖用户正在编辑的内容） */
  function refreshAvatarUI() {
    renderHead();
    renderAvatarPreview();
    renderSwatches();
    UI.renderAccount();
  }

  function bindAvatarUpload() {
    $('avatarFile').addEventListener('change', function () {
      var file = this.files && this.files[0];
      this.value = ''; // 清空，允许再次选同一个文件
      if (!file || !me) return;
      if (!/^image\//.test(file.type)) { UI.toast('请选择图片文件'); return; }
      if (file.size > 4 * 1024 * 1024) { UI.toast('图片太大（超过 4MB），换一张小一点的'); return; }

      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var side = 128;
          var cv = document.createElement('canvas');
          cv.width = side;
          cv.height = side;
          var ctx = cv.getContext('2d');
          var s = Math.min(img.width, img.height); // 居中裁剪出最大的正方形
          ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, side, side);
          var prev = (me && me.avatar) || {};
          applyAvatar({
            type: 'img',
            d: cv.toDataURL('image/jpeg', 0.85),
            c: prev.c || Store.avatarColors[0], // 记住底色，"换回色块"时还能用
          }, '头像已更换');
        };
        img.onerror = function () { UI.toast('这张图片读不出来，换一张试试'); };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    $('avatarReset').addEventListener('click', function () {
      var av = (me && me.avatar) || {};
      applyAvatar({ type: 'color', c: av.c || Store.avatarColors[0] }, '已换回色块头像');
    });
  }

  /* ---------- 昵称 / 签名 ---------- */

  function renderFields() {
    if (!me) return;
    $('nickInput').value = me.nick || me.name;
    $('sigInput').value = me.sig || '';
  }

  function bindSave() {
    $('saveProfile').addEventListener('click', function () {
      if (!me) return;
      var nick = $('nickInput').value.trim();
      if (!nick) { UI.toast('昵称不能为空'); $('nickInput').focus(); return; }
      var btn = $('saveProfile');
      btn.disabled = true;
      Store.updateProfile({ nick: nick, sig: $('sigInput').value.trim() }).then(function (res) {
        btn.disabled = false;
        if (!res.ok) { UI.toast(res.err); return; }
        me = res.data.user;
        renderHead();
        renderFields();
        UI.renderAccount();
        UI.toast('资料已保存');
      });
    });
  }

  /* ---------- 战绩 ---------- */

  function totalQuestions() {
    var n = 0;
    if (window.QUIZ_BANKS) {
      Object.keys(window.QUIZ_BANKS).forEach(function (k) {
        var b = window.QUIZ_BANKS[k];
        if (!b) return;
        (b.chapters || []).forEach(function (c) { n += (c.questions || []).length; });
      });
    }
    return n;
  }

  function totalChapters() {
    var n = 0;
    if (window.QUIZ_BANKS) {
      Object.keys(window.QUIZ_BANKS).forEach(function (k) {
        var b = window.QUIZ_BANKS[k];
        if (b) n += (b.chapters || []).length;
      });
    }
    return n;
  }

  function renderStats() {
    if (!myStats) return;
    var st = myStats;
    var items = [
      ['已答题数', st.answered + ' / ' + totalQuestions()],
      ['正确率', st.answered ? st.rate + '%' : '—'],
      ['累计用时', UI.fmtDur(st.elapsed)],
      ['完成章节', (st.chaptersDone | 0) + ' / ' + totalChapters()],
      ['收藏', (st.stars | 0) + ' 题'],
      ['笔记', (st.notes | 0) + ' 条'],
    ];
    var grid = $('metricGrid');
    grid.innerHTML = '';
    items.forEach(function (it) {
      var m = el('div', 'metric');
      m.appendChild(el('strong', 'metric__num', it[1]));
      m.appendChild(el('span', 'metric__label', it[0]));
      grid.appendChild(m);
    });

    var parts = [];
    if (window.QUIZ_BANKS) {
      Object.keys(window.QUIZ_BANKS).forEach(function (bid) {
        if (!window.QUIZ_BANKS[bid]) return;
        var b = st.byBank[bid] || { answered: 0, rate: 0, elapsed: 0 };
        parts.push(window.QUIZ_BANKS[bid].short + '：已答 ' + b.answered +
          ' · 正确率 ' + (b.answered ? b.rate + '%' : '—') +
          ' · 用时 ' + UI.fmtDur(b.elapsed));
      });
    }
    $('bankSplit').textContent = parts.join('；');
  }

  /* ---------- 好友 ---------- */

  function renderFriends() {
    var list = $('friendList');
    list.innerHTML = '';
    var friends = (me && me.friends) || [];
    if (!friends.length) {
      list.appendChild(el('p', 'friend-empty', '还没有好友。把用户名告诉同学，让 TA 也注册后互加，就能一起刷题 PK 了。'));
      return;
    }
    friends.forEach(function (fr) {
      var row = el('div', 'friend-row');
      /* 头像和名字可点：跳到 TA 的主页（?u= 只读模式） */
      var link = el('a', 'friend-row__link');
      link.href = 'profile.html?u=' + encodeURIComponent(fr.name);
      link.title = '查看 ' + (fr.nick || fr.name) + ' 的主页';
      link.appendChild(UI.avatarEl(fr, 'sm'));
      var meta = el('div', 'friend-row__meta');
      meta.appendChild(el('strong', null, fr.nick || fr.name));
      meta.appendChild(el('span', 'friend-row__user', '@' + fr.name));
      link.appendChild(meta);
      row.appendChild(link);

      var pk = el('a', 'btn btn--ghost btn--sm', 'PK');
      pk.href = 'rank.html?with=' + encodeURIComponent(fr.name);
      pk.title = '和 ' + (fr.nick || fr.name) + ' 对比战绩';
      row.appendChild(pk);

      /* 移除按钮只在「我自己的主页」上出现：看别人时好友是 TA 的，轮不到我们删 */
      if (!viewingOther) {
        var rm = el('button', 'btn btn--ghost btn--sm btn--danger', '移除');
        rm.type = 'button';
        rm.addEventListener('click', function () {
          if (!window.confirm('把「' + (fr.nick || fr.name) + '」从好友里移除吗？')) return;
          rm.disabled = true;
          Store.friendRemove(fr.name).then(function (res) {
            if (!res.ok) { rm.disabled = false; UI.toast(res.err); return; }
            refreshFriends();
            UI.toast('已移除好友');
          });
        });
        row.appendChild(rm);
      }
      list.appendChild(row);
    });
  }

  /* 好友变化后重新从服务器拉一遍资料（昵称、头像都是最新的） */
  function refreshFriends() {
    return Store.me().then(function (res) {
      if (res.ok) {
        me = res.data.user;
        renderHead();
        renderFriends();
      }
    });
  }

  function bindFriendAdd() {
    function add() {
      if (!me) return;
      var name = $('friendName').value.trim();
      if (!name) { UI.toast('先输入对方的用户名'); return; }
      if (name === me.name) { UI.toast('不能加自己'); return; }
      var btn = $('friendAddBtn');
      btn.disabled = true;
      Store.friendAdd(name).then(function (res) {
        btn.disabled = false;
        if (!res.ok) { UI.toast(res.err); return; }
        $('friendName').value = '';
        UI.toast('已和 ' + name + ' 成为好友');
        refreshFriends();
      });
    }
    $('friendAddBtn').addEventListener('click', add);
    $('friendName').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); add(); }
    });
  }

  /* ---------- 退出登录 ---------- */

  function bindLogout() {
    $('logoutBtn').addEventListener('click', function () {
      if (!window.confirm('退出登录？退出后作答数据会切换到游客身份（服务器上的数据仍在，重新登录就能继续）。')) return;
      Store.session.logout().then(function () {
        location.href = 'index.html';
      });
    });
  }

  /* ---------- 看他人主页（?u= 只读模式） ---------- */

  function bootOther() {
    UI.bindHeaderTools(); // 看别人主页也能切主题/字号、看顶栏登录位
    Store.userPublic(target).then(function (res) {
      if (!res.ok) {
        var note = $('viewingNote');
        note.hidden = false;
        note.textContent = res.status === 404
          ? '没有找到用户「' + target + '」，TA 可能还没注册。'
          : '主页加载失败：' + res.err;
        return;
      }
      // 点到自己头像（isSelf）：不套只读壳子，直接走回「我的主页」正常流程
      if (res.data.isSelf || res.data.user.name === Store.session.get()) {
        target = '';
        bootMe();
        return;
      }

      me = res.data.user;
      myStats = res.data.stats;
      viewingOther = true;

      // 编辑资料、加好友、退出登录 都是「我自己的事」，看别人时全部收起
      $('editPane').hidden = true;
      $('friendAdd').hidden = true;
      $('friendHint').textContent = '下面是 TA 的好友，点头像或名字可以去看 TA 的主页。';
      $('profileActionsBar').hidden = true;
      $('statsTitle').textContent = 'TA 的战绩';

      var note = $('viewingNote');
      note.hidden = false;
      note.textContent = '你正在查看「' + (me.nick || me.name) + '」的主页（他人资料只读）。';
      if (Store.session.get() !== 'guest') {
        var back = el('a', 'btn btn--ghost btn--sm', '回到我的主页');
        back.href = 'profile.html';
        back.style.marginLeft = '10px';
        note.appendChild(back);
      }

      $('whoami').textContent = me.name;
      renderHead();
      renderStats();
      renderFriends();

      // 看别人时也提供一键「加好友 / 已是好友」：就挂在提示条后面
      if (Store.session.get() !== 'guest' && me.name !== Store.session.get()) {
        var already = ((Store.session.user() || {}).friends || []).some(function (f) { return f.name === me.name; });
        if (!already) {
          var add = el('button', 'btn btn--primary btn--sm', '加 TA 为好友');
          add.type = 'button';
          add.style.marginLeft = '10px';
          add.addEventListener('click', function () {
            add.disabled = true;
            Store.friendAdd(me.name).then(function (r) {
              add.disabled = false;
              if (!r.ok) { UI.toast(r.err); return; }
              add.textContent = '✓ 已是好友';
              UI.toast('已和 ' + (me.nick || me.name) + ' 成为好友');
            });
          });
          note.appendChild(add);
        }
      }
    });
  }

  /* ---------- 我的主页（原有流程） ---------- */

  function bootMe() {
    UI.bindHeaderTools();
    $('whoami').textContent = Store.session.get(); // 先用本机缓存占位，拉到资料后再换成真名
    bindAvatarUpload();
    bindSave();
    bindFriendAdd();
    bindLogout();

    Store.me().then(function (res) {
      if (!res.ok) {
        if (res.status === 401) {
          // 登录已失效：Store 内部已切回游客身份，去登录页（登录成功后回到本页）
          location.replace('account.html?next=profile.html');
        } else {
          UI.toast('无法连接服务器，资料暂时加载不出来：' + res.err);
        }
        return;
      }
      me = res.data.user;
      myStats = res.data.stats;
      $('whoami').textContent = me.name;
      renderHead();
      renderAvatarPreview();
      renderSwatches();
      renderFields();
      renderStats();
      renderFriends();
    });
  }

  if (target) bootOther(); else bootMe();
})();
