// 查看具体异常区域
const fs = require('fs');
const path = require('path');
function dump(file, from, to) {
  const lines = fs.readFileSync(path.join(__dirname, '..', file), 'utf8').split(/\r?\n/);
  console.log('#####', file, from, '-', to);
  for (let i = from - 1; i < to && i < lines.length; i++) console.log(String(i + 1).padStart(5), JSON.stringify(lines[i]));
}
dump('Java题库.md', 1090, 1145);   // 70..73 区
dump('Java题库.md', 2150, 2235);   // 142 多选题区域
dump('Web题库.md', 340, 420);      // 26..32
module.exports = {};
