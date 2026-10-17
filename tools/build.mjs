#!/usr/bin/env node
/**
 * tools/build.mjs —— 题库构建脚本（零依赖，需要 Node 18+）
 *
 * 用法：在项目根目录运行
 *     node tools/build.mjs
 *
 * 作用：
 *   1. 解析《Web题库.md》《Java题库.md》，生成 data/web.js、data/java.js
 *   2. 按 tools/template-chapter.html 生成 chapters/*.html 章节答题页
 *
 * 改完题库后，重新运行本脚本即可，不要手改生成产物。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPE_MAP = { '单选题': 'single', '多选题': 'multi', '判断题': 'judge' };
const TYPE_LABEL = { single: '单选题', multi: '多选题', judge: '判断题' };

/* 题库原文勘误表
 * 题库由多人整理，个别条目存在明显笔误。这里只做「有据可查」的最小修正，
 * 不改动题库源文件；每条修正都会在构建报告里列出原因。
 *   - Web题库.md 第 80 题：答案写作 E，但该题只有 A~D 四个选项，
 *     且解析明确说明 unshift()（选项 B）正确，属答案键笔误 → B。
 *   - Java题库.md 第 71 题：缺少「**答案**」行，
 *     解析明确说明 final（选项 B）用于定义常量 → 答案 B。
 */
const FIXES = [
  { file: 'Web题库.md', num: 80, answer: ['B'], why: '原题无 E 选项，解析指向 unshift()（选项 B）' },
  { file: 'Java题库.md', num: 71, answer: ['B'], why: '原题缺少答案行，解析指向 final（选项 B）' },
];

/* Java 题库章节切分表
 * 原文只有「## Java题库」一个章节、219 道题混排（不同主题的题交错出现，末尾是
 * 15 道判断题和 1 道大案例）。这里按题目的知识主题把它重新分组为 10 章：
 *   - 不改动任何题目内容，只改分组与展示顺序（每章内仍按原题号升序）；
 *   - 每个原题号必须且只能出现在一个章节里，构建脚本会强校验（漏题/重题直接报错）。
 * 修改分组时改这里的 nums 即可。
 */
const JAVA_SPLIT = [
  { title: '一、Java 基础与开发环境', nums: [1, 7, 8, 9, 10, 12, 13, 15, 19, 21, 22, 28, 29, 30, 31, 32, 33, 34, 39, 40, 42, 43, 62, 63, 64, 66, 67, 70, 72, 79, 80, 81, 82, 83, 84, 85, 92, 94, 97, 98, 100, 101, 114, 142, 188, 204, 205] },
  { title: '二、类与对象', nums: [5, 14, 16, 20, 44, 49, 55, 56, 60, 71, 75, 77, 99, 104, 111, 143, 154, 164, 168, 196] },
  { title: '三、继承、多态与接口', nums: [2, 4, 6, 17, 18, 24, 25, 26, 27, 35, 36, 37, 38, 41, 45, 47, 48, 50, 51, 52, 54, 57, 59, 69, 74, 76, 78, 107, 122, 125, 152, 157, 167, 176, 177, 207, 208, 209] },
  { title: '四、字符串与常用类', nums: [3, 65, 68, 88, 91, 95, 96, 103, 105, 112, 115, 116, 127, 129, 130, 133, 141, 150, 151, 153, 172, 173, 195, 200, 201, 203, 206, 210] },
  { title: '五、集合与泛型', nums: [11, 23, 46, 58, 73, 86, 87, 89, 90, 93, 102, 106, 108, 110, 117, 119, 155, 166, 174, 186, 194, 197, 198, 211, 212] },
  { title: '六、异常处理', nums: [53, 124, 126, 135, 136, 138, 145, 146, 158, 160, 162, 165, 185, 213, 214] },
  { title: '七、IO 流与文件操作', nums: [61, 109, 121, 123, 128, 131, 132, 134, 137, 144, 148, 156, 170, 178, 179, 181, 187, 191, 192, 193, 215] },
  { title: '八、多线程', nums: [113, 120, 139, 140, 147, 149, 171, 180, 183, 189, 190, 199, 202, 216, 217] },
  { title: '九、Swing 图形界面', nums: [118, 159, 161, 163, 169, 175, 182, 184, 218] },
  { title: '十、综合应用案例', nums: [219] },
];

/* 题库清单：split 字段表示该题库需要按「章节切分表」重新分组 */
const BANKS = [
  { id: 'web', file: 'Web题库.md', title: 'Web 前端', short: 'Web前端题库' },
  { id: 'java', file: 'Java题库.md', title: 'Java 程序设计', short: 'Java程序设计题库', split: JAVA_SPLIT },
];

/* ---------- 工具函数 ---------- */

/** 去掉块首尾的空行和 --- 分隔线 */
function trimBlock(lines) {
  let a = 0;
  let b = lines.length;
  const isNoise = (l) => l.trim() === '' || /^-{3,}$/.test(l.trim());
  while (a < b && isNoise(lines[a])) a++;
  while (b > a && isNoise(lines[b - 1])) b--;
  return lines.slice(a, b);
}

/** 规范化答案：支持 A、C、D / ACD / 正确 / 错误 等写法，统一为字母数组 */
function normalizeAnswer(raw, type, warnings, tag) {
  let s = raw.trim().replace(/[。．.\s]+$/, '');
  const wordMap = {
    '正确': 'A', '对': 'A', '√': 'A', 'T': 'A', 'True': 'A', 'true': 'A',
    '错误': 'B', '错': 'B', '×': 'B', 'F': 'B', 'False': 'B', 'false': 'B',
  };
  if (wordMap[s]) s = wordMap[s];
  let keys = s.split(/[、,，;；/\s]+/).filter(Boolean);
  if (keys.length === 1 && keys[0].length > 1 && /^[A-Z]+$/.test(keys[0])) {
    keys = keys[0].split('');
  }
  if (keys.length === 0) {
    warnings.push(`${tag} 答案为空`);
    return [];
  }
  for (const k of keys) {
    if (!/^[A-Z]$/.test(k)) warnings.push(`${tag} 答案「${raw}」含无法识别的部分`);
  }
  keys = keys.filter((k) => /^[A-Z]$/.test(k));
  if ((type === 'single' || type === 'judge') && keys.length > 1) {
    warnings.push(`${tag} ${TYPE_LABEL[type]} 出现多个答案「${raw}」，只取第一个`);
    keys = keys.slice(0, 1);
  }
  if (type === 'judge' && keys.length === 1 && !['A', 'B'].includes(keys[0])) {
    warnings.push(`${tag} 判断题答案「${raw}」不是 A/B`);
  }
  return keys;
}

/** 从题目块中切出选项（识别 "- A. xxx" 行，取答案行前面最后一组连续字母序列） */
function extractOptions(lines, ansIdx, warnings, tag) {
  const optRe = /^-\s*([A-Z])\.\s?(.*)$/;
  let start = -1;
  for (let i = 0; i < ansIdx; i++) {
    const m = optRe.exec(lines[i]);
    if (m && m[1] === 'A') start = i;
  }
  if (start < 0) {
    warnings.push(`${tag} 题库原文缺少选项（作答页会提示并跳过本题，直接看解析）`);
    return { options: [], textEnd: ansIdx };
  }
  const options = [];
  let cur = null;
  let expected = 'A'.charCodeAt(0);
  let i = start;
  for (; i < ansIdx; i++) {
    const m = optRe.exec(lines[i]);
    if (m) {
      if (m[1].charCodeAt(0) !== expected) {
        warnings.push(`${tag} 选项顺序异常：期望 ${String.fromCharCode(expected)}，实际 ${m[1]}（已保留前面的选项）`);
        break;
      }
      cur = { k: m[1], lines: [m[2]] };
      options.push(cur);
      expected++;
    } else if (cur) {
      // 缺答案行的题目（如 Java 第 71 题），解析行会紧跟选项出现，不能并入选项
      if (/^\*\*(答案|解析)\*\*[：:]/.test(lines[i])) break;
      cur.lines.push(lines[i]);
    }
  }
  return {
    options: options.map((o) => ({ k: o.k, t: trimBlock(o.lines).join('\n').trim() })),
    textEnd: start,
  };
}

/* ---------- 解析一个题库文件 ---------- */

function parseBank(bank) {
  const raw = fs.readFileSync(path.join(ROOT, bank.file), 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n');
  const lines = raw.split('\n');
  const warnings = [];
  const fixed = [];
  const chapters = [];
  let cur = null;
  let curQ = null;

  const finalize = () => {
    if (!curQ || !cur) return;
    const lines2 = curQ.lines;
    const ansIdx = lines2.findIndex((l) => /^\*\*答案\*\*[：:]/.test(l));
    const anaIdx = lines2.findIndex((l) => /^\*\*解析\*\*[：:]/.test(l));
    const tag = `《${bank.file}》第 ${curQ.lineNo} 行 第 ${curQ.num} 题`;

    let answer = [];
    const fix = FIXES.find((f) => f.file === bank.file && f.num === curQ.num);
    if (fix) {
      answer = fix.answer.slice();
      fixed.push(`第 ${curQ.num} 题：答案修正为 ${fix.answer.join('、')}（${fix.why}）`);
    } else if (ansIdx < 0) {
      warnings.push(`${tag} 未找到「**答案**」行`);
    } else {
      answer = normalizeAnswer(lines2[ansIdx].replace(/^\*\*答案\*\*[：:]\s*/, ''), curQ.type, warnings, tag);
    }

    let analysis = '';
    if (anaIdx >= 0) {
      analysis = trimBlock(lines2.slice(anaIdx)).join('\n').replace(/^\*\*解析\*\*[：:]\s*/, '').trim();
    } else {
      warnings.push(`${tag} 原文无解析（解析区将留空）`);
    }

    const limit = ansIdx >= 0 ? ansIdx : lines2.length;
    const { options, textEnd } = extractOptions(lines2.slice(0, limit), limit, warnings, tag);
    const text = trimBlock(lines2.slice(0, textEnd)).join('\n').trim();

    const validKeys = options.map((o) => o.k);
    for (const k of answer) {
      if (validKeys.length && !validKeys.includes(k)) {
        warnings.push(`${tag} 答案「${k}」不在选项 ${validKeys.join('/')} 中`);
      }
    }
    if (!text) warnings.push(`${tag} 题干为空`);

    cur.questions.push({
      num: curQ.num,
      type: curQ.type,
      text,
      options,
      answer,
      analysis,
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const qM = /^###\s+(\d+)\.\s*(.+?)\s*$/.exec(line);
    if (qM) {
      finalize();
      curQ = null;
      const typeZh = qM[2];
      if (!TYPE_MAP[typeZh]) {
        throw new Error(`《${bank.file}》第 ${i + 1} 行无法识别的题型：「${line.trim()}」`);
      }
      if (!cur) throw new Error(`《${bank.file}》第 ${i + 1} 行出现问题：题目出现在任何「## 章节」之前`);
      curQ = { num: +qM[1], type: TYPE_MAP[typeZh], lineNo: i + 1, lines: [] };
      continue;
    }

    const chM = /^##\s+(.+?)\s*$/.exec(line);
    if (chM) {
      finalize();
      curQ = null;
      cur = { title: chM[1], questions: [] };
      chapters.push(cur);
      continue;
    }

    if (curQ) curQ.lines.push(line);
  }
  finalize();

  return { chapters, warnings, fixed };
}

/** 按「章节切分表」把解析出的题目重新分组；漏题、重题、引用不存在的题号都会直接报错 */
function applySplit(bank, chapters, split) {
  const pool = new Map();
  for (const c of chapters) for (const q of c.questions) pool.set(q.num, q);

  const used = new Set();
  const out = split.map((def) => {
    const questions = def.nums.map((n) => {
      const q = pool.get(n);
      if (!q) throw new Error(`《${bank.file}》章节切分：第 ${n} 题不存在`);
      if (used.has(n)) throw new Error(`《${bank.file}》章节切分：第 ${n} 题被重复分配到多个章节`);
      used.add(n);
      return q;
    });
    return { title: def.title, questions };
  });

  const missing = [...pool.keys()].filter((n) => !used.has(n));
  if (missing.length) throw new Error(`《${bank.file}》章节切分遗漏题目：第 ${missing.join('、')} 题`);
  return out;
}

/* ---------- 生成产物 ---------- */

const stats = [];

for (const bank of BANKS) {
  const { chapters, warnings, fixed } = parseBank(bank);
  if (chapters.length === 0) throw new Error(`《${bank.file}》没有解析出任何章节`);

  const finalChapters = bank.split ? applySplit(bank, chapters, bank.split) : chapters;

  const bankObj = {
    id: bank.id,
    title: bank.title,
    short: bank.short,
    source: bank.file,
    // 章节 id 与题目 id 在最终分组后统一生成：<题库>-<章序>-<题序>
    chapters: finalChapters.map((c, ci) => ({
      id: `${bank.id}-${ci + 1}`,
      title: c.title,
      questions: c.questions.map((q, qi) => ({
        id: `${bank.id}-${ci + 1}-${qi + 1}`,
        type: q.type,
        text: q.text,
        options: q.options,
        answer: q.answer,
        analysis: q.analysis,
      })),
    })),
  };

  const outJs = path.join(ROOT, 'data', `${bank.id}.js`);
  fs.mkdirSync(path.dirname(outJs), { recursive: true });
  const payload = JSON.stringify(bankObj, null, 2)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  fs.writeFileSync(
    outJs,
    `// data/${bank.id}.js —— 由 tools/build.mjs 从《${bank.file}》自动生成，请勿手改。\n` +
    `// 改完题库后重新运行：node tools/build.mjs\n` +
    `window.QUIZ_BANKS = window.QUIZ_BANKS || {};\n` +
    `window.QUIZ_BANKS[${JSON.stringify(bank.id)}] = ${payload};\n`,
    'utf8'
  );

  // 生成章节页
  const tpl = fs.readFileSync(path.join(ROOT, 'tools', 'template-chapter.html'), 'utf8');
  fs.mkdirSync(path.join(ROOT, 'chapters'), { recursive: true });
  const pageFiles = [];
  bankObj.chapters.forEach((c, idx) => {
    const total = c.questions.length;
    const outHtml = path.join(ROOT, 'chapters', `${bank.id}-${String(idx + 1).padStart(2, '0')}.html`);
    const html = tpl
      .replaceAll('{{CHAPTER_TITLE}}', c.title)
      .replaceAll('{{BANK_TITLE}}', bank.title)
      .replaceAll('{{BANK_SHORT}}', bank.short)
      .replaceAll('{{BANK_ID}}', bank.id)
      .replaceAll('{{CHAPTER_ID}}', c.id)
      .replaceAll('{{TOTAL}}', String(total))
      .replaceAll('{{PAGE_DESC}}', `DS刷题：${bank.short}「${c.title}」共 ${total} 题，支持答题判分、错题重做与进度保存。`);
    fs.writeFileSync(outHtml, html, 'utf8');
    pageFiles.push(path.basename(outHtml));
  });

  // 统计与对账（轻量自检，不做复杂校验）
  const counts = { single: 0, multi: 0, judge: 0 };
  for (const c of bankObj.chapters) for (const q of c.questions) counts[q.type]++;
  const total = counts.single + counts.multi + counts.judge;

  const headTotal = /共\s*(\d+)\s*题/.exec(raw0(bank.file));
  const headTypes = /单选题\s*(\d+)\s*\+\s*多选题\s*(\d+)\s*\+\s*判断题\s*(\d+)/.exec(raw0(bank.file));
  const check = [];
  if (headTotal) check.push(headTotal[1] === String(total) ? `总数 ${total} 与表头一致` : `总数 ${total}，表头写 ${headTotal[1]}，请核对`);
  if (headTypes) {
    const ok = +headTypes[1] === counts.single && +headTypes[2] === counts.multi && +headTypes[3] === counts.judge;
    check.push(ok ? '题型分布与表头一致' : `题型分布 单选${counts.single}/多选${counts.multi}/判断${counts.judge}，表头 ${headTypes[1]}/${headTypes[2]}/${headTypes[3]}，请核对`);
  }

  stats.push({
    bank: bank.file, out: `data/${bank.id}.js`, pages: pageFiles, warnings, fixed,
    lines: [
      bank.split
        ? `原文件 ${chapters.length} 个章节 → 按主题切分为 ${bankObj.chapters.length} 章，题目总数不变（仅重新分组，见 tools/build.mjs 的切分表）`
        : null,
      `章节 ${bankObj.chapters.length} 个，题目 ${total} 道（单选 ${counts.single} · 多选 ${counts.multi} · 判断 ${counts.judge}）`,
      ...bankObj.chapters.map((c) => `  ${c.title}：${c.questions.length} 题`),
      `自检：${check.join('，') || '文件表头无统计信息，跳过对账'}`,
    ].filter(Boolean),
  });
}

function raw0(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

/* ---------- 输出报告 ---------- */

let warnCount = 0;
console.log('构建完成：\n');
for (const s of stats) {
  console.log(`[${s.bank}] -> ${s.out}`);
  for (const l of s.lines) console.log(`   ${l}`);
  console.log(`   生成章节页 ${s.pages.length} 个：${s.pages.join('、')}`);
  for (const f of s.fixed) {
    console.log(`   [勘误] ${f}`);
  }
  for (const w of s.warnings) {
    warnCount++;
    console.log(`   [!] ${w}`);
  }
  console.log('');
}
console.log(warnCount === 0 ? '完成：无异常提示。' : `注意：共 ${warnCount} 条异常提示，请核对。`);
