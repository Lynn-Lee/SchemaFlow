# 安全政策

## 支持版本

当前仓库以 `main` 为唯一安全维护基线。历史提交、旧 fork、未合并实验分支和本地自动化过程文档不承诺安全修复。

SchemaFlow 优先处理以下类型的安全问题：

- 浏览器端持久化或暴露长期模型供应商 API key。
- 构建产物、Docker 镜像或 `/config.js` 泄露敏感配置。
- SQL、DBML、JSON、backup 或 Smart Query 导入导致页面崩溃、资源耗尽或数据污染。
- Markdown、备注、模板或导入内容造成脚本执行风险。
- Docker / Nginx 自托管配置缺少基础安全 header 或缓存边界。
- high 或 critical 级别生产依赖漏洞。

## 漏洞报告

如果发现安全问题，请不要在公开 issue 中披露可利用细节。建议通过 GitHub private vulnerability reporting 或项目维护者的私有渠道报告，并包含：

- 受影响的提交、版本或部署方式。
- 复现步骤。
- 影响范围。
- 是否涉及 IndexedDB diagram 数据、localStorage 设置、导入 schema 内容、Docker/Nginx runtime config、AI 辅助导出、Markdown 渲染或生成 SQL/DBML。
- 可行的缓解建议。

报告中不要包含真实生产数据库凭据、长期 API key、客户 schema、私有连接串或其他敏感数据。

## 隐私与数据边界

SchemaFlow 的默认产品模式是本地优先：

- 无需账号即可使用核心导入、编辑、保存和导出能力。
- diagram 默认保存到当前浏览器的 IndexedDB。
- 设置项默认保存到当前浏览器的 `localStorage`。
- Smart Query 由用户在自己的数据库环境中执行，SchemaFlow 不需要数据库密码。
- SQL、DBML、JSON 和 backup 导入默认在浏览器内处理。
- 导出默认在浏览器内生成文件。

除非用户显式启用 AI 辅助导出或自托管 Gateway，否则项目不应自动上传 schema 内容。

## AI 与模型配置

浏览器构建不得接收或持久化长期模型供应商 API key。允许的配置边界：

- `OPENAI_API_ENDPOINT` 和 `LLM_MODEL_NAME` 可作为非敏感 runtime hint。
- AI 辅助导出默认关闭。
- BYOK 只能作为会话级输入，不应写入长期持久化存储。
- 自托管 Gateway 应由部署方在服务端处理鉴权和供应商密钥。
- 日志、错误信息和 telemetry 不得包含完整 schema、表名、字段名、注释、默认值或用户输入的密钥。

## 非可信输入

以下输入都必须按非可信数据处理：

- 用户上传或粘贴的 SQL。
- DBML 文本或文件。
- Smart Query JSON。
- SchemaFlow backup 和旧 ChartDB backup。
- 模板数据。
- AI 辅助导出返回内容。

导入前应限制文件大小、文本长度、对象数量、字段数量、关系数量和字符串长度。解析失败时应返回可理解的错误，不应清空当前 diagram。

## Dependency Audit 策略

常规门禁：

```bash
npm audit --omit=dev --audit-level=high
```

处理规则：

- high 或 critical 生产依赖漏洞默认阻断发布。
- moderate 漏洞需要记录影响范围和是否有可行升级路径。
- 间接依赖短期无法安全升级时，需要记录风险接受原因和后续跟踪任务。
- 不为了消除 audit 告警而盲目进行大版本依赖升级。

## 安全开发要求

- 涉及输入解析、持久化、导入导出、AI、Docker/Nginx、Markdown 渲染或 runtime config 的变更必须配测试或 smoke 验证。
- 不在仓库提交密钥、token、真实 `.env`、生产数据库凭据、客户 schema 或私有服务地址。
- 新增第三方脚本、CDN 资源、外部 iframe 或 analytics event 前必须说明必要性和数据边界。
- Docker / Nginx 配置变更需要验证构建可用性和 `/config.js` 不缓存敏感配置。
