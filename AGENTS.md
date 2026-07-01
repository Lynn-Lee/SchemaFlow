# ChartDB 重构项目规则

## 项目身份

- 本项目是 Lynn 个人仓库中的 ChartDB 重构项目。
- 唯一远端仓库是 `origin = https://github.com/Lynn-Lee/ChartDB.git`。
- 不再维护其它远端关系；如果发现除 `origin` 以外的 git remote，先停止并向用户确认。
- 后续重构在当前代码基础上渐进式演进，不做推倒重写。

## 沟通与文档

- 默认使用中文沟通和编写文档，专业术语如 React、Vite、TypeScript、Dexie、IndexedDB、SQL、DBML、Monaco 可以保留英文。
- 新增项目文档必须使用中文文件名和中文正文。
- 重构相关文档统一维护在 `docs/` 下。
- 当前核心文档：
  - `docs/ChartDB重构优化产品设计与研发计划.md`
  - `docs/ChartDB重构优化工程实施计划.md`
  - `docs/ChartDB自动开发任务计划.md`
  - `docs/阶段验收记录.md`

## 范围边界

- Phase 0 到 Phase 7 不实现账号登录、用户注册、云端 diagram 存储、团队 Workspace、实时协作、在线评论、权限模型、计费、企业 SSO 或生产数据库直连。
- Phase 8 只允许做可选 Cloud/Team 的预研文档和接口边界，不允许直接新增登录代码。
- 首轮重构重点是安全、测试、架构边界、导入导出可靠性、本地体验和发布治理。
- 默认保持 OSS Core 本地优先：不需要账号、不需要数据库密码、schema 默认只在浏览器本地存储。

## 阶段顺序

必须按以下顺序推进：

1. Phase 0：基线修复。
2. Phase 1：安全重构。
3. Phase 2：Schema Core 与 Command 架构。
4. Phase 3：Storage 与备份恢复。
5. Phase 4：Importer / Exporter 插件化。
6. Phase 5：产品体验与可访问性。
7. Phase 6：性能优化。
8. Phase 7：发布治理与文档。
9. Phase 8：可选 Cloud/Team 预研。

Phase 0 和 Phase 1 是硬前置。测试失败、安全 high 风险和 API key 暴露未解决前，不进入大规模架构改造。

## 当前任务队列

- 当前已完成：`CHARTDB-P0-001` 修复测试环境 `localStorage.getItem` 失败。
- 下一项默认任务：`CHARTDB-P0-002` 升级 critical/high 生产依赖并记录剩余 advisory。
- 自动任务和人工执行都必须以 `docs/ChartDB自动开发任务计划.md` 为任务队列来源。
- 每轮最多处理一个最小功能切片，不跨 Phase。

## 开发流程

- 涉及行为变化、bug fix、架构抽取时必须先写或更新测试，确认红灯，再实现，再确认绿灯。
- 代码变更必须贴合现有 ChartDB 架构和项目文档，不做无关重构、依赖 churn 或大范围格式化。
- 手工编辑文件优先使用 `apply_patch`。
- 不要覆盖用户未提交改动。若主工作区有非本轮产生的未提交源码或文档改动，先停止并说明。
- `.codex-audit/` 是本地审计临时产物，不纳入提交；如果它是唯一未跟踪项，不阻止继续开发。

## 验证门禁

普通代码任务合并前必须通过：

```bash
npm run lint
npm run test:ci
npm run build
git diff --check
```

涉及安全依赖、AI key、Docker、Nginx、Markdown 渲染或发布 workflow 的任务额外执行：

```bash
npm audit --omit=dev --audit-level=high
rg -n "VITE_OPENAI_API_KEY|OPENAI_API_KEY|window\\.env|rehype-raw|dangerouslySetInnerHTML" src Dockerfile default.conf.template .github
```

UI 任务需要做桌面和移动视口 smoke，确认关键元素可见、无明显横向溢出、无严重 console error。

## Git 规则

- 功能开发使用 `codex/` 前缀分支。
- 每个任务切片完成后提交任务分支，commit message 使用 `feat:`、`fix:`、`test:`、`docs:`、`chore:` 等标准前缀。
- 合并回本地 `main` 后必须再次运行快速验证。
- 快速验证通过后必须推送：

```bash
git push origin main
```

- push 后确认 `origin/main` 指向本轮 `main` 提交。
- 默认不开 PR、不部署。只有用户明确要求发布时，才允许部署。

## 自动任务

- Codex automation ID：`chartdb-roadmap-dispatcher`。
- 自动任务每轮必须：
  - 检查并发锁。
  - 读取核心文档和仓库状态。
  - 选择一个最小任务切片。
  - 执行 TDD。
  - 更新相关中文文档和 `docs/阶段验收记录.md`。
  - 通过验证门禁。
  - 提交、合并到 `main`、推送到 `origin/main`。
  - 写运行日志到 `/Users/lynn/.codex/automations/chartdb-roadmap/runs`。
  - 维护 `/Users/lynn/.codex/automations/chartdb-roadmap/memory.md`。

## 安全规则

- 前端不得持久化 AI API key。
- 不得把构建期密钥写入 bundle 或 `/config.js`。
- AI 能力默认关闭，用户明确启用前不发送 schema 内容。
- Note Markdown 不允许 raw HTML 执行。
- 高风险 schema 变更、SQL export、AI-assisted export 必须有 warning 或 risk 标记。

