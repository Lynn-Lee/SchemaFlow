# ChartDB 重构优化工程实施计划

> **给后续执行 agent 的要求：** 实施本文任务时，应按阶段逐项推进；每个 Phase 开始前先创建独立分支，每个 Task 完成后运行指定检查，并提交小粒度 commit。进入具体编码前，建议使用 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans` 按任务执行。

**目标：** 按《ChartDB 重构优化产品设计与研发计划》把当前 ChartDB 从可用的纯前端开源工具，逐步升级为安全、可维护、可扩展、可自托管的本地优先数据库 schema 工作台。

**重构仓库：** `https://github.com/Lynn-Lee/ChartDB`。后续研发只以该个人仓库作为唯一远端，不再维护其它远端关系。

**架构：** 先修复安全和测试基线，再拆出 `schema-core`、`storage`、`dialects`、`features`、`workers` 等边界。首轮不引入账号登录和云协作，只为可选 Cloud/Team 模式预留数据模型和接口边界。

**Tech Stack：** React 18、Vite、TypeScript、Dexie、React Router、Radix UI、XYFlow、Monaco Editor、Vitest、Testing Library、Docker、Nginx、GitHub Actions。

---

## 1. 执行原则

### 1.1 阶段顺序

工程执行必须按以下顺序推进：

1. Phase 0：基线修复。
2. Phase 1：安全重构。
3. Phase 2：Schema Core 与 Command 架构。
4. Phase 3：Storage 与备份恢复。
5. Phase 4：Importer / Exporter 插件化。
6. Phase 5：产品体验与可访问性。
7. Phase 6：性能优化。
8. Phase 7：发布治理与文档。
9. Phase 8：可选 Cloud/Team 规划。

Phase 0 和 Phase 1 是硬前置。Phase 0 已完成测试、构建、生产依赖 high audit 和 CI gate 验收；API key 暴露、Markdown raw HTML 和 remaining advisory 未完成 Phase 1 安全审查前，不进入大规模架构改造。

### 1.2 分支策略

建议分支：

```bash
git switch -c codex/chartdb-phase-0-baseline
git switch -c codex/chartdb-phase-1-security
git switch -c codex/chartdb-phase-2-schema-core
git switch -c codex/chartdb-phase-3-storage
git switch -c codex/chartdb-phase-4-dialects
git switch -c codex/chartdb-phase-5-ux-a11y
git switch -c codex/chartdb-phase-6-performance
git switch -c codex/chartdb-phase-7-release-docs
```

每个 Phase 可以单独 PR。不要把多个 Phase 混在一个 PR 内。

### 1.3 Commit 粒度

每个 commit 只做一类事情：

- 测试修复。
- 依赖升级。
- 安全修复。
- 架构抽取。
- 单个 feature flow 改造。
- 文档更新。

推荐 commit 前检查：

```bash
npm run lint
npm run test:ci
npm run build
```

如果某个 Phase 暂时不能跑完整检查，必须在 commit 或 PR 描述中写明原因和替代验证。

### 1.4 不做范围

Phase 0 到 Phase 7 不实现：

- 用户注册。
- 用户登录。
- 云端 diagram 存储。
- 团队 Workspace。
- 多人实时协作。
- 在线评论。
- 复杂权限模型。
- 计费。
- 企业 SSO。
- 生产数据库直连。

这些能力只在 Phase 8 做架构预留和独立规划。

## 2. 当前基线

### 2.1 已知本地状态

仓库当前评估基线：

- 分支：`main`。
- 重构远端：`origin` 指向 `https://github.com/Lynn-Lee/ChartDB.git`。
- 最新本地 commit：`c24936a feat: add move-to-area and auto-arrange-area context menu options (#1120)`。
- 方案文档：`docs/ChartDB重构优化产品设计与研发计划.md`。

### 2.2 已知验证结果

当前基线验证记录：

```bash
npm run build
```

预期：当前可通过，但会出现 chunk 过大警告。

```bash
npm run test:ci
```

当前结果：Phase 0 已修复该失败并通过完整 `npm run test:ci`。

原始失败点：

```text
TypeError: localStorage.getItem is not a function
src/lib/utils/utils.ts:18
```

```bash
npm audit --omit=dev
```

当前结果：`CHARTDB-P0-002` 已将生产依赖 high/critical advisory 清零；仍有 AI SDK 链 low 风险和 `monaco-editor` / `dompurify` moderate 风险，破坏性修复转入 Phase 1 安全评估。

### 2.3 当前关键风险文件

- `Dockerfile`：构建期写入 `VITE_OPENAI_API_KEY`。
- `default.conf.template`：`/config.js` 暴露 `OPENAI_API_KEY`。
- `src/lib/env.ts`：前端读取 `window.env` 和 `import.meta.env`。
- `src/lib/data/sql-export/export-sql-script.ts`：浏览器内直接调用 AI SDK。
- `src/pages/editor-page/canvas/note-node/note-node.tsx`：使用 `rehype-raw` 渲染 note。
- `src/context/chartdb-context/chartdb-provider.tsx`：状态、业务命令、持久化高度耦合。
- `src/context/storage-context/storage-provider.tsx`：Dexie schema、migration、CRUD 混在 Provider。
- `src/lib/data/sql-import/dialect-importers/postgresql/postgresql.ts`：方言 importer 文件过大。
- `src/pages/editor-page/canvas/canvas.tsx`：画布职责过重。
- `.github/workflows/ci.yaml`：只在 PR 跑常规检查，缺少 audit gate。
- `.github/workflows/publish.yaml`：发布流程缺少 test 和 Docker smoke gate。

## 3. 目标文件结构

### 3.1 最终目录结构

目标结构：

```text
src/
  app/
    router/
    providers/
  features/
    onboarding/
    diagrams/
    import/
    export/
    editor/
    templates/
    settings/
  schema-core/
    model/
    commands/
    validation/
    diff/
  dialects/
    postgresql/
    mysql/
    mariadb/
    sqlserver/
    sqlite/
    oracle/
    clickhouse/
    dbml/
  storage/
    db/
    repositories/
    migrations/
    backup/
    health/
  ai/
    client/
    gateway-contract/
    prompts/
  ui/
    components/
    dialogs/
    accessibility/
  workers/
    import-worker/
    layout-worker/
    export-worker/
```

### 3.2 分层职责

`schema-core`

- 定义纯领域模型。
- 定义 command。
- 定义 validator。
- 定义 diff。
- 不依赖 React、Dexie、Monaco、浏览器 UI。

`storage`

- 封装 Dexie。
- 管理 migration。
- 管理 backup/restore。
- 提供 transaction API。
- 不依赖 React component。

`dialects`

- 承载 SQL/DBML import/export。
- 每个数据库方言独立目录。
- 每个方言输出 capability matrix。

`features`

- 编排页面级流程。
- 组合领域、存储、UI 和 worker。

`ui`

- 通用组件。
- 设计系统。
- 可访问性 helper。

`workers`

- 大 schema import。
- 自动布局。
- 大文件 export。

`ai`

- 前端 AI client。
- Gateway contract。
- Prompt builder。
- 不保存服务端 secret。

## 4. Phase 0：基线修复

**目标：** 让仓库具备可信测试、安全审计和 CI 基线。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-0-baseline
```

### Task 0.1：修复测试环境中的 localStorage 失败

**涉及文件：**

- 修改：`src/test/setup.ts`
- 修改或新增测试：`src/lib/utils/__tests__/utils-storage.test.ts`
- 参考：`src/lib/utils/utils.ts`
- 参考：`vitest.config.ts`

**实施步骤：**

- [ ] 运行当前失败测试确认问题。

```bash
npm run test:ci
```

预期：失败信息包含 `localStorage.getItem is not a function`。

- [ ] 在 `src/test/setup.ts` 中增加稳定的 storage reset 逻辑，确保每个测试后 localStorage/sessionStorage 可用且被清空。

建议实现方向：

```ts
import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
});

afterEach(() => {
    cleanup();
    window.localStorage.clear();
    window.sessionStorage.clear();
});
```

- [ ] 增加 `getWorkspaceId` 和 `generateDiagramId` 的测试，确保本地 storage 正常时能生成稳定前缀。

建议测试点：

- 第一次调用生成 workspace id。
- 第二次调用复用同一个 workspace id。
- `generateDiagramId()` 包含 workspace id 前缀。

- [ ] 运行聚焦测试。

```bash
npm run test:ci -- src/lib/utils/__tests__/utils-storage.test.ts
```

预期：新增测试通过。

- [ ] 运行完整测试。

```bash
npm run test:ci
```

预期：完整测试通过。

### Task 0.2：升级高危依赖并锁定安全基线

**涉及文件：**

- 修改：`package.json`
- 修改：`package-lock.json`
- 参考：`.github/dependabot.yml`，如果不存在则新增

**实施步骤：**

- [x] 查看当前安全风险。

```bash
npm audit --omit=dev
```

预期：输出当前生产依赖 advisory。

- [x] 优先升级 patch/minor 可修复项。

建议优先处理：

- `react-router-dom` / `react-router`。
- `react-use` / `js-cookie`。
- `vite`。
- `vitest`。
- `happy-dom`。
- `postcss`。
- `lodash` / `lodash-es`。
- `ai` / `@ai-sdk/openai`。

- [x] 评估 semver major 升级是否需要单独任务。

```bash
npm install react-router-dom@latest
npm run test:ci
npm run build
```

结果：本轮没有执行 semver major 生产依赖升级，避免引入 `ai`、`@ai-sdk/openai` 或 `monaco-editor` 破坏性迁移。

- [ ] 加入 Dependabot 配置。

建议文件：`.github/dependabot.yml`

建议配置：

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      security-patches:
        applies-to: security-updates
        patterns:
          - "*"
```

- [x] 验证生产依赖安全基线。

```bash
npm audit --omit=dev
```

预期：无 high 或 critical；若有不可升级项，必须在 `docs/安全风险登记.md` 记录原因。

当前结果：`npm audit --omit=dev --audit-level=high` 通过；剩余 low/moderate advisory 记录在 `docs/阶段验收记录.md`。

### Task 0.3：补充 CI 安全门禁

**涉及文件：**

- 修改：`.github/workflows/ci.yaml`
- 新增：`docs/安全风险登记.md`

**实施步骤：**

- [x] 在 CI 中增加 audit 步骤。

建议插入到 install 后：

```yaml
- name: Audit production dependencies
  run: npm audit --omit=dev --audit-level=high
```

- [x] 保持原有 lint、build、test 顺序。

CI 目标顺序：

1. checkout。
2. setup node。
3. npm ci。
4. npm audit。
5. lint。
6. build。
7. test。

- [ ] 新增 `docs/安全风险登记.md`，记录暂时无法修复的 advisory、影响范围和处置计划。该项转入后续安全文档任务，不阻塞 `CHARTDB-P0-003` 的 CI gate 验收。

风险登记字段：

- 风险名称。
- 依赖包。
- 影响范围。
- 当前缓解措施。
- 计划修复版本。
- 负责人角色。

- [ ] 本地运行。

```bash
npm run lint
npm run build
npm run test:ci
npm audit --omit=dev --audit-level=high
```

预期：全部通过。

### Task 0.4：建立 Phase 0 完成门槛

**涉及文件：**

- 新增：`docs/阶段验收记录.md`

**实施步骤：**

- [x] 创建验收记录。

建议结构：

```md
# 阶段验收记录

## Phase 0：基线修复

- 分支：
- Commit：
- `npm run lint`：
- `npm run test:ci`：
- `npm run build`：
- `npm audit --omit=dev --audit-level=high`：
- 剩余风险：
```

- [x] 记录命令结果和剩余风险。

- [x] 提交 Phase 0。

```bash
git add package.json package-lock.json .github docs src/test src/lib/utils
git commit -m "chore: establish baseline checks"
```

## 5. Phase 1：安全重构

**目标：** 关闭 API key 暴露、Markdown XSS 和运行时配置风险。

**当前状态：** `CHARTDB-P1-000` 和 `CHARTDB-P1-001` 已完成。Phase 1 安全实施清单已记录在 `docs/安全模型与AI边界.md`；Docker 构建和 Nginx `/config.js` 已移除浏览器端 API key 暴露；AI mode gating 完成前，非 deterministic 的 AI-assisted SQL export 暂停，避免把 OpenAI SDK 和 key fallback 打入浏览器产物。后续代码任务必须以该文档约束为准：默认 AI mode 为 Disabled，BYOK 密钥只允许保存在当前浏览器会话内，Self-hosted Gateway 不把服务端 secret 下发到浏览器，Note Markdown 首轮禁用 raw HTML，Docker/Nginx 安全头和 CSP 以不破坏静态部署为前提逐步落地。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-1-security
```

### Task 1.1：移除浏览器运行时 API key 暴露

**涉及文件：**

- 修改：`Dockerfile`
- 修改：`default.conf.template`
- 修改：`src/lib/env.ts`
- 修改：`src/lib/data/sql-export/export-sql-script.ts`
- 新增：`src/ai/client/ai-config.ts`
- 新增：`docs/AI与隐私说明.md`

**实施步骤：**

- [x] 删除 `default.conf.template` 中 `/config.js` 返回 `OPENAI_API_KEY` 的逻辑。

保留非敏感配置：

- `OPENAI_API_ENDPOINT`，仅当 endpoint 不包含 secret。
- `LLM_MODEL_NAME`。
- `HIDE_CHARTDB_CLOUD`。
- `DISABLE_ANALYTICS`。

- [x] 修改 `Dockerfile`，不要将 `VITE_OPENAI_API_KEY` 写入 `.env`。

构建参数中移除：

```dockerfile
ARG VITE_OPENAI_API_KEY
```

`.env` 写入中移除：

```dockerfile
echo "VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}" > .env
```

- [ ] 新增 AI 配置模式。

建议类型：

```ts
export type AIMode = 'disabled' | 'byok-session' | 'self-hosted-gateway';

export interface AIConfig {
    mode: AIMode;
    endpoint?: string;
    modelName?: string;
}
```

- [ ] 修改 `exportSQL()`，默认 deterministic export 不触发 AI。

规则：

- 同方言导出直接返回 deterministic SQL。
- 已实现 deterministic cross-dialect 的路径直接返回 deterministic SQL。
- 其他 AI-assisted export 先检查 AI mode。
- `disabled` 模式抛出可展示错误。

- [ ] 更新文档，说明 AI 默认关闭，任何 schema 发送到模型前必须用户确认。

- [ ] 验证浏览器产物不包含 key。

```bash
npm run build
rg -n "OPENAI_API_KEY|sk-" dist || true
```

预期：不存在真实 secret，也不暴露运行时 `OPENAI_API_KEY`。

### Task 1.2：增加 BYOK Session 模式

**涉及文件：**

- 新增：`src/ai/client/session-key-store.ts`
- 新增：`src/features/settings/ai-settings.tsx`
- 修改：`src/lib/data/sql-export/export-sql-script.ts`
- 测试：`src/ai/client/__tests__/session-key-store.test.ts`

**实施步骤：**

- [ ] 实现内存级 session key store。

规则：

- 只存在 module memory。
- 不写入 IndexedDB。
- 不写入 localStorage。
- 刷新页面后丢失。

- [ ] 设置页允许用户输入临时 key。

UI 文案：

- “Key 仅保存在当前浏览器会话内，刷新后失效。”
- “启用 AI 会把当前 schema 摘要发送给所选模型。”

- [ ] AI 请求前弹出确认。

确认内容：

- 目标模型。
- 目标 endpoint。
- 将发送的 table/field/relationship 数量。

- [ ] 测试 session store。

```bash
npm run test:ci -- src/ai/client/__tests__/session-key-store.test.ts
```

预期：key 可设置、读取、清除，且不会写入 localStorage。

### Task 1.3：规划 Self-hosted Gateway contract

**涉及文件：**

- 新增：`src/ai/gateway-contract/types.ts`
- 新增：`docs/自托管AI网关接口.md`

**实施步骤：**

- [ ] 定义前端调用 contract。

建议 endpoint：

```text
POST /api/ai/export-sql
```

请求字段：

- sourceDialect。
- targetDialect。
- deterministicSql。
- diagramSummary。
- options。

响应字段：

- sql。
- warnings。
- model。
- requestId。

- [ ] 文档说明 gateway 必须实现：

  - rate limit。
  - timeout。
  - request size limit。
  - secret server-side only。
  - log redaction。

- [ ] Phase 1 只定义 contract，不实现完整后端。

验收：前端不依赖 gateway 存在才能完成 deterministic export。

### Task 1.4：Note Markdown 安全渲染

**涉及文件：**

- 修改：`src/pages/editor-page/canvas/note-node/note-node.tsx`
- 修改：`package.json`
- 修改：`package-lock.json`
- 测试：`src/pages/editor-page/canvas/note-node/__tests__/note-markdown-safety.test.tsx`

**实施步骤：**

- [ ] 移除 `rehype-raw`，或改为 `rehype-sanitize` 严格 allowlist。

推荐首轮：禁用 raw HTML。

- [ ] 允许 Markdown：

  - heading。
  - paragraph。
  - list。
  - bold。
  - italic。
  - inline code。
  - fenced code。
  - safe links。

- [ ] 禁止：

  - script。
  - iframe。
  - style。
  - event handler attribute。
  - `javascript:` URL。

- [ ] 增加测试。

测试输入：

```md
<script>alert(1)</script>
[bad](javascript:alert(1))
<img src=x onerror=alert(1)>
```

预期：

- 不执行。
- 不渲染危险属性。
- 安全文本仍可展示。

- [ ] 运行测试。

```bash
npm run test:ci -- src/pages/editor-page/canvas/note-node/__tests__/note-markdown-safety.test.tsx
```

### Task 1.5：Nginx 和 Docker 安全头

**涉及文件：**

- 修改：`default.conf.template`
- 修改：`Dockerfile`
- 新增：`docs/Docker自托管部署说明.md`

**实施步骤：**

- [ ] 增加基础安全头。

建议：

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

- [ ] 根据 AI endpoint 和 Fathom 分析域名设计 CSP。

首轮可以使用保守 CSP，并在文档说明如何调整。

- [ ] 构建 Docker 镜像。

```bash
docker build -t chartdb-security-smoke .
```

- [ ] 运行 Docker 容器。

```bash
docker run --rm -p 8080:80 chartdb-security-smoke
```

- [ ] 访问页面并检查响应头。

```bash
curl -I http://localhost:8080
```

预期：包含安全头。

## 6. Phase 2：Schema Core 与 Command 架构

**目标：** 解耦巨型 Provider，把编辑动作沉淀为可测试 command。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-2-schema-core
```

### Task 2.1：建立 schema-core 目录和领域模型出口

**涉及文件：**

- 新增：`src/schema-core/model/index.ts`
- 新增：`src/schema-core/model/diagram.ts`
- 新增：`src/schema-core/model/table.ts`
- 新增：`src/schema-core/model/field.ts`
- 新增：`src/schema-core/model/relationship.ts`
- 修改：`src/lib/domain/index.ts`

**实施步骤：**

- [ ] 先创建 re-export 层，不立即搬迁全部类型。

目标：

- 新代码从 `src/schema-core/model` 引入。
- 旧代码继续从 `src/lib/domain` 工作。

- [ ] 每迁移一个类型，先加编译检查。

```bash
npm run build
```

预期：TypeScript 编译通过。

- [ ] 不在本 Task 修改业务逻辑。

### Task 2.2：定义 DiagramCommand 基础类型

**涉及文件：**

- 新增：`src/schema-core/commands/diagram-command.ts`
- 新增：`src/schema-core/commands/command-result.ts`
- 新增：`src/schema-core/commands/command-context.ts`
- 测试：`src/schema-core/commands/__tests__/diagram-command.test.ts`

**实施步骤：**

- [ ] 定义 command 类型。

建议：

```ts
export interface DiagramCommand<TType extends string = string, TPayload = unknown> {
    id: string;
    type: TType;
    payload: TPayload;
    createdAt: string;
}
```

- [ ] 定义 command result。

```ts
export interface CommandResult<TState> {
    state: TState;
    undoCommand?: DiagramCommand;
    affectedEntityIds: string[];
}
```

- [ ] 定义 command context。

```ts
export interface CommandContext {
    now: () => Date;
    generateId: () => string;
}
```

- [ ] 增加测试确保 command 创建时字段完整。

### Task 2.3：迁移 AddTable / UpdateTable / DeleteTable command

**涉及文件：**

- 新增：`src/schema-core/commands/table-commands.ts`
- 新增：`src/schema-core/commands/apply-table-command.ts`
- 测试：`src/schema-core/commands/__tests__/table-commands.test.ts`
- 修改：`src/context/chartdb-context/chartdb-provider.tsx`

**实施步骤：**

- [ ] 先写 command 单元测试。

测试覆盖：

- Add table。
- Update table name。
- Delete table。
- Delete table 同时移除 relationships。

- [ ] 实现纯函数 apply。

原则：

- 输入 current diagram state。
- 输出 new diagram state。
- 不直接写 Dexie。
- 不直接操作 React state。

- [ ] Provider 中 table 操作改为调用 command。

- [ ] 运行测试。

```bash
npm run test:ci -- src/schema-core/commands/__tests__/table-commands.test.ts
npm run build
```

### Task 2.4：迁移 Field / Index / Relationship command

**涉及文件：**

- 新增：`src/schema-core/commands/field-commands.ts`
- 新增：`src/schema-core/commands/index-commands.ts`
- 新增：`src/schema-core/commands/relationship-commands.ts`
- 测试：`src/schema-core/commands/__tests__/field-index-relationship-commands.test.ts`
- 修改：`src/context/chartdb-context/chartdb-provider.tsx`

**实施步骤：**

- [ ] 测试删除 field 时处理 index 和 relationship 引用。

预期：

- 包含该 field 的 relationship 被移除或进入 warning。
- 包含该 field 的 index 收缩。
- 空 index 被删除。

- [ ] 测试 relationship cardinality 更新。

- [ ] 实现 command。

- [ ] Provider 接入。

- [ ] 运行完整 command 测试。

### Task 2.5：迁移 Area / Note / CustomType command

**涉及文件：**

- 新增：`src/schema-core/commands/area-commands.ts`
- 新增：`src/schema-core/commands/note-commands.ts`
- 新增：`src/schema-core/commands/custom-type-commands.ts`
- 测试：`src/schema-core/commands/__tests__/visual-and-type-commands.test.ts`

**实施步骤：**

- [ ] Area 删除不删除 table。

- [ ] Note 删除仅删除 note。

- [ ] Custom type 删除前检查 field 引用。

- [ ] 运行测试。

### Task 2.6：接入 undo/redo

**涉及文件：**

- 修改：`src/context/history-context/redo-undo-action.ts`
- 修改：`src/context/history-context/redo-undo-stack-provider.tsx`
- 修改：`src/context/chartdb-context/chartdb-provider.tsx`
- 测试：`src/schema-core/commands/__tests__/undo-redo-commands.test.ts`

**实施步骤：**

- [ ] 将 undo action 从零散 patch 过渡为 command inverse。

- [ ] 每个 command 返回 `undoCommand`。

- [ ] 测试 add/update/delete 的 undo/redo。

- [ ] 保留旧行为兼容，分批迁移。

## 7. Phase 3：Storage 与备份恢复

**目标：** 把 IndexedDB 访问从 React Provider 中抽离，并保证 diagram 级事务一致性。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-3-storage
```

### Task 3.1：抽 Dexie 数据库定义

**涉及文件：**

- 新增：`src/storage/db/chartdb-dexie.ts`
- 新增：`src/storage/db/schema-versions.ts`
- 修改：`src/context/storage-context/storage-provider.tsx`
- 测试：`src/storage/db/__tests__/chartdb-dexie.test.ts`

**实施步骤：**

- [ ] 将 Dexie 初始化和 version stores 从 Provider 中移出。

- [ ] Provider 只接收已创建的 db instance。

- [ ] 测试 Dexie table names 和当前版本。

### Task 3.2：抽 Repository

**涉及文件：**

- 新增：`src/storage/repositories/diagram-repository.ts`
- 新增：`src/storage/repositories/table-repository.ts`
- 新增：`src/storage/repositories/relationship-repository.ts`
- 新增：`src/storage/repositories/area-repository.ts`
- 新增：`src/storage/repositories/note-repository.ts`
- 新增：`src/storage/repositories/custom-type-repository.ts`
- 修改：`src/context/storage-context/storage-provider.tsx`

**实施步骤：**

- [ ] 每个 repository 只负责单一实体 CRUD。

- [ ] Provider 改为组合 repository，而不是直接写 Dexie 查询。

- [ ] 每迁移一个 repository 运行对应测试。

### Task 3.3：实现 diagram transaction service

**涉及文件：**

- 新增：`src/storage/repositories/diagram-transaction-service.ts`
- 测试：`src/storage/repositories/__tests__/diagram-transaction-service.test.ts`
- 修改：`src/context/chartdb-context/chartdb-provider.tsx`

**实施步骤：**

- [ ] 实现 `deleteDiagramWithChildren(diagramId)`。

删除对象：

- diagram。
- tables。
- relationships。
- dependencies。
- areas。
- custom types。
- notes。
- diagram filters。

- [ ] 实现 `replaceDiagramData(diagram)`。

- [ ] 测试事务失败时不产生半删状态。

### Task 3.4：实现 backup/restore

**涉及文件：**

- 新增：`src/storage/backup/backup-format.ts`
- 新增：`src/storage/backup/export-backup.ts`
- 新增：`src/storage/backup/import-backup.ts`
- 新增：`src/features/diagrams/backup-restore-dialog.tsx`
- 测试：`src/storage/backup/__tests__/backup-restore.test.ts`

**实施步骤：**

- [ ] 定义 backup 格式。

- [ ] 导出时写入：

  - format。
  - formatVersion。
  - appVersion。
  - createdAt。
  - diagram。

- [ ] 恢复前校验格式。

- [ ] 恢复前展示 diagram 摘要。

- [ ] 支持导入为新 diagram。

## 8. Phase 4：Importer / Exporter 插件化

**目标：** 将 SQL/DBML 导入导出重构为方言插件体系。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-4-dialects
```

### Task 4.1：定义 importer/exporter contract

**涉及文件：**

- 新增：`src/dialects/common/importer.ts`
- 新增：`src/dialects/common/exporter.ts`
- 新增：`src/dialects/common/capability-matrix.ts`
- 测试：`src/dialects/common/__tests__/capability-matrix.test.ts`

**实施步骤：**

- [ ] 定义 `SchemaImporter`。

- [ ] 定义 `ImportResult`。

- [ ] 定义 `SchemaExporter`。

- [ ] 定义 capability support level：

```ts
export type SupportLevel = 'full' | 'partial' | 'experimental' | 'unsupported';
```

- [ ] 测试 support level 渲染和缺省值。

### Task 4.2：迁移 PostgreSQL importer

**涉及文件：**

- 新增：`src/dialects/postgresql/importer.ts`
- 新增：`src/dialects/postgresql/capabilities.ts`
- 新增：`src/dialects/postgresql/parser/`
- 修改：`src/lib/data/sql-import/dialect-importers/postgresql/postgresql.ts`

**实施步骤：**

- [ ] 先以 wrapper 方式接入旧 parser。

- [ ] 输出结构化 warnings。

- [ ] 分批拆 parser：

  - table parser。
  - enum parser。
  - relationship parser。
  - index parser。
  - comment parser。

- [ ] 保持现有 PostgreSQL 测试全部通过。

### Task 4.3：迁移 MySQL、MariaDB、SQLite、SQL Server、Oracle

**涉及文件：**

- 新增：`src/dialects/mysql/`
- 新增：`src/dialects/mariadb/`
- 新增：`src/dialects/sqlite/`
- 新增：`src/dialects/sqlserver/`
- 新增：`src/dialects/oracle/`

**实施步骤：**

- [ ] 每个 dialect 先建立 wrapper。

- [ ] 每个 dialect 输出 capabilities。

- [ ] 每个 dialect 保留现有 fixture tests。

- [ ] 新增 unsupported statement warnings。

### Task 4.4：DBML 进入 dialect pipeline

**涉及文件：**

- 新增：`src/dialects/dbml/importer.ts`
- 新增：`src/dialects/dbml/exporter.ts`
- 修改：`src/lib/dbml/dbml-import/dbml-import.ts`
- 修改：`src/lib/dbml/dbml-export/dbml-export.ts`

**实施步骤：**

- [ ] 先建立 wrapper，不立即重写内部逻辑。

- [ ] DBML import 输出 `ImportResult`。

- [ ] DBML export 输出 `ExportResult`。

- [ ] round-trip 测试通过。

### Task 4.5：导入 preview flow

**涉及文件：**

- 新增：`src/features/import/import-preview-service.ts`
- 新增：`src/features/import/import-preview-dialog.tsx`
- 修改：`src/dialogs/import-database-dialog/import-database-dialog.tsx`

**实施步骤：**

- [ ] 所有导入先进入 preview。

- [ ] Preview 显示：

  - tables。
  - views。
  - fields。
  - indexes。
  - relationships。
  - warnings。

- [ ] 用户确认后才写入当前 diagram。

## 9. Phase 5：产品体验与可访问性

**目标：** 改善首次进入、导入向导、移动端和无障碍体验。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-5-ux-a11y
```

### Task 5.1：重做首次进入入口

**涉及文件：**

- 新增：`src/features/onboarding/onboarding-dialog.tsx`
- 新增：`src/features/onboarding/database-picker.tsx`
- 新增：`src/features/onboarding/start-options.tsx`
- 修改：`src/dialogs/create-diagram-dialog/`

**实施步骤：**

- [ ] 拆分数据库选择和启动方式选择。

- [ ] 三个入口：

  - 导入现有数据库。
  - 创建空白图。
  - 查看模板。

- [ ] 修复 radio accessible name。

- [ ] 移动端使用全屏向导。

### Task 5.2：Smart Query wizard

**涉及文件：**

- 新增：`src/features/import/smart-query-wizard.tsx`
- 新增：`src/features/import/smart-query-result-validator.ts`
- 修改：`src/dialogs/common/import-database/import-database.tsx`

**实施步骤：**

- [ ] 五步向导：

  1. 选择数据库。
  2. 复制 query。
  3. 粘贴结果。
  4. 校验摘要。
  5. 预览导入。

- [ ] 输入为空时显示原因。

- [ ] JSON 错误显示具体提示。

- [ ] 复制按钮有 `aria-label`。

### Task 5.3：全局 aria-label 修复

**涉及文件：**

- 修改：`src/components/button/`
- 修改：`src/pages/editor-page/canvas/`
- 修改：`src/pages/editor-page/top-navbar/`
- 修改：`src/dialogs/`

**实施步骤：**

- [ ] 搜索无文本 icon button。

```bash
rg -n "<Button|<button" src/pages src/dialogs src/components
```

- [ ] 为图标按钮补 `aria-label`。

- [ ] Monaco editor 按用途命名：

  - SQL query editor。
  - Smart Query output editor。
  - DBML editor。
  - SQL export result editor。

- [ ] 跑无障碍 smoke。

### Task 5.4：设置中心

**涉及文件：**

- 新增：`src/features/settings/settings-dialog.tsx`
- 新增：`src/features/settings/display-settings.tsx`
- 新增：`src/features/settings/privacy-settings.tsx`
- 新增：`src/features/settings/keyboard-shortcuts-settings.tsx`
- 修改：`src/context/local-config-context/local-config-provider.tsx`

**实施步骤：**

- [ ] 把 theme、language、minimap、field attributes 等集中到设置中心。

- [ ] localStorage 读写加 try/catch 容错。

- [ ] 设置不保存 secret。

## 10. Phase 6：性能优化

**目标：** 降低首屏包体，避免大 schema 阻塞主线程。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-6-performance
```

### Task 6.1：Monaco 懒加载

**涉及文件：**

- 修改：`src/components/code-snippet/code-editor.ts`
- 修改：`src/components/code-snippet/code-snippet.tsx`
- 修改：`vite.config.ts`

**实施步骤：**

- [ ] 确认当前 Monaco chunk。

```bash
npm run build
```

- [ ] 仅在 SQL/DBML editor 打开时加载 Monaco。

- [ ] 按语言加载 worker。

- [ ] 再次构建对比 chunk。

### Task 6.2：模板 lazy registry

**涉及文件：**

- 新增：`src/templates-data/template-manifest.ts`
- 修改：`src/templates-data/templates-data.ts`
- 修改：`src/pages/templates-page/templates-page.tsx`
- 修改：`src/pages/template-page/template-page.tsx`

**实施步骤：**

- [ ] 建立 manifest，只包含 metadata。

- [ ] diagram 数据改为动态 import。

- [ ] 模板详情页才加载完整 diagram。

- [ ] 构建对比 templates chunk。

### Task 6.3：Worker 化 parser/layout

**涉及文件：**

- 新增：`src/workers/import-worker/import-worker.ts`
- 新增：`src/workers/layout-worker/layout-worker.ts`
- 新增：`src/workers/worker-client.ts`
- 修改：`src/features/import/`
- 修改：`src/lib/domain/graph.ts`

**实施步骤：**

- [ ] 先把大 DDL parse 放入 worker。

- [ ] 再把 auto layout 放入 worker。

- [ ] 主线程显示 progress 和 cancel。

- [ ] 大 schema smoke：

  - 100 tables。
  - 500 tables。

## 11. Phase 7：发布治理与文档

**目标：** 让项目具备可持续发布和维护能力。

**推荐分支：**

```bash
git switch -c codex/chartdb-phase-7-release-docs
```

### Task 7.1：发布 workflow gate

**涉及文件：**

- 修改：`.github/workflows/publish.yaml`
- 修改：`.github/workflows/release.yaml`

**实施步骤：**

- [ ] publish 中加入：

  - `npm ci`。
  - `npm audit --omit=dev --audit-level=high`。
  - `npm run lint`。
  - `npm run test:ci`。
  - `npm run build`。
  - Docker build smoke。

- [ ] tag 发布必须阻断 failing tests。

### Task 7.2：补齐工程文档

**涉及文件：**

- 新增：`docs/架构说明.md`
- 新增：`docs/安全说明.md`
- 新增：`docs/AI与隐私说明.md`
- 新增：`docs/数据库方言支持矩阵.md`
- 新增：`docs/导入导出接口约定.md`
- 新增：`docs/存储迁移说明.md`
- 新增：`docs/发布检查清单.md`
- 新增：`docs/测试策略.md`

**实施步骤：**

- [ ] 每份文档只写真实能力，不写未实现承诺。

- [ ] 支持矩阵从 dialect capabilities 生成或同步维护。

- [ ] README 链接到这些文档。

### Task 7.3：Issue template

**涉及文件：**

- 新增：`.github/ISSUE_TEMPLATE/bug_report.yml`
- 新增：`.github/ISSUE_TEMPLATE/dialect_import_bug.yml`
- 新增：`.github/ISSUE_TEMPLATE/security_report.md`

**实施步骤：**

- [ ] Dialect bug 模板要求用户提供：

  - 数据库类型。
  - 数据库版本。
  - 输入 DDL 或 Smart Query 输出脱敏样例。
  - 预期对象数量。
  - 实际结果。

## 12. Phase 8：可选 Cloud/Team 规划

**目标：** 在 OSS Core 稳定后，单独规划账号和云协作，不进入首轮重构主线。

### Task 8.1：Cloud/Team 技术预研

**交付物：**

- `docs/可选云端协作产品方案.md`
- `docs/可选云端协作技术预研.md`

**设计范围：**

- 登录。
- Workspace。
- Team。
- Diagram 云同步。
- 分享权限。
- 版本历史。
- 评论。
- 审计日志。

**硬约束：**

- 不登录仍可完整使用 OSS Core。
- 用户主动开启云同步。
- 本地历史 diagram 不自动上传。
- 云端数据可导出、可删除。

## 13. 总体验收流程

每个 Phase 完成后执行：

```bash
npm run lint
npm run test:ci
npm run build
npm audit --omit=dev --audit-level=high
```

涉及 Docker 的 Phase 执行：

```bash
docker build -t chartdb-smoke .
docker run --rm -p 8080:80 chartdb-smoke
curl -I http://localhost:8080
```

涉及 UI 的 Phase 执行：

- 桌面浏览器 smoke。
- 移动 viewport smoke。
- 键盘路径 smoke。
- 导入/新建/导出核心流程 smoke。

涉及性能的 Phase 执行：

- 记录 build chunk size。
- 记录 100 tables 操作体验。
- 记录 500 tables 是否冻结。

## 14. 交付节奏建议

### 第一轮 PR：Phase 0

目标：

- 测试通过。
- 生产 high audit 风险清零或记录。
- CI gate 生效。

### 第二轮 PR：Phase 1

目标：

- API key 不暴露。
- Markdown 安全。
- Docker/Nginx 安全头。

### 第三轮 PR：Phase 2

目标：

- Command core 建立。
- 关键编辑动作迁移。
- Provider 开始瘦身。

### 第四轮 PR：Phase 3

目标：

- Storage repository。
- Diagram transaction。
- Backup/restore。

### 第五轮 PR：Phase 4

目标：

- Importer/exporter contract。
- PostgreSQL wrapper。
- DBML pipeline。
- Preview flow。

### 第六轮 PR：Phase 5

目标：

- Onboarding。
- Smart Query wizard。
- Accessibility。
- Settings。

### 第七轮 PR：Phase 6

目标：

- Monaco lazy。
- Template lazy。
- Worker。
- Bundle budget。

### 第八轮 PR：Phase 7

目标：

- Release gate。
- 文档。
- Issue template。

## 15. 风险与控制

### 15.1 最大风险

- 一次性重写 parser 导致回归。
- 依赖 major 升级引发 UI 或 router 破坏。
- Command 架构迁移期间 undo/redo 行为改变。
- Storage transaction 改造导致老数据 migration 问题。
- AI 安全改造影响现有自托管用户。

### 15.2 控制方式

- 先 wrapper，后拆分。
- 每个 dialect 保留旧 fixture。
- 每个 command 单独测试。
- 每次 storage migration 做旧版本 fixture。
- Docker 自托管变更必须写迁移说明。
- 所有破坏性变更进入 release notes。

## 16. 执行起点

下一步应从 Phase 0 开始。

第一批具体命令：

```bash
git switch -c codex/chartdb-phase-0-baseline
npm run test:ci
npm audit --omit=dev
```

第一批目标：

- 修复 `localStorage.getItem is not a function`。
- 升级可安全升级的 high/critical advisory。
- 将 `npm audit --omit=dev --audit-level=high` 加入 CI。
- 记录 Phase 0 验收结果。

完成 Phase 0 后，再进入 Phase 1 安全重构。不要跳过 Phase 0 直接做架构拆分。
