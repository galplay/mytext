# 在线刷题 · 后端版

「在线刷题」的**服务器形态**：页面与纯静态版完全相同，但账号、作答记录、收藏、笔记、
好友、排行榜、PK 全部保存在服务器上的 SQLite 数据库里——**换台电脑、换个浏览器登录同一
账号，就能接着刷**。不登录的游客依旧可用（数据存本机浏览器，和静态版一致）。

> 纯静态版（双击 `index.html` 即可打开的那个）仍在原目录，是本考核的主交付；
> 本文件夹是额外做的「后端 + 数据库」进阶形态，代码全部自己实现、零第三方依赖。

---

## 一、运行方式

**依赖**：Node.js 22.13 或以上（用到内置的 `node:sqlite` 模块，本机 Node 24.16 验证通过）。
**不需要 `npm install`**——没有用任何第三方包，只用到 Node 自带的 `http` / `sqlite` / `crypto`。

```bash
# 在项目根目录（本文件夹）执行：
node server/server.js
# 或
npm start

# 然后浏览器打开：
http://localhost:3000
```

- 换成其他端口：`PORT=8080 node server/server.js`（Windows PowerShell 用 `$env:PORT=8080; node server/server.js`）
- 数据库文件 `server/data.db` **首次启动时自动创建**（建表语句是 `IF NOT EXISTS`，不会清数据）
- **Linux 部署**：把整个文件夹拷过去，在项目根目录 `node server/server.js` 即可；
  想常驻可以用 `nohup node server/server.js &` 或配 systemd。放行端口后访问 `http://服务器IP:端口`
- 直接双击 `index.html`（file:// 方式）时只有游客模式，页面顶部会自动提示去跑服务器——
  这是预期行为，不是报错

---

## 二、和静态版的区别：一个前端，两种数据源

页面代码（`js/quiz.js`、`js/home.js`…）完全不知道自己工作在哪种模式，
全部数据读写都走 `js/store.js` 这一层"数据门面"：

| | 游客（未登录） | 登录用户 |
|---|---|---|
| 数据存哪 | 本机浏览器 localStorage | 服务器 SQLite（本机内存留一份镜像） |
| 键名示例 | `quiz.u.guest.progress.web.web-3` | 服务器 `records` / `chapters` 表 |
| 换电脑 | 数据不跟随 | 登录后自动恢复 |

注册或登录时，如果本机存有游客数据，会弹窗询问**是否一键导入账号**——
导入成功后本机游客数据清空，之后都走服务器。

### 增量同步（答辩重点）

作答时不可能每次把整章传上去。`js/store.js` 里为每一章留了一份"快照"
（题号 → 这条作答的标准串），保存时逐题对比：

- 新题出现 / 内容变了 → 收进 `changes` 发出去；
- 题被删了（重做错题）→ 发 `{ qid, remove: true }`；
- 全部没变 → 一个请求都不发。

先按本地规则把界面和快照**乐观更新**，请求失败就把快照**回滚**，下次保存会重发一遍，
不会丢数据。服务器返回它算好的累计用时 `acc` 后，再用服务器的值覆盖本地。

**累计用时规则（前后端一致）**：距上次保存 10 分钟以内的间隔才计入 `acc`，
超过视为挂机只重新计时——所以排行榜上的"用时"是真实作答时间。

---

## 三、数据库（server/db.js，7 张表）

| 表 | 存什么 |
|---|---|
| `users` | 账号：用户名、昵称、盐、密码散列、头像(JSON)、签名、注册时间 |
| `sessions` | 登录会话：token → 用户名（浏览器存 token，服务器凭它认人） |
| `friends` | 好友关系（双向各存一行） |
| `records` | 逐题作答：草稿(ok=NULL) / 答对(ok=1) / 答错(ok=0) |
| `stars` | 题目收藏 |
| `notes` | 题目笔记 |
| `chapters` | 每章进度：断点 `pos`、交卷 `done`、累计用时 `acc`、上次保存时间 `last_ts` |

## 四、接口一览（server/server.js，共 16 条）

| 方法 路径 | 作用 |
|---|---|
| `POST /api/register` | 注册 `{name, pass, nick?}` → `{token, user}` |
| `POST /api/login` | 登录同名参数，返回新 token |
| `POST /api/logout` | 注销当前 token |
| `GET /api/me` | 当前用户信息 + 战绩汇总 |
| `GET /api/my-data` | 一次性拉全部学习数据（记录/收藏/笔记/章节） |
| `POST /api/sync` | 保存一章的增量改动 `{bank, chapter, pos?, done?, changes[]}` |
| `POST /api/star` | 收藏 / 取消收藏 `{qid, on}` |
| `POST /api/note` | 保存单题笔记 `{qid, text}` |
| `POST /api/reset-chapter` | 清空一章作答（收藏笔记保留） |
| `POST /api/import` | 游客数据一次性导入 |
| `POST /api/profile` | 改昵称 / 签名 / 头像 |
| `POST /api/friend/add` `remove` | 加 / 删好友 `{name}` |
| `GET /api/leaderboard` | 全站排行榜数据 |
| `GET /api/stats` | 注册人数（首页展示） |
| `POST /api/clear-my-data` | 清空自己的全部学习数据 |

认证方式：请求头 `Authorization: Bearer <token>`；未登录访问受保护接口统一返回
`401 {error:'请先登录'}`，前端收到 401 会自动退回游客身份并提示重新登录。

## 五、安全做法（答辩常问）

1. **密码不存明文**：用 Node 自带的 `crypto.scrypt` 加盐散列，库里只存「盐 + 散列值」，
   即使 `data.db` 文件被人拿走也看不到原密码；比对用 `timingSafeEqual` 防时序侧信道。
2. **防 SQL 注入**：所有 SQL 都用 `?` 占位符参数化查询，绝不把用户输入拼进 SQL 字符串。
3. **会话**：登录成功发一个 `crypto.randomBytes` 生成的随机 token 存进 `sessions` 表，
   注销即删；token 猜不出来。
4. **静态文件服务**：只放行网站自己的页面 / 脚本 / 样式；`/server`、`*.md`、`package.json`、
   `data.db` 一律 404（按 `toLowerCase()` 判断，堵上 Windows 大小写不敏感的绕过），
   并用 `path.relative` 校验最终路径仍在站点目录内，防目录穿越。
5. **输入校验**：用户名 / 题号 / 章节号 / 数据条数都有正则或上限校验，异常数据直接 400。

## 六、如果再给 1 小时，最想完善什么

- **会话过期与"记住我"**：现在 token 长期有效，想加有效期与续期；
- **排行榜分页**：账号多了以后 `GET /api/leaderboard` 全量返回会变重；
- **每天自动备份 `data.db`**：一条定时任务的事，但数据安全最有价值；
- **给接口补一套自动化测试**：目前是浏览器里手工全流程验证的。
