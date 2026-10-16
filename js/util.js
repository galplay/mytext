/* js/util.js —— 小工具：轻提示、顶栏主题 / 字号切换、顶栏账号位、头像与用时格式化
 * 主题、字号的存取统一走 Store，页面首帧的预置脚本读取的是同一批键。
 */
window.UI = (function () {
  'use strict';

  /* 底部轻提示，自动消失；同时最多显示两条 */
  function toast(msg) {
    var host = document.getElementById('toastHost');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    host.appendChild(el);
    while (host.children.length > 2) host.removeChild(host.firstChild);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 280);
    }, 1700);
  }

  /* 毫秒 → 可读用时："42 秒 / 5 分 12 秒 / 1 时 3 分"；
     无数据或不足 1 秒（几乎没怎么停留）时返回 '—' */
  function fmtDur(ms) {
    if (!ms || ms < 1000) return '—';
    var s = Math.round(ms / 1000);
    if (s < 60) return s + ' 秒';
    var m = Math.floor(s / 60);
    if (m < 60) {
      var rs = s % 60;
      return rs ? m + ' 分 ' + rs + ' 秒' : m + ' 分钟';
    }
    var rh = Math.floor(m / 60);
    var rm = m % 60;
    return rm ? rh + ' 时 ' + rm + ' 分' : rh + ' 小时';
  }

  /* 头像元素：rec = 账号信息对象（Store.session.user() 或好友条目 {name,nick,avatar}）。
     有上传图片用 <img>，否则用「底色 + 昵称首字」。size: 'sm' | 'lg' */
  function avatarEl(rec, size) {
    var d = document.createElement('span');
    d.className = 'avatar avatar--' + (size || 'sm');
    var av = rec && rec.avatar;
    if (av && av.type === 'img' && av.d) {
      var img = document.createElement('img');
      img.src = av.d;
      img.alt = '';
      d.appendChild(img);
    } else {
      d.classList.add('avatar--color');
      d.style.background = (av && av.c) || '#4f46e5';
      d.textContent = String((rec && (rec.nick || rec.u)) || '?').slice(0, 1);
    }
    return d;
  }

  /* 顶栏右侧账号位：未登录显示「登录」按钮，已登录显示头像（点进个人主页）。
     章节页在 chapters/ 子目录下，用 body[data-bank] 判断要加 "../" 前缀。 */
  function renderAccount() {
    var host = document.getElementById('topbarAccount');
    if (!host) return;
    var base = document.body.getAttribute('data-bank') ? '../' : '';
    var name = window.Store ? Store.session.get() : 'guest';
    host.innerHTML = '';
    var a;
    if (name === 'guest') {
      a = document.createElement('a');
      a.className = 'topbar__login';
      a.href = base + 'account.html';
      a.textContent = '登录';
      a.title = '登录 / 注册（不登录也能刷题）';
    } else {
      var rec = Store.session.user();
      a = document.createElement('a');
      a.className = 'topbar__avatar';
      a.href = base + 'profile.html';
      a.title = (rec && rec.nick ? rec.nick : name) + ' · 个人主页';
      a.appendChild(avatarEl(rec, 'sm'));
    }
    host.appendChild(a);
  }

  function syncThemeIcon() {
    var icon = document.querySelector('[data-theme-icon]');
    if (icon) {
      icon.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    }
  }

  /* 绑定顶栏的「切换主题」「切换字号」按钮（页面上存在哪个绑哪个），
     并渲染顶栏账号位（页面上存在 #topbarAccount 时） */
  function bindHeaderTools() {
    var themeBtn = document.getElementById('themeToggle');
    var fontBtn = document.getElementById('fontToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', t);
        if (window.Store) Store.theme.set(t);
        syncThemeIcon();
      });
    }
    if (fontBtn) {
      fontBtn.addEventListener('click', function () {
        var on = document.documentElement.classList.toggle('font-large');
        if (window.Store) Store.font.set(on ? 'large' : 'normal');
      });
    }
    syncThemeIcon();
    renderAccount();
  }

  return {
    toast: toast,
    fmtDur: fmtDur,
    avatarEl: avatarEl,
    renderAccount: renderAccount,
    bindHeaderTools: bindHeaderTools,
  };
})();
