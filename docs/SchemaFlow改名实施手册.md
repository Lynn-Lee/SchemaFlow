# SchemaFlow 改名实施手册

> **给自动执行 agent：** 后续按任务执行时必须使用 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans`，并逐项更新 checkbox 进度。

**Goal:** 将当前 ChartDB 项目整体改名为 SchemaFlow，并让代码、文档、构建产物、运行时配置和用户可见文案统一使用 SchemaFlow。

**Architecture:** 采用分批改名，不做一次性盲目字符串替换。用户可见品牌、文档、包名和 URL 先统一到 SchemaFlow；对 IndexedDB、localStorage、backup 格式、Docker/env 等运行时契约提供旧值兼容迁移，避免老用户本地 diagram、AI 设置和备份文件失效。

**Tech Stack:** React、Vite、TypeScript、Dexie、IndexedDB、Vitest、Docker、Nginx runtime config、GitHub Actions。

---

## 1. 当前真实状态

- 本地路径：`/Users/lynn/SynologyDrive/SynologyDrive/Code/ChartDB`
- 当前分支：`main...origin/main`，工作区干净。
- 当前唯一 remote：`origin = https://github.com/Lynn-Lee/SchemaFlow.git`
- 当前无 `.codegraph/` 目录，命名审计使用 `rg`。
- 改名前 `ChartDB|chartDB|chartdb|CHARTDB` 是主要旧品牌命名集合。
- 命中范围：
  - `src/`：167 个文件
  - `docs/`：19 个文件
  - 根文档与配置：`README.md`、`CONTRIBUTING.md`、`CLA.md`、`CHANGELOG.md`、`package.json`、`package-lock.json`、`Dockerfile`、`default.conf.template`、`entrypoint.sh`、`index.html`
  - 静态资产：`public/schemaflow.png`、`public/SchemaFlow.gif`

## 2. 命名规则

| 当前写法 | 新写法 | 用途 |
| --- | --- | --- |
| `ChartDB` | `SchemaFlow` | 产品名、React 类型名、函数名、文档正文 |
| `chartDB` | `schemaFlow` | camelCase hook/context 片段 |
| `chartdb` | `schemaflow` | package name、文件名、URL path、storage key、Docker tag |
| `CHARTDB` | `SCHEMAFLOW` | env var、常量、任务 ID、CI 变量 |
| `ChartDBProvider` | `SchemaFlowProvider` | React provider |
| `useChartDB` | `useSchemaFlow` | React hook |
| `ChartDBContext` | `SchemaFlowContext` | React context type |
| `ChartDBConfig` | `SchemaFlowConfig` | config domain type |
| `createChartDBDexie` | `createSchemaFlowDexie` | Dexie factory |
| `chartdb.backup` | `schemaflow.backup` | backup 格式标识 |
| `chartdb-local` | `schemaflow-local` | backup source |

执行原则：

- 用户可见文案、正式文档、包名、标题、SEO、下载文件名和新导出的 backup 必须使用 SchemaFlow。
- 旧运行时契约只允许以 `legacy` 兼容常量存在，并且只能在迁移、解析旧数据或回归测试中出现。
- 若后续要求仓库内完全零 `ChartDB|chartDB|chartdb|CHARTDB` 字符串，则会牺牲旧 IndexedDB、旧 localStorage、旧 backup 文件兼容；默认不采用这种破坏性模式。

## 3. 必须兼容的旧运行时契约

这些位置不能只做替换，需要双读、迁移或 dual-parse。

| 契约 | 当前值 | 新值 | 兼容要求 |
| --- | --- | --- | --- |
| Dexie database name | `ChartDB` | `SchemaFlow` | 首次启动时检测旧库，迁移 diagrams、config、filters 等 store 到新库。迁移成功后保留旧库，不自动删除。 |
| Backup format | `chartdb.backup` | `schemaflow.backup` | 新导出使用 `schemaflow.backup`；恢复入口同时接受旧 `chartdb.backup`。 |
| Backup source | `chartdb-local` | `schemaflow-local` | 新导出使用新 source；旧备份解析后统一映射为兼容 summary。 |
| AI local config | `chartdb.ai.mode` 等 | `schemaflow.ai.mode` 等 | 初始化先读新 key，若为空再读旧 key 并写入新 key。 |
| BYOK/session tests | `chartdb.ai.byok.key` | `schemaflow.ai.byok.key` | 测试同时覆盖旧 key 不再作为主写入位置。 |
| Canvas notice key | `chartdb.mobileCanvasNoticeDismissed` | `schemaflow.mobileCanvasNoticeDismissed` | 双读一次，写入新 key。 |
| Runtime env | `HIDE_CHARTDB_CLOUD` / `VITE_HIDE_CHARTDB_CLOUD` | `HIDE_SCHEMAFLOW_CLOUD` / `VITE_HIDE_SCHEMAFLOW_CLOUD` | Nginx runtime config 和 Vite build config 先支持新旧两个变量，新变量优先。 |
| Docker smoke name/tag | `chartdb-release-smoke` | `schemaflow-release-smoke` | GitHub Actions、README 和 publish workflow 一起改。 |

## 4. 执行批次

### Task 0: 建立改名分支与审计基线

**Files:**
- Read: `AGENTS.md`
- Read: `package.json`
- Read: `docs/SchemaFlow自动开发任务计划.md`
- Create: `.codex-audit/schemaflow-rename-inventory.txt`（本地审计产物，不提交）

- [ ] **Step 1: 创建分支**

```bash
git status --short --branch
git remote -v
git switch -c codex/schemaflow-rename
```

Expected:

- 工作区干净。
- remote 只有 `origin`。
- 分支名为 `codex/schemaflow-rename`。

- [ ] **Step 2: 保存命名审计**

```bash
rg -n "SchemaFlow|schemaflow|SCHEMAFLOW" --glob '!node_modules/**' --glob '!dist/**' --glob '!.git/**' --glob '!.codegraph/**' > .codex-audit/schemaflow-rename-inventory.txt
```

Expected:

- 审计文件存在。
- `.codex-audit/` 不加入 git。

### Task 1: 产品名、package、HTML、README、公开文案

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `index.html`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `CODE_OF_CONDUCT.md`
- Modify: `CLA.md`
- Modify: `.github/ISSUE_TEMPLATE/**`

- [ ] **Step 1: 更新 package name**

将 `package.json` 和 `package-lock.json` 中的 package name 从 `schemaflow` 改为 `schemaflow`。

Run:

```bash
npm install --package-lock-only
```

Expected:

- `package.json` name 是 `schemaflow`。
- `package-lock.json` root package name 是 `schemaflow`。

- [ ] **Step 2: 更新 HTML 与 README**

将产品标题、alt 文案、部署命令、Docker image/tag 示例、GitHub issue 链接和用户说明改为 SchemaFlow。

建议映射：

```text
ChartDB -> SchemaFlow
chartDB -> schemaFlow
chartdb -> schemaflow
CHARTDB -> SCHEMAFLOW
https://chartdb.io -> 新 SchemaFlow 官网域名
https://app.chartdb.io -> 新 SchemaFlow app 域名
https://docs.chartdb.io -> 新 SchemaFlow docs 域名
https://github.com/chartdb/chartdb -> Lynn-Lee/SchemaFlow 仓库或明确保留为历史链接
ghcr.io/chartdb/chartdb -> 新 SchemaFlow container image
support@chartdb.io -> 新 SchemaFlow support 入口
```

如果新域名、镜像名或邮箱还没有最终值，不把临时值写入可发布文档。外部 URL、container image 和 support 邮箱改名任务标记为 blocked；先完成本地产品名、package、源码符号和兼容迁移。

- [ ] **Step 3: 验证用户可见旧品牌基本清零**

```bash
rg -n "ChartDB|chartDB|chartdb|CHARTDB|chartdb.io|app.chartdb.io|docs.chartdb.io|github.com/chartdb|ghcr.io/chartdb|support@chartdb.io" README.md CONTRIBUTING.md CODE_OF_CONDUCT.md CLA.md index.html .github
```

Expected:

- 只有明确标注为 legacy compatibility 的内容允许保留。

### Task 2: 运行时配置和 Docker/Nginx 变量

**Files:**
- Modify: `Dockerfile`
- Modify: `default.conf.template`
- Modify: `entrypoint.sh`
- Modify: `src/lib/env.ts`
- Modify: `docs/部署与安全配置.md`

- [ ] **Step 1: 新变量优先、旧变量兼容**

`src/lib/env.ts` 应暴露新的 `HIDE_SCHEMAFLOW_CLOUD`。读取顺序为：

```ts
export const HIDE_SCHEMAFLOW_CLOUD: boolean =
    (window?.env?.HIDE_SCHEMAFLOW_CLOUD ??
        window?.env?.HIDE_CHARTDB_CLOUD ??
        import.meta.env.VITE_HIDE_SCHEMAFLOW_CLOUD ??
        import.meta.env.VITE_HIDE_CHARTDB_CLOUD) === 'true';
```

调用方从 `HIDE_CHARTDB_CLOUD` 改为 `HIDE_SCHEMAFLOW_CLOUD`。

- [ ] **Step 2: 更新 Docker build args 和 Nginx config**

`Dockerfile` 使用 `VITE_HIDE_SCHEMAFLOW_CLOUD`，并在兼容期接受旧 `VITE_HIDE_CHARTDB_CLOUD` build arg。

`entrypoint.sh` 和 `default.conf.template` 输出 `HIDE_SCHEMAFLOW_CLOUD`，同时可从旧 `HIDE_CHARTDB_CLOUD` 回退。

- [ ] **Step 3: 验证构建配置**

```bash
rg -n "HIDE_SCHEMAFLOW_CLOUD|VITE_HIDE_SCHEMAFLOW_CLOUD|HIDE_CHARTDB_CLOUD|VITE_HIDE_CHARTDB_CLOUD" Dockerfile default.conf.template entrypoint.sh src/lib/env.ts docs/部署与安全配置.md
npm run test:ci -- src/lib/__tests__ src/features/settings/__tests__
```

Expected:

- 旧变量只出现在兼容读取或兼容文档中。
- 测试通过。

### Task 3: React context、hooks、domain type 和文件名

**Files:**
- Move: `src/context/schemaflow-context/` -> `src/context/schemaflow-context/`
- Move: `src/hooks/use-schemaflow.ts` -> `src/hooks/use-schemaflow.ts`
- Modify: `src/context/storage-context/**`
- Modify: `src/context/history-context/**`
- Modify: `src/pages/**`
- Modify: `src/dialogs/**`
- Modify: `src/features/**`

- [ ] **Step 1: 先改核心导出文件**

命名改动：

```text
schemaFlowContext -> schemaFlowContext
schemaFlowStoreContext -> schemaFlowStoreContext
SchemaFlowProvider -> SchemaFlowProvider
SchemaFlowProviderProps -> SchemaFlowProviderProps
SchemaFlowContext -> SchemaFlowContext
useSchemaFlow -> useSchemaFlow
useSchemaFlowSelector -> useSchemaFlowSelector
useSchemaFlowProviderValue -> useSchemaFlowProviderValue
```

- [ ] **Step 2: 批量更新 import**

```bash
rg -n "@/hooks/use-schemaflow|schemaflow-context|SchemaFlowProvider|useSchemaFlow|SchemaFlowContext|schemaFlowContext|schemaFlowStoreContext" src
```

逐文件替换为新路径和新符号。不要在同一提交里改无关逻辑。

- [ ] **Step 3: 跑 context 相关测试**

```bash
npm run test:ci -- src/context/schemaflow-context src/context/history-context src/pages/editor-page/canvas
```

Expected:

- 旧 hook、旧 context 文件路径不再被业务代码引用。
- context、history、canvas 相关测试通过。

### Task 4: Storage、Dexie、repository、backup 兼容迁移

**Files:**
- Move: `src/storage/db/schemaflow-dexie.ts` -> `src/storage/db/schemaflow-dexie.ts`
- Move: `src/storage/repositories/schemaflow-repositories.ts` -> `src/storage/repositories/schemaflow-repositories.ts`
- Modify: `src/storage/backup/backup-format.ts`
- Modify: `src/features/settings/privacy-settings.tsx`
- Modify: `src/context/local-config-context/local-config-provider.tsx`
- Modify: `src/storage/**/__tests__/**`

- [ ] **Step 1: Dexie 新库名和旧库迁移**

新增常量：

```ts
export const SCHEMAFLOW_DATABASE_NAME = 'SchemaFlow';
export const LEGACY_CHARTDB_DATABASE_NAME = 'ChartDB';
```

`createSchemaFlowDexie()` 默认打开 `SchemaFlow`。迁移函数检测旧 `ChartDB` 库，按当前 `SCHEMAFLOW_STORE_NAMES` 复制数据。迁移失败时不删除旧库，并抛出可诊断错误。

- [ ] **Step 2: Backup 新格式和旧格式解析**

新导出：

```ts
export const SCHEMAFLOW_BACKUP_FORMAT = 'schemaflow.backup';
export const SCHEMAFLOW_BACKUP_SOURCE = 'schemaflow-local';
export const LEGACY_CHARTDB_BACKUP_FORMAT = 'chartdb.backup';
export const LEGACY_CHARTDB_BACKUP_SOURCE = 'chartdb-local';
```

解析入口同时接受：

```text
schemaflow.backup
chartdb.backup
```

错误文案使用 `Invalid SchemaFlow backup file`，但解析入口必须能识别旧 `chartdb.backup`。

- [ ] **Step 3: Local config key 迁移**

新 key：

```text
schemaflow.ai.mode
schemaflow.ai.gateway.endpoint
schemaflow.ai.gateway.model
schemaflow.mobileCanvasNoticeDismissed
schemaflow.local_storage_probe
```

旧 key：

```text
chartdb.ai.mode
chartdb.ai.gateway.endpoint
chartdb.ai.gateway.model
chartdb.mobileCanvasNoticeDismissed
chartdb.local_storage_probe
```

读取函数先读新 key；新 key 为空时读旧 key；读到旧值后写入新 key。

- [ ] **Step 4: Storage 验证**

```bash
npm run test:ci -- src/storage/db src/storage/repositories src/storage/backup src/features/settings/__tests__ src/lib/ai/__tests__
```

Expected:

- 新导出的 backup 使用 `schemaflow.backup`。
- 旧 `chartdb.backup` fixture 仍可恢复。
- 新 localStorage key 被写入。
- 旧 key 只在迁移函数和兼容测试中出现。

### Task 5: SQL import/export、下载文件名和生成内容

**Files:**
- Modify: `src/lib/data/sql-import/**`
- Modify: `src/lib/data/sql-export/**`
- Modify: `src/dialects/**`
- Modify: `src/hooks/use-export-diagram.tsx`

- [ ] **Step 1: 改生成内容**

将 SQL export header 从：

```sql
-- Generated by SchemaFlow
```

改为：

```sql
-- Generated by SchemaFlow
```

下载文件名从 `SchemaFlow(<name>).json` 改为 `SchemaFlow(<name>).json`。

- [ ] **Step 2: 改 import/export 函数命名**

将 `convertToSchemaFlowDiagram` 改为 `convertToSchemaFlowDiagram`，同步更新测试和 dialect legacy adapter。

- [ ] **Step 3: 跑导入导出测试**

```bash
npm run test:ci -- src/lib/data/sql-import src/lib/data/sql-export src/dialects
```

Expected:

- 导入导出测试通过。
- 生成内容使用 SchemaFlow。

### Task 6: 静态资产、SEO、模板页和外链

**Files:**
- Move: `public/schemaflow.png` -> `public/schemaflow.png`
- Move: `public/SchemaFlow.gif` -> `public/SchemaFlow.gif`
- Modify: `src/helmet/helmet-data.tsx`
- Modify: `src/pages/templates-page/**`
- Modify: `src/pages/template-page/**`
- Modify: `src/pages/examples-page/**`
- Modify: `public/robots.txt`
- Modify: `public/sitemap.xml`

- [ ] **Step 1: 改资产文件和引用**

图片路径、OG image、Twitter image、sitemap、robots 必须使用 SchemaFlow 资产或新域名。

- [ ] **Step 2: 改模板页外链和 GitHub star iframe**

旧 `chartdb/chartdb` star iframe、`chartdb.io` 页面链接和旧社交 metadata 改为 SchemaFlow 对应值；若新域名未确认，发布 UI 使用已验证的 `Lynn-Lee/SchemaFlow` 仓库、docs 或 issues 链接。

- [ ] **Step 3: 跑 build 并做浏览器 smoke**

```bash
npm run build
npm run dev
```

Browser smoke:

- `/`
- `/templates`
- `/examples`
- editor page 首屏

Expected:

- 页面 title、meta、navbar、下载名和导出 header 均显示 SchemaFlow。
- 无 404 静态资产。
- 无明显 console error。

### Task 7: 中文文档、任务 ID、AGENTS 和阶段验收记录

**Files:**
- Move: `docs/ChartDB自动开发任务计划.md` -> `docs/SchemaFlow自动开发任务计划.md`
- Move: `docs/ChartDB重构优化产品设计与研发计划.md` -> `docs/SchemaFlow重构优化产品设计与研发计划.md`
- Move: `docs/ChartDB重构优化工程实施计划.md` -> `docs/SchemaFlow重构优化工程实施计划.md`
- Move: `docs/ChartDB全方位评估与后续优化手册.md` -> `docs/SchemaFlow全方位评估与后续优化手册.md`
- Modify: `AGENTS.md`
- Modify: `docs/阶段验收记录.md`
- Modify: `docs/*.md`

- [ ] **Step 1: 文档文件名和正文改名**

将正式项目名和文档路径改为 SchemaFlow。任务 ID 从 `CHARTDB-*` 改为 `SCHEMAFLOW-*`。

- [ ] **Step 2: 更新执行规则**

`AGENTS.md` 中：

- 项目身份改为 SchemaFlow。
- 唯一远端在新 GitHub repo 创建后改为 `https://github.com/Lynn-Lee/SchemaFlow.git`。
- automation ID 建议改为 `schemaflow-roadmap-dispatcher`。
- 核心文档路径更新为 SchemaFlow 文件名。

如果新远端尚未创建，先保留当前 remote 规则，并在文档中明确“远端改名待确认”，不得自行改 remote。

- [ ] **Step 3: 文档验证**

```bash
rg -n "SchemaFlow|schemaflow|SCHEMAFLOW" docs AGENTS.md
```

Expected:

- 正式文档不再出现旧品牌。
- 只有旧数据兼容说明允许出现旧值。

### Task 8: CI、release、Docker image 和仓库远端

**Files:**
- Modify: `.github/workflows/ci.yaml`
- Modify: `.github/workflows/publish.yaml`
- Modify: `.github/workflows/release.yaml`
- Modify: `.github/workflows/cla.yaml`

- [ ] **Step 1: 改 smoke tag 和容器名**

`chartdb-release-smoke` 改为 `schemaflow-release-smoke`。

- [ ] **Step 2: 改 release 目标**

GitHub package metadata、CLA Assistant 上游 repo、release-please 配置和 issue template 链接改到 SchemaFlow 对应仓库。

- [ ] **Step 3: 远端切换门禁**

只有在 `https://github.com/Lynn-Lee/SchemaFlow.git` 已存在且用户确认后，才执行：

```bash
git remote set-url origin https://github.com/Lynn-Lee/SchemaFlow.git
git ls-remote --heads origin main
```

Expected:

- `origin` 指向 SchemaFlow 新仓库。
- `origin/main` 可访问。

## 5. 全局验证门禁

改名完成后执行：

```bash
npm run lint
npm run test:ci
npm run build
git diff --check
npm audit --omit=dev --audit-level=high
rg -n "VITE_OPENAI_API_KEY|OPENAI_API_KEY|window\\.env|rehype-raw|dangerouslySetInnerHTML" src Dockerfile default.conf.template .github
```

再执行命名收敛审计：

```bash
rg -n "ChartDB|chartDB|chartdb|CHARTDB" --glob '!node_modules/**' --glob '!dist/**' --glob '!.git/**' --glob '!.codegraph/**'
```

Expected:

- 旧品牌只出现在 legacy compatibility 常量、旧格式解析、旧 key 迁移测试和本实施手册的历史说明中。
- 用户可见页面、文档标题、README、package、Docker tag、CI smoke、SEO metadata 全部使用 SchemaFlow。
- 新用户只写入 `schemaflow.*` runtime key 和 `SchemaFlow` IndexedDB。
- 老用户的 `ChartDB` IndexedDB、`chartdb.ai.*` 设置、`chartdb.backup` 文件可被读取或迁移。

## 6. 推荐提交顺序

1. `docs: add SchemaFlow rename implementation manual`
2. `chore: rename product package and public docs to SchemaFlow`
3. `chore: rename runtime config to SchemaFlow with legacy env support`
4. `refactor: rename ChartDB React context to SchemaFlow`
5. `refactor: rename storage modules with legacy data migration`
6. `refactor: rename SQL import export surfaces to SchemaFlow`
7. `docs: rename roadmap and acceptance docs to SchemaFlow`
8. `chore: rename CI release and Docker metadata to SchemaFlow`

每个提交都应能独立通过相关 focused tests；最终提交必须通过全局验证门禁。

## 7. 明确风险

- 直接全局替换会破坏旧 IndexedDB 数据库名、旧 backup 格式和旧 localStorage key。
- 远端仓库从 `ChartDB` 改为 `SchemaFlow` 需要先创建新 GitHub repo；在确认前不得自行改 remote。
- `CHANGELOG.md` 和历史 commit/issue 链接属于历史记录。若要求严格零旧品牌，也要替换；若保留历史真实性，则应加入 legacy allowlist。当前需求按“全部正式文档改名”为目标，历史链接在执行前需要最终确认。
- `schemaflow.io`、`app.schemaflow.io`、`docs.schemaflow.io`、`support@schemaflow.io` 没有已知 SchemaFlow 真实域名和邮箱；确认真实域名和邮箱前，外部链接不得写入发布 UI。
