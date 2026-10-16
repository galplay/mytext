/* server/db.js —— 数据库模块（网站的「档案室」）
 *
 * 用 Node 24 自带的 node:sqlite（零依赖：不需要 npm install 安装任何东西）。
 * 整个数据库就是本目录下的 data.db 一个文件：复制它即可备份/搬家，
 * 删掉它、下次启动会自动重建一个空库。
 *
 * 表结构（7 张表）：
 *   users    账号：用户名、昵称、盐、密码散列、头像(JSON)、签名、注册时间
 *   sessions 登录会话：token → 用户名。浏览器保存 token，服务器凭它认人
 *   friends  好友关系（双向各存一行，如 小明→小红 和 小红→小明）
 *   records  逐题作答记录：草稿(ok=NULL) / 答对(ok=1) / 答错(ok=0)
 *   stars    题目收藏
 *   notes    题目笔记
 *   chapters 每章进度：断点位置 pos、是否交卷 done、累计用时 acc、上次保存时间 last_ts
 *
 * 安全上的两个关键做法（答辩常被问）：
 *   1. 密码不存明文：用 Node 自带的 crypto.scrypt 加盐散列，库里只存「盐 + 散列值」。
 *      就算 data.db 文件被人拿走，也看不到用户的原密码。
 *   2. 防 SQL 注入：所有 SQL 全部用参数化查询（? 占位符），绝不把用户输入拼接进 SQL。
 */
'use strict';

const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('node:path');

const DB_PATH = path.join(__dirname, 'data.db'); // 数据库文件就在 server/ 目录里
const SESSION_GAP_MS = 10 * 60 * 1000; // 两次保存间隔超过 10 分钟视为挂机，不计入用时

const db = new DatabaseSync(DB_PATH);

/* ---------- 建表（IF NOT EXISTS：表已存在就跳过，不会清数据） ---------- */
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    name    TEXT PRIMARY KEY,
    nick    TEXT NOT NULL,
    salt    TEXT NOT NULL,
    hash    TEXT NOT NULL,
    avatar  TEXT NOT NULL,
    sig     TEXT NOT NULL DEFAULT '',
    created INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token   TEXT PRIMARY KEY,
    name    TEXT NOT NULL,
    created INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS friends (
    a       TEXT NOT NULL,
    b       TEXT NOT NULL,
    created INTEGER NOT NULL,
    PRIMARY KEY (a, b)
  );

  CREATE TABLE IF NOT EXISTS records (
    name TEXT NOT NULL,
    qid  TEXT NOT NULL,
    c    TEXT NOT NULL,
    ok   INTEGER,
    ts   INTEGER NOT NULL,
    PRIMARY KEY (name, qid)
  );

  CREATE TABLE IF NOT EXISTS stars (
    name TEXT NOT NULL,
    qid  TEXT NOT NULL,
    ts   INTEGER NOT NULL,
    PRIMARY KEY (name, qid)
  );

  CREATE TABLE IF NOT EXISTS notes (
    name TEXT NOT NULL,
    qid  TEXT NOT NULL,
    text TEXT NOT NULL,
    ts   INTEGER NOT NULL,
    PRIMARY KEY (name, qid)
  );

  CREATE TABLE IF NOT EXISTS chapters (
    name    TEXT NOT NULL,
    bank    TEXT NOT NULL,
    chapter TEXT NOT NULL,
    pos     INTEGER NOT NULL DEFAULT 0,
    done    INTEGER NOT NULL DEFAULT 0,
    acc     INTEGER NOT NULL DEFAULT 0,
    last_ts INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (name, bank, chapter)
  );
`);

/* ---------- 密码散列（scrypt：Node 自带的标准算法） ---------- */

function makeSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPass(pass, salt) {
  return crypto.scryptSync(String(pass), salt, 64).toString('hex');
}

/* 登录校验：用 timingSafeEqual 做恒定时间比较，
   避免根据比较耗时推测密码（一个小的但标准的细节） */
function checkPass(pass, salt, hash) {
  try {
    const a = Buffer.from(hashPass(pass, salt), 'hex');
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

/* ---------- 头像：新账号自动按用户名分配一个固定的底色 ---------- */

const AVATAR_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

function hash32(str) {
  let h = 5381;
  str = String(str);
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
}

function defaultAvatar(name) {
  return { type: 'color', c: AVATAR_COLORS[hash32(name) % AVATAR_COLORS.length] };
}

/* ---------- 用户 ---------- */

function getUser(name) {
  return db.prepare('SELECT * FROM users WHERE name = ?').get(name) || null;
}

/* 好友列表（连同昵称、头像），个人主页和排行榜都直接用 */
function friendsInfo(name) {
  return db
    .prepare(`SELECT u.name, u.nick, u.avatar
                FROM friends f JOIN users u ON u.name = f.b
               WHERE f.a = ? ORDER BY f.created`)
    .all(name)
    .map((r) => ({ name: r.name, nick: r.nick, avatar: JSON.parse(r.avatar) }));
}

/* 给前端的公开用户信息（不含盐和散列——这两个永远不出服务器） */
function userPublic(name) {
  const row = getUser(name);
  if (!row) return null;
  return {
    name: row.name,
    nick: row.nick,
    avatar: JSON.parse(row.avatar),
    sig: row.sig,
    created: row.created,
    friends: friendsInfo(name),
  };
}

function createUser(name, pass, nick) {
  const salt = makeSalt();
  db.prepare('INSERT INTO users (name, nick, salt, hash, avatar, sig, created) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    name, nick, salt, hashPass(pass, salt), JSON.stringify(defaultAvatar(name)), '', Date.now()
  );
  return userPublic(name);
}

/* 局部更新资料：只改传进来的字段（昵称 / 签名 / 头像） */
function updateUser(name, patch) {
  const row = getUser(name);
  if (!row) return null;
  const nick = patch.nick != null ? String(patch.nick).trim().slice(0, 12) || name : row.nick;
  const sig = patch.sig != null ? String(patch.sig).slice(0, 60) : row.sig;
  const avatar = patch.avatar != null ? JSON.stringify(patch.avatar) : row.avatar;
  db.prepare('UPDATE users SET nick = ?, sig = ?, avatar = ? WHERE name = ?').run(nick, sig, avatar, name);
  return userPublic(name);
}

/* 登录时校验用户名 + 密码，成功返回公开用户信息，失败返回 null */
function verifyLogin(name, pass) {
  const row = getUser(name);
  if (!row) return null;
  if (!checkPass(pass, row.salt, row.hash)) return null;
  return userPublic(name);
}

/* ---------- 会话（token） ---------- */

function createSession(name) {
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessions (token, name, created) VALUES (?, ?, ?)').run(token, name, Date.now());
  return token;
}

function sessionUser(token) {
  if (!token) return null;
  const row = db.prepare('SELECT name FROM sessions WHERE token = ?').get(token);
  return row ? userPublic(row.name) : null;
}

function deleteSession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

/* ---------- 好友（双向各存一行，查询简单） ---------- */

function addFriend(a, b) {
  const now = Date.now();
  db.prepare('INSERT OR IGNORE INTO friends (a, b, created) VALUES (?, ?, ?)').run(a, b, now);
  db.prepare('INSERT OR IGNORE INTO friends (a, b, created) VALUES (?, ?, ?)').run(b, a, now);
}

function removeFriend(a, b) {
  db.prepare('DELETE FROM friends WHERE (a = ? AND b = ?) OR (a = ? AND b = ?)').run(a, b, b, a);
}

/* ---------- 一次性取某个用户的全部学习数据（页面打开时拉一次） ---------- */

function getMyData(name) {
  const records = {};
  db.prepare('SELECT qid, c, ok FROM records WHERE name = ?').all(name).forEach((r) => {
    const o = { c: JSON.parse(r.c) };
    if (r.ok !== null) o.ok = r.ok === 1; // 有 ok 才是已提交；没有就是草稿
    records[r.qid] = o;
  });

  const stars = {};
  db.prepare('SELECT qid, ts FROM stars WHERE name = ?').all(name).forEach((r) => { stars[r.qid] = r.ts; });

  const notes = {};
  db.prepare('SELECT qid, text FROM notes WHERE name = ?').all(name).forEach((r) => { notes[r.qid] = r.text; });

  const chapters = {};
  db.prepare('SELECT bank, chapter, pos, done, acc, last_ts FROM chapters WHERE name = ?').all(name).forEach((r) => {
    chapters[r.bank + '/' + r.chapter] = { pos: r.pos, done: r.done === 1, acc: r.acc, lastTs: r.last_ts };
  });

  return { records, stars, notes, chapters };
}

/* ---------- 保存一批章节改动（答题 / 草稿 / 删除 / 断点 / 交卷） ----------
 * changes 里每一项要么是 { qid, c:['A'], ok:true|false|null }（新增/覆盖记录），
 * 要么是 { qid, remove:true }（删除记录，重做错题时用）。
 * 顺带把「累计用时 acc」按和前端一致的规则算好：
 *   距上次保存 10 分钟以内 → 把这小段间隔累加进 acc；间隔太大（挂机）只重新计时。 */
function syncChapter(name, bank, chapter, pos, done, changes) {
  const now = Date.now();

  let row = db.prepare('SELECT pos, done, acc, last_ts FROM chapters WHERE name = ? AND bank = ? AND chapter = ?')
    .get(name, bank, chapter);
  if (!row) {
    db.prepare('INSERT INTO chapters (name, bank, chapter, pos, done, acc, last_ts) VALUES (?, ?, ?, 0, 0, 0, 0)')
      .run(name, bank, chapter);
    row = { pos: 0, done: 0, acc: 0, last_ts: 0 };
  }

  let acc = row.acc;
  if (row.last_ts && now - row.last_ts > 0 && now - row.last_ts < SESSION_GAP_MS) {
    acc += now - row.last_ts;
  }

  for (const ch of changes) {
    if (ch.remove) {
      db.prepare('DELETE FROM records WHERE name = ? AND qid = ?').run(name, ch.qid);
    } else {
      // ON CONFLICT DO UPDATE：同一题再答一次就覆盖旧记录（和前端行为一致）
      db.prepare(`INSERT INTO records (name, qid, c, ok, ts) VALUES (?, ?, ?, ?, ?)
                  ON CONFLICT(name, qid) DO UPDATE SET c = excluded.c, ok = excluded.ok, ts = excluded.ts`)
        .run(name, ch.qid, JSON.stringify(ch.c), ch.ok == null ? null : (ch.ok ? 1 : 0), now);
    }
  }

  const newPos = typeof pos === 'number' ? pos : row.pos;
  const newDone = typeof done === 'boolean' ? (done ? 1 : 0) : row.done;
  db.prepare('UPDATE chapters SET pos = ?, done = ?, acc = ?, last_ts = ? WHERE name = ? AND bank = ? AND chapter = ?')
    .run(newPos, newDone, acc, now, name, bank, chapter);

  return { acc, pos: newPos, done: newDone === 1 };
}

/* ---------- 收藏 / 笔记 / 重置章节 ---------- */

function toggleStar(name, qid, on) {
  if (on) {
    db.prepare('INSERT OR REPLACE INTO stars (name, qid, ts) VALUES (?, ?, ?)').run(name, qid, Date.now());
  } else {
    db.prepare('DELETE FROM stars WHERE name = ? AND qid = ?').run(name, qid);
  }
}

function setNote(name, qid, text) {
  if (text && text.trim()) {
    db.prepare(`INSERT INTO notes (name, qid, text, ts) VALUES (?, ?, ?, ?)
                ON CONFLICT(name, qid) DO UPDATE SET text = excluded.text, ts = excluded.ts`)
      .run(name, qid, String(text), Date.now());
  } else {
    db.prepare('DELETE FROM notes WHERE name = ? AND qid = ?').run(name, qid);
  }
}

function resetChapter(name, bank, chapter) {
  // 题号格式是 <题库>-<章号>-<题号>，所以本章题目的前缀是 "web-1-"
  db.prepare("DELETE FROM records WHERE name = ? AND qid LIKE ? || '-%'").run(name, bank + '-' + chapter.split('-')[1]);
  db.prepare('DELETE FROM chapters WHERE name = ? AND bank = ? AND chapter = ?').run(name, bank, chapter);
}

/* ---------- 导入游客数据（登录后把本机游客的进度搬进账号） ----------
 * 规则和纯静态版一致：目标账号已有的题不覆盖，只补缺失的。 */
function importData(name, payload) {
  let moved = 0;
  const now = Date.now();

  const insRec = db.prepare('INSERT OR IGNORE INTO records (name, qid, c, ok, ts) VALUES (?, ?, ?, ?, ?)');
  Object.keys(payload.records || {}).forEach((qid) => {
    const rec = payload.records[qid];
    if (!rec || !Array.isArray(rec.c)) return;
    const info = insRec.run(name, qid, JSON.stringify(rec.c), rec.ok == null ? null : (rec.ok ? 1 : 0), now);
    if (info.changes > 0) moved++;
  });

  const insStar = db.prepare('INSERT OR IGNORE INTO stars (name, qid, ts) VALUES (?, ?, ?)');
  Object.keys(payload.stars || {}).forEach((qid) => {
    if (insStar.run(name, qid, now).changes > 0) moved++;
  });

  const insNote = db.prepare('INSERT OR IGNORE INTO notes (name, qid, text, ts) VALUES (?, ?, ?, ?)');
  Object.keys(payload.notes || {}).forEach((qid) => {
    const text = payload.notes[qid];
    if (typeof text !== 'string' || !text.trim()) return;
    if (insNote.run(name, qid, text, now).changes > 0) moved++;
  });

  const insChap = db.prepare('INSERT OR IGNORE INTO chapters (name, bank, chapter, pos, done, acc, last_ts) VALUES (?, ?, ?, ?, ?, ?, 0)');
  Object.keys(payload.chapters || {}).forEach((key) => {
    const parts = String(key).split('/'); // "web/web-1"
    const info = payload.chapters[key];
    if (parts.length !== 2 || !info) return;
    const r = insChap.run(name, parts[0], parts[1], info.pos | 0, info.done ? 1 : 0, info.acc | 0);
    if (r.changes > 0) moved++;
  });

  return moved;
}

/* ---------- 战绩汇总（个人主页用） ---------- */

function myStats(name) {
  const totals = db.prepare(
    'SELECT COUNT(*) AS answered, COALESCE(SUM(ok), 0) AS correct FROM records WHERE name = ? AND ok IS NOT NULL'
  ).get(name);
  const chTotals = db.prepare(
    'SELECT COALESCE(SUM(acc), 0) AS elapsed, COALESCE(SUM(done), 0) AS chaptersDone FROM chapters WHERE name = ?'
  ).get(name);
  const starCount = db.prepare('SELECT COUNT(*) AS n FROM stars WHERE name = ?').get(name).n;
  const noteCount = db.prepare('SELECT COUNT(*) AS n FROM notes WHERE name = ?').get(name).n;

  // 按题库拆分（题号 "web-12-3" 里第一段就是题库名，用 SQL 的 substr/instr 取出来）
  const byBank = {};
  function bankEntry(b) {
    return byBank[b] || (byBank[b] = { answered: 0, correct: 0, wrong: 0, rate: 0, elapsed: 0, chaptersDone: 0, stars: 0, notes: 0 });
  }
  db.prepare(`SELECT substr(qid, 1, instr(qid, '-') - 1) AS bank, COUNT(*) AS answered, COALESCE(SUM(ok), 0) AS correct
                FROM records WHERE name = ? AND ok IS NOT NULL GROUP BY bank`).all(name).forEach((r) => {
    const e = bankEntry(r.bank); e.answered = r.answered; e.correct = r.correct;
  });
  db.prepare(`SELECT bank, COALESCE(SUM(acc), 0) AS elapsed, COALESCE(SUM(done), 0) AS chaptersDone
                FROM chapters WHERE name = ? GROUP BY bank`).all(name).forEach((r) => {
    const e = bankEntry(r.bank); e.elapsed = r.elapsed; e.chaptersDone = r.chaptersDone;
  });
  db.prepare(`SELECT substr(qid, 1, instr(qid, '-') - 1) AS bank, COUNT(*) AS n FROM stars WHERE name = ? GROUP BY bank`)
    .all(name).forEach((r) => { bankEntry(r.bank).stars = r.n; });
  db.prepare(`SELECT substr(qid, 1, instr(qid, '-') - 1) AS bank, COUNT(*) AS n FROM notes WHERE name = ? GROUP BY bank`)
    .all(name).forEach((r) => { bankEntry(r.bank).notes = r.n; });
  Object.keys(byBank).forEach((b) => {
    const e = byBank[b];
    e.wrong = e.answered - e.correct;
    e.rate = e.answered ? Math.round((e.correct / e.answered) * 100) : 0;
  });

  const answered = totals.answered || 0;
  const correct = totals.correct || 0;
  return {
    answered, correct, wrong: answered - correct,
    rate: answered ? Math.round((correct / answered) * 100) : 0,
    elapsed: chTotals.elapsed || 0,
    chaptersDone: chTotals.chaptersDone || 0,
    stars: starCount,
    notes: noteCount,
    byBank,
  };
}

/* ---------- 排行榜（全体账号的战绩，一次查出来给前端排序） ---------- */

function leaderboard() {
  const rows = db.prepare(`
    SELECT u.name, u.nick, u.avatar,
      (SELECT COUNT(*) FROM records r WHERE r.name = u.name AND r.ok IS NOT NULL) AS answered,
      (SELECT COALESCE(SUM(r.ok), 0) FROM records r WHERE r.name = u.name) AS correct,
      (SELECT COALESCE(SUM(c.acc), 0) FROM chapters c WHERE c.name = u.name) AS elapsed,
      (SELECT COALESCE(SUM(c.done), 0) FROM chapters c WHERE c.name = u.name) AS chaptersDone,
      (SELECT COUNT(*) FROM stars s WHERE s.name = u.name) AS stars,
      (SELECT COUNT(*) FROM notes n WHERE n.name = u.name) AS notes
    FROM users u
  `).all();
  return rows.map((r) => ({
    name: r.name,
    nick: r.nick,
    avatar: JSON.parse(r.avatar),
    answered: r.answered,
    correct: r.correct,
    rate: r.answered ? Math.round((r.correct / r.answered) * 100) : 0,
    elapsed: r.elapsed,
    chaptersDone: r.chaptersDone,
    stars: r.stars,
    notes: r.notes,
  }));
}

/* ---------- 首页小统计 / 清空我的数据 ---------- */

function overview() {
  return { users: db.prepare('SELECT COUNT(*) AS n FROM users').get().n };
}

/* 清空某个用户的全部学习数据（账号本身保留） */
function clearMyData(name) {
  db.prepare('DELETE FROM records WHERE name = ?').run(name);
  db.prepare('DELETE FROM stars WHERE name = ?').run(name);
  db.prepare('DELETE FROM notes WHERE name = ?').run(name);
  db.prepare('DELETE FROM chapters WHERE name = ?').run(name);
}

module.exports = {
  DB_PATH,
  getUser,
  userPublic,
  createUser,
  updateUser,
  verifyLogin,
  createSession,
  sessionUser,
  deleteSession,
  addFriend,
  removeFriend,
  getMyData,
  syncChapter,
  toggleStar,
  setNote,
  resetChapter,
  importData,
  myStats,
  leaderboard,
  overview,
  clearMyData,
};
