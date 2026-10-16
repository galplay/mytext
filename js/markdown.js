/* js/markdown.js —— 极简 Markdown 渲染器（题干 / 选项 / 解析共用）
 *
 * 题库原文是 Markdown，含这几类语法，渲染时按顺序处理：
 *   1. 先整体 HTML 转义 —— 保证题目里的 <video> 这类内容按文本显示，不被当成标签
 *   2. ``` 代码块 → <pre><code>
 *   3. `行内代码` → <code>
 *   4. **加粗** → <strong>
 *   5. 空行分段，段内单换行 → <br>
 */
window.MD = (function () {
  'use strict';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var TOKEN = /\u0000BLOCK(\d+)\u0000/g;

  function render(src) {
    if (!src) return '';
    var text = escapeHtml(src);
    var blocks = [];

    // 代码块先取出占位，避免块内内容被后续行内规则误伤
    text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, function (m, code) {
      blocks.push('<pre><code>' + code.replace(/\n$/, '') + '</code></pre>');
      return '\u0000BLOCK' + (blocks.length - 1) + '\u0000';
    });

    // 占位符单独成段，方便下面按段落输出
    text = text.replace(/([^\n])\u0000BLOCK(\d+)\u0000/g, '$1\n\n\u0000BLOCK$2\u0000');
    text = text.replace(/\u0000BLOCK(\d+)\u0000([^\n])/g, '\u0000BLOCK$1\u0000\n\n$2');

    text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');

    var html = text.split(/\n{2,}/).map(function (p) {
      p = p.replace(/^\n+|\n+$/g, '');
      if (!p) return '';
      if (TOKEN.test(p)) {
        TOKEN.lastIndex = 0;
        if (p.replace(TOKEN, '').trim() === '') {
          return p.replace(TOKEN, function (m, i) { return blocks[+i]; });
        }
      }
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('');

    // 兜底：未被段落规则覆盖的占位符直接还原
    html = html.replace(TOKEN, function (m, i) { return blocks[+i]; });
    return html;
  }

  return { render: render, escapeHtml: escapeHtml };
})();
