/* js/account.js —— 登录 / 注册页逻辑（后端版：账号存在服务器）
 *
 * 流程：
 *   1. 打开页面时先向服务器问一句「我已经登录了吗」（Store.me()）：
 *      已登录 → 直接去个人主页；token 失效 → Store 自动退回游客，正常显示表单；
 *   2. 表单提交 → 先本地校验（用户名格式 / 密码长度 / 两次一致）→ 请求服务器；
 *   3. 登录/注册成功 → 若本机存有游客数据，询问是否上传到账号（换设备也能看到）
 *      → 跳转（支持 ?next=xxx.html 跳回来源页，白名单校验，防止跳到站外）。
 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  /* ?next= 白名单：只允许站内的"平级 html 页面"（如 rank.html、index.html） */
  var NEXT_OK = /^[a-z0-9._-]+\.html(\?[^#]*)?$/i;

  function wantedNext() {
    var m = /[?&]next=([^&#]+)/.exec(location.search);
    if (!m) return '';
    var val;
    try { val = decodeURIComponent(m[1]); } catch (e) { return ''; }
    return NEXT_OK.test(val) ? val : '';
  }

  function showError(msg) {
    var box = $('authError');
    if (!msg) {
      box.hidden = true;
      box.textContent = '';
      return;
    }
    box.textContent = msg;
    box.hidden = false;
  }

  /* 登录 / 注册成功后：可选把游客数据上传到账号，然后跳转 */
  function afterLogin(name) {
    function go() { location.href = wantedNext() || 'index.html'; }

    var guestCount = Store.guestDataCount();
    if (guestCount <= 0) return go();

    var upload = window.confirm(
      '检测到这台浏览器里存着游客身份的数据（作答进度、收藏、笔记）。\n\n' +
      '确定：上传到「' + name + '」账号（以后换电脑 / 换浏览器登录也能看到）\n' +
      '取消：数据留在本机游客身份下，不上传'
    );
    if (!upload) return go();

    Store.importGuestData().then(function (res) {
      if (res.ok) UI.toast('已上传 ' + res.data.moved + ' 项游客数据');
      else UI.toast('上传失败：' + res.err + '（游客数据已保留，可稍后重新登录再试）');
      go();
    });
  }

  function setTab(which) {
    var isLogin = which === 'login';
    $('tabLogin').classList.toggle('is-active', isLogin);
    $('tabRegister').classList.toggle('is-active', !isLogin);
    $('tabLogin').setAttribute('aria-selected', isLogin ? 'true' : 'false');
    $('tabRegister').setAttribute('aria-selected', isLogin ? 'false' : 'true');
    $('paneLogin').hidden = !isLogin;
    $('paneRegister').hidden = isLogin;
    showError('');
    (isLogin ? $('loginName') : $('regName')).focus();
  }

  /* 提交期间把按钮禁掉，防止连点发两次请求；失败再解开 */
  function busy(btn, on) {
    btn.disabled = on;
  }

  function init() {
    UI.bindHeaderTools();

    // 已登录（且 token 仍然有效）→ 账号页没有意义，直接去个人主页。
    // 用服务器确认而不是看本机缓存：token 失效时 Store 内部会自动退回游客，
    // 不会出现"两个页面互相跳"的死循环。
    Store.me().then(function (res) {
      if (res.ok) location.replace('profile.html');
    });

    $('tabLogin').addEventListener('click', function () { setTab('login'); });
    $('tabRegister').addEventListener('click', function () { setTab('register'); });

    var loginForm = $('paneLogin');
    var registerForm = $('paneRegister');

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('loginName').value.trim();
      var pass = $('loginPass').value;
      if (!name) return showError('请输入用户名');
      if (!pass) return showError('请输入密码');
      var btn = loginForm.querySelector('button[type="submit"]');
      busy(btn, true);
      Store.session.login(name, pass).then(function (res) {
        if (!res.ok) {
          busy(btn, false);
          return showError(res.err);
        }
        afterLogin(res.rec.name);
      });
    });

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('regName').value.trim();
      var pass = $('regPass').value;
      var pass2 = $('regPass2').value;
      var nick = $('regNick').value.trim();
      if (!name) return showError('请输入用户名');
      if (!/^[\w\u4e00-\u9fa5]{2,16}$/.test(name)) return showError('用户名需为 2-16 位字母、数字、下划线或中文');
      if (pass.length < 4) return showError('密码至少 4 位');
      if (pass !== pass2) return showError('两次输入的密码不一致');
      var btn = registerForm.querySelector('button[type="submit"]');
      busy(btn, true);
      Store.session.register(name, pass, nick).then(function (res) {
        if (!res.ok) {
          busy(btn, false);
          return showError(res.err);
        }
        afterLogin(res.rec.name);
      });
    });

    $('loginName').focus();
  }

  init();
})();
