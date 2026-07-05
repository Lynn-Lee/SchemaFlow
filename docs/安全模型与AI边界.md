# 安全模型与 AI 边界

> 版本：v1.0
> 日期：2026-07-01
> 对应任务：`SCHEMAFLOW-P1-000`
> 文档定位：作为 Phase 1 安全重构的实施清单，约束密钥、AI、Markdown、Docker/Nginx 和剩余 advisory 的后续代码任务。

## 1. 安全目标

Phase 1 的目标是关闭当前最高风险面，让 SchemaFlow 的本地优先承诺可验证：

- 默认不把用户 schema、diagram、note 或导出内容发送到任何远端。
- 浏览器端不得持久化 AI API 密钥。
- Docker 构建产物和 `/config.js` 不输出 `OPENAI_API_KEY` 或其它服务端 secret。
- Note Markdown 不执行 raw HTML、事件属性或 `javascript:` URL。
- 自托管部署提供基础 CSP 和安全响应头。
- Phase 0 遗留的 low/moderate advisory 有清晰登记、影响范围和后续处置策略。

## 2. 本地优先数据边界

默认模式下，SchemaFlow 只在浏览器内处理数据：

- Diagram、table、relationship、area、note 和导入结果默认保存在 IndexedDB。
- Smart Query 仍由用户在自己的数据库环境中手动执行，SchemaFlow 不直接连接生产数据库。
- SQL、DBML、JSON backup、PNG、SVG 和 Markdown 导出默认在本地生成。
- 除用户明确启用 AI-assisted export 或自托管 Gateway 外，不发送 schema 摘要到模型服务。

后续任务不得为了简化实现引入账号登录、云端 diagram 存储、团队 Workspace、实时协作、在线评论、权限模型、计费、企业 SSO 或生产数据库直连。

## 3. AI Mode Contract

Phase 1 只允许三种 AI mode。

### 3.1 Disabled

默认模式。

- AI-assisted export 不可直接发起模型请求。
- deterministic SQL export 必须在不依赖 AI key 的情况下继续工作。
- 用户触发需要 AI 的路径时，应得到可展示的禁用说明和启用入口。

### 3.2 BYOK Session

用户自带密钥，仅保存在当前浏览器会话内。

- 密钥只允许存放在 module memory 或等价的运行时内存对象。
- 禁止写入 localStorage、sessionStorage、IndexedDB、URL、日志、backup 或导出文件。
- 页面刷新后密钥失效。
- 发起请求前必须提示会发送的 diagram 摘要范围，例如 table、field、relationship 数量和目标 endpoint。

### 3.3 Self-hosted Gateway

自托管用户可以配置自己的 Gateway endpoint，服务端持有模型 secret。

- 浏览器只保存 endpoint 和 model name 等非敏感配置。
- Gateway contract 应定义 timeout、rate limit、request size limit、requestId 和 warnings。
- Gateway 必须服务端保存 secret，并对请求和日志做 redaction。
- Phase 1 只定义前端 contract 和文档边界，不实现完整后端服务。

## 4. 密钥与运行时配置规则

禁止：

- 在 `Dockerfile` 中写入 `VITE_OPENAI_API_KEY` 到 `.env`。
- 在 `default.conf.template` 的 `/config.js` 中输出 `OPENAI_API_KEY`。
- 在前端源码中新增对长期 `OPENAI_API_KEY` 的读取、持久化或展示。
- 在构建产物中包含真实 `sk-` 密钥。

允许：

- 读取不含 secret 的 `OPENAI_API_ENDPOINT`。
- 读取不含 secret 的 `LLM_MODEL_NAME`。
- 读取 `DISABLE_ANALYTICS` 和 `HIDE_SCHEMAFLOW_CLOUD` 等非敏感配置。

## 5. Markdown 安全规则

Note Markdown 首轮采用禁用 raw HTML 的策略。

允许：

- heading、paragraph、list、bold、italic。
- inline code、fenced code。
- 安全链接。

禁止：

- `script`、`iframe`、`style` 和任意 raw HTML 执行。
- `onerror`、`onclick` 等事件属性。
- `javascript:`、`data:` 等高风险 URL 协议。
- `dangerouslySetInnerHTML` 绕过 React Markdown 安全边界。

链接协议首轮只允许 `http`、`https` 和 `mailto`。

## 6. Docker、Nginx 与 CSP

Phase 1 自托管安全头目标：

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- CSP 首轮以不破坏 Vite 静态资源和 Monaco 运行时为前提，先记录可执行策略和调整说明。

Docker smoke 应至少确认：

- 构建不依赖 `OPENAI_API_KEY`。
- Nginx 配置语法可读。
- 首页可返回基础安全头。

## 7. Phase 1 任务清单

| 任务 | 目标 | 关键验收 |
| --- | --- | --- |
| `SCHEMAFLOW-P1-001` | 移除 Dockerfile 和 `/config.js` 中的 API key 暴露 | 已完成：构建产物和运行时配置不输出 `OPENAI_API_KEY` |
| `SCHEMAFLOW-P1-002` | 增加 Disabled、BYOK Session、Gateway 三种 AI mode | 已完成：默认 Disabled，BYOK 不持久化密钥，BYOK/Gateway 请求前必须确认 schema transfer |
| `SCHEMAFLOW-P1-003` | Note Markdown 安全渲染 | 已完成：恶意 Markdown fixture 不执行 raw HTML 或危险链接 |
| `SCHEMAFLOW-P1-004` | Docker 和 Nginx 安全头 | 已完成：自托管镜像包含基础安全头，CSP 策略有文档说明 |
| `SCHEMAFLOW-P1-005` | Phase 1 安全审查 | 已完成：剩余风险按 High、Medium、Low 分类记录在 `docs/安全风险登记.md` |

## 8. 验证命令

Phase 1 文档清单验证：

```bash
rg -n "AI|BYOK|Gateway|Markdown|CSP|密钥" docs/安全模型与AI边界.md
```

Phase 1 代码任务默认验证：

```bash
npm run lint
npm run test:ci
npm run build
git diff --check
npm audit --omit=dev --audit-level=high
rg -n "VITE_OPENAI_API_KEY|OPENAI_API_KEY|window\\.env|rehype-raw|dangerouslySetInnerHTML" src Dockerfile default.conf.template .github
```

验收原则：

- `npm audit --omit=dev --audit-level=high` 必须通过。
- 安全扫描命中项必须被移除，或在 `SCHEMAFLOW-P1-005` 中逐项解释为非 secret、非执行风险。
- 不以引入账号登录、云端存储或团队权限作为安全修复手段。
