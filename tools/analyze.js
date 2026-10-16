// 一次性分析脚本：统计两个题库 Markdown 的结构特征与不规范之处
const fs = require('fs');
const path = require('path');

const files = ['Web题库.md', 'Java题库.md'];

for (const f of files) {
  const raw = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  const lines = raw.split(/\r?\n/);
  console.log('='.repeat(70));
  console.log(f, 'lines=', lines.length);

  const stats = {
    h2: [], h3: 0, h4: [],
    fence: 0, table: 0, htmlTag: 0, img: 0,
    optNoSpace: [], optOther: [], optCount: {},
    answerLines: [], answerNoBold: [], analysisMissing: [],
    blankLineBeforeAnswer: 0,
    sepMissing: [], oddH3: [], inlineCodeInStem: 0,
  };

  let inFence = false;
  let cur = null;
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (/^\s*```/.test(L)) { inFence = !inFence; stats.fence++; continue; }
    if (inFence) continue;
    if (/^##\s/.test(L)) { stats.h2.push(L); }
    if (/^###\s/.test(L)) {
      if (cur) blocks.push(cur);
      cur = { header: L, line: i + 1, body: [] };
      const m = L.match(/^###\s*(\d+)[.、]\s*(\S+)/);
      if (!m) stats.oddH3.push(`${i + 1}: ${L}`);
      continue;
    }
    if (/^####\s/.test(L)) stats.h4.push(`${i + 1}: ${L}`);
    if (/<[a-zA-Z/!]/.test(L)) stats.htmlTag++;
    if (/!\[/.test(L)) stats.img++;
    if (/^\|/.test(L)) stats.table++;
    if (cur) cur.body.push(L);
  }
  if (cur) blocks.push(cur);

  console.log('h3 blocks:', blocks.length, ' h2:', stats.h2.length, ' h4:', stats.h4.length);
  console.log('h2 list:', stats.h2.join(' | '));
  console.log('fences:', stats.fence, 'htmlTagLines:', stats.htmlTag, 'img:', stats.img, 'tableLines:', stats.table);

  // 检查每个块
  for (const b of blocks) {
    const body = b.body;
    const opts = body.filter(l => /^\s*[-*]?\s*[A-ZＡ-Ｚa-z][.、．)）]\s*/.test(l));
    const optLines = body.filter(l => /^\s*[-*]?\s*[A-ZＡ-Ｚ][.、．)）]/.test(l));
    const key = optLines.length;
    stats.optCount[key] = (stats.optCount[key] || 0) + 1;
    // 选项行是否有前导 "- "
    for (const l of optLines) {
      if (!/^-\s+[A-Z][.、．)）]/.test(l)) stats.optOther.push(`${b.line}: ${JSON.stringify(l.slice(0, 40))}`);
    }
    const ansIdx = body.findIndex(l => /\*\*答案\*\*/.test(l));
    const ansIdx2 = body.findIndex(l => /答案/.test(l));
    if (ansIdx === -1) {
      stats.answerNoBold.push(`${b.line} (${b.header.slice(0, 24)}) -> line#${b.line + 1 + (ansIdx2 >= 0 ? ansIdx2 : -1)} ${JSON.stringify((ansIdx2>=0?body[ansIdx2]:'(none)').slice(0,40))}`);
    }
    const anaIdx = body.findIndex(l => /解析/.test(l));
    if (anaIdx === -1) stats.analysisMissing.push(`${b.line} ${b.header.slice(0, 30)}`);
    // 题干里的行内代码
    const stemEnd = ansIdx >= 0 ? ansIdx : body.length;
    const stemTxt = body.slice(0, Math.max(0, optLines.length ? body.indexOf(optLines[0]) : stemEnd)).join('\n');
    if (/`/.test(stemTxt)) stats.inlineCodeInStem++;
    // 选项文本里是否有代码
    const optWithCode = optLines.filter(l => /`/.test(l)).length;
    if (optWithCode) stats.optOther.push('OPT-CODE ' + b.line);
  }

  console.log('选项数量分布:', JSON.stringify(stats.optCount));
  console.log('--- 选项行格式异常 (非 "- X." 形式) 共', stats.optOther.length);
  stats.optOther.slice(0, 30).forEach(s => console.log('   ', s));
  console.log('--- 缺 **答案** 行 共', stats.answerNoBold.length);
  stats.answerNoBold.slice(0, 30).forEach(s => console.log('   ', s));
  console.log('--- 缺 解析 共', stats.analysisMissing.length);
  stats.analysisMissing.slice(0, 30).forEach(s => console.log('   ', s));
  console.log('--- 题干含行内代码:', stats.inlineCodeInStem);
  console.log('--- 非标准 h3 标题:', stats.oddH3.length);
  stats.oddH3.slice(0, 20).forEach(s => console.log('   ', s));
}
