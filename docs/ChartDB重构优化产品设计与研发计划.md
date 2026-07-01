# ChartDB 重构优化产品设计与研发计划

> 版本：v1.0
> 日期：2026-07-01
> 重构仓库：`Lynn-Lee/ChartDB`
> 起始基线：本地评估版本 `c24936a`
> 文档定位：作为 ChartDB 后续安全加固、产品优化、架构重构和研发拆解的指导手册。

## 1. 背景与目标

ChartDB 当前是一个本地优先的 Web 端数据库图表编辑器，核心价值是用户无需安装服务端、无需提供数据库密码，通过 Smart Query、DDL、DBML 或模板快速得到数据库 ERD，并在浏览器内编辑、导出和备份。

本次重构不应改变这个核心价值。优化目标是把当前“可用的开源工具”升级为“安全、稳定、可维护、可扩展、可自托管”的数据库 schema 工作台。

### 1.1 当前主要问题

- AI API Key 存在暴露到浏览器的设计风险。
- 用户输入的 Markdown note 使用 raw HTML 渲染，存在 XSS 风险面。
- 生产依赖 high/critical advisory 已在 Phase 0 清零；仍有 low/moderate advisory 和开发依赖安全项需要后续安全治理。
- Phase 0 已恢复 `npm run test:ci`、`npm run build`、生产依赖 high audit 和 CI gate 基线；测试可信度后续通过新增 feature tests 持续维护。
- `ChartDBProvider`、Canvas、PostgreSQL importer、DBML exporter 等文件过大，职责耦合。
- IndexedDB 操作缺少统一 repository 和 diagram 级事务边界。
- 多数据库支持范围没有结构化 support matrix。
- AI export 与 deterministic export 的产品边界不清晰。
- 首次进入、导入、移动端和可访问性体验仍有明显缺口。
- Monaco、模板数据和 worker chunk 体积过大，首屏性能风险明显。

### 1.2 重构目标

- 保留默认无账号、无数据库密码、本地优先的使用方式。
- 明确本地模式、分享模式、云端协作模式的边界。
- 将安全风险先收敛到可接受状态，再推进大规模架构重构。
- 为每个数据库方言建立明确能力声明、测试 fixture 和 warning 机制。
- 让导入、编辑、导出、备份、恢复、AI、模板、设置等模块边界清晰。
- 把大 schema 的解析、布局和导出从主线程中解耦。
- 为后续可选账号登录、云同步、团队协作预留扩展点，但不把它们列入首轮必须完成范围。

## 2. 产品定位与模式边界

### 2.1 OSS Core 本地优先模式

本地优先模式是第一阶段重构的默认产品形态。

功能边界：

- 不需要账号。
- 不连接用户数据库。
- 不要求用户输入数据库密码。
- schema 数据默认仅存储在浏览器 IndexedDB。
- 支持本地创建、导入、编辑、导出、备份和恢复。
- AI 能力默认关闭，用户明确启用后才发送 schema 内容。

适用用户：

- 开发者快速理解数据库结构。
- 开源项目维护者生成 ERD。
- 团队离线讨论 schema。
- DBA 或架构师做轻量设计草图。

核心承诺：

- 用户数据默认不出浏览器。
- 所有高风险导出均需用户审查。
- 本地文件备份可迁移、可恢复。

### 2.2 本地分享模式

本地分享模式是 OSS Core 的增强形态，不要求服务端账号。

功能边界：

- 用户可以导出 JSON backup、DBML、SQL、PNG、SVG 或 Markdown schema doc。
- 用户可以通过文件、Git、内部文档系统自行分享。
- 应支持只读分享文件，例如 `chartdb.json` 或静态 HTML export。

不包含：

- 在线权限控制。
- 多人实时协作。
- 云端存储。
- 账号体系。

### 2.3 可选云端协作模式

云端协作模式是后续独立产品线，不作为 Phase 0 到 Phase 4 的默认范围。

可选能力：

- 账号登录。
- Workspace。
- Team。
- Diagram 云同步。
- 只读/编辑分享链接。
- 版本历史。
- 评论和审阅。
- 团队权限。

前置条件：

- 后端 API。
- 服务端鉴权。
- 云端数据库。
- 租户隔离。
- 审计日志。
- 冲突解决策略。
- 数据导出和删除机制。

原则：

- OSS Core 不依赖账号。
- 登录能力不得破坏本地模式。
- 云同步必须用户主动启用。

## 3. 用户角色与核心场景

### 3.1 开发者

目标：

- 快速导入项目数据库。
- 查看表、字段、索引和关系。
- 修改草图并导出 DBML 或 SQL。

关键需求：

- 导入流程简单。
- 错误信息可理解。
- 大 schema 不明显卡顿。
- 导出结果可审查。

### 3.2 DBA / 数据架构师

目标：

- 审查 schema 设计。
- 识别缺失关系、错误索引和复杂依赖。
- 生成文档或分享给团队。

关键需求：

- 多 schema 支持。
- 视图、物化视图、自定义类型、check constraint 能被保留。
- diff 和版本迁移可审查。
- 支持按 schema、area、tag 组织。

### 3.3 开源项目维护者

目标：

- 为项目文档生成 ERD。
- 维护 schema 示例。
- 将图表嵌入 README 或 docs。

关键需求：

- SVG/PNG 导出可靠。
- Markdown schema doc 导出。
- 无账号、无服务端。
- 备份文件可放入 Git。

### 3.4 团队协作者

目标：

- 查看、评论、审阅 schema。
- 在团队内共享图表。

关键需求：

- 首轮通过文件分享满足。
- 后续可通过 Cloud/Team 提供权限和协作。

## 4. 功能模块设计

### 4.1 首次进入与新建流程

#### 当前问题

- 首屏直接弹出数据库选择，任务入口单一。
- 数据库选择 radio 可访问名称不唯一。
- 空白图按钮禁用时缺少原因说明。
- 移动端首屏创建入口弱。

#### 目标体验

首次进入显示三个主要入口：

- 导入现有数据库。
- 创建空白图。
- 查看模板示例。

桌面端可以使用居中向导。移动端需要使用全屏底部操作区，保证用户在第一屏能看到下一步动作。

#### 功能设计

入口一：导入现有数据库

- 用户选择数据库类型。
- 用户选择导入方式。
- 用户进入对应导入向导。

入口二：创建空白图

- 用户选择数据库类型。
- 系统创建一个空 diagram。
- 默认进入 table 面板和画布。

入口三：查看模板示例

- 用户进入模板列表。
- 可按数据库和标签筛选。
- 可 clone 成本地图。

#### 交互状态

- 未选择数据库：继续按钮 disabled，并提示“请选择数据库类型”。
- 选择数据库后：继续按钮可用。
- 点击返回：保留上一步选择。
- 创建失败：展示错误 toast，并不创建半成品 diagram。

#### 验收标准

- 所有数据库选项有唯一 `aria-label`。
- 键盘可完成数据库选择和继续。
- 移动端第一屏包含明确创建或导入 CTA。
- README、UI、support matrix 的数据库列表一致。

### 4.2 Diagram 管理

#### 当前问题

- Diagram 数据散落在 IndexedDB 多张表中。
- 删除 diagram 依赖多次删除操作，没有统一事务。
- 打开和删除图表缺少健康检查。

#### 目标体验

用户可以清晰管理本地图：

- 新建 diagram。
- 打开 diagram。
- 重命名 diagram。
- 复制 diagram。
- 删除 diagram。
- 导出 backup。
- 从 backup 恢复。

#### 功能设计

Diagram 列表字段：

- 名称。
- 数据库类型。
- 表数量。
- 关系数量。
- 最近更新时间。
- 本地 schema version。

Diagram 操作：

- Open。
- Rename。
- Duplicate。
- Export backup。
- Delete。
- Repair。

删除流程：

- 显示 diagram 名称和对象数量。
- 二次确认。
- 使用 storage transaction 删除 diagram 及其关联对象。
- 删除完成后更新默认 diagram。

#### 验收标准

- 删除 diagram 后无孤儿 table、relationship、area、note、custom type。
- 打开损坏 diagram 时进入 repair flow，而不是白屏。
- Duplicate 后 ID 全部重新生成，关系引用保持正确。

### 4.3 Smart Query 导入

#### 当前问题

- 用户需要复制长 SQL。
- 粘贴结果为空时仅禁用按钮。
- JSON 修复逻辑存在，但错误没有产品化呈现。
- 结果中包含 schema 元数据，隐私提示不足。

#### 目标体验

Smart Query 是安全、明确、可预览的五步向导：

1. 选择数据库和版本。
2. 复制 Smart Query。
3. 在用户数据库客户端执行。
4. 粘贴查询结果。
5. 预览并确认导入。

#### 功能设计

Step 1：选择数据库

- 数据库类型。
- 数据库 edition，例如 Supabase、Timescale、Cloudflare D1。
- 是否包含 views。
- 是否包含 indexes。
- 是否包含 check constraints。
- 是否包含 custom types。

Step 2：复制 query

- 展示 DB Client 和 CLI 两种运行方式。
- 复制按钮必须有可访问名称。
- 复制成功显示状态。
- Query 区域只读。

Step 3：粘贴结果

- 粘贴区域有明确 label，例如“Smart Query JSON Output”。
- 支持 JSON、CSV 包裹 JSON、转义 JSON。
- 输入为空时提示“请粘贴查询结果”。

Step 4：解析校验

- 解析成功后展示摘要：
  - tables 数量。
  - views 数量。
  - fields 数量。
  - indexes 数量。
  - relationships 数量。
  - custom types 数量。
- 解析失败展示：
  - 错误类型。
  - 错误位置。
  - 建议修复方式。

Step 5：导入预览

- 可选择导入全部或部分 table/view。
- 可选择覆盖当前图或追加到当前图。
- 默认追加时自动偏移位置，避免覆盖已有对象。

#### 验收标准

- 不合法 JSON 不会关闭弹窗或污染图表。
- 导入前必须展示摘要。
- 用户可以取消导入。
- Smart Query 页面明确说明 ChartDB 不连接数据库。

### 4.4 SQL DDL 导入

#### 当前问题

- 各数据库方言 parser 支持不均。
- Unsupported statement 可能被忽略。
- 用户不知道解析可信度。

#### 目标体验

DDL 导入必须输出结构化结果和 warning。用户应知道哪些对象被识别，哪些对象被跳过。

#### 功能设计

统一 importer contract：

```ts
export interface SchemaImporter {
    dialect: DatabaseType;
    capabilities: ImportCapabilityMatrix;
    parse(input: string): Promise<ImportResult>;
}

export interface ImportResult {
    diagram: Diagram;
    warnings: ImportWarning[];
    unsupportedStatements: UnsupportedStatement[];
    diagnostics: ImportDiagnostic[];
    confidence: 'high' | 'medium' | 'low';
}
```

Importer 支持对象：

- CREATE TABLE。
- ALTER TABLE ADD COLUMN。
- ALTER TABLE ADD CONSTRAINT。
- PRIMARY KEY。
- FOREIGN KEY。
- UNIQUE。
- INDEX。
- CHECK。
- COMMENT。
- VIEW。
- MATERIALIZED VIEW。
- ENUM。
- COMPOSITE TYPE。

不支持对象必须进入 warning：

- Function。
- Trigger。
- Policy。
- RLS。
- Procedure。
- Extension-specific object。

#### 验收标准

- 每个方言都有 fixture tests。
- 跳过对象必须在 preview 中显示。
- 低 confidence 导入必须要求用户确认。
- 导入失败不会修改当前 diagram。

### 4.5 DBML 导入、编辑与导出

#### 当前问题

- 当前测试基线失败。
- DBML round-trip 风险高。
- 错误提示偏工程化。

#### 目标体验

DBML 是一等交换格式，支持导入、导出、编辑、应用变更和 round-trip 校验。

#### 功能设计

DBML 功能：

- Import DBML。
- Export DBML。
- Edit DBML。
- Apply DBML changes。
- Preview DBML diff。
- DBML round-trip check。

DBML 编辑器：

- Monaco 按需加载。
- 编辑器 label 区分用途，例如“DBML editor”。
- 语法错误显示行列。
- 保存前 preview diff。

DBML 应用策略：

- 默认保留现有 table/field/relationship ID。
- 新对象生成新 ID。
- 删除对象进入 preview，由用户确认。

#### 验收标准

- `npm run test:ci` 通过。
- DBML import/export golden tests 通过。
- 修改 DBML 后可预览新增、删除、修改对象。
- DBML 编辑器不进入首屏 bundle。

### 4.6 表、字段、索引和约束编辑

#### 当前问题

- 编辑逻辑集中在 Provider 和 UI 组件中。
- Field、Index、Check Constraint 修改缺少统一 command。
- 多对象联动容易产生引用不一致。

#### 目标体验

用户可以可靠编辑数据库模型对象，并随时撤销、重做、导出。

#### 功能设计

Table 功能：

- 创建 table。
- 重命名 table。
- 修改 schema。
- 修改 comment。
- 修改颜色。
- 标记 view/materialized view。
- 删除 table。

Field 功能：

- 新增 field。
- 重命名 field。
- 修改类型。
- 修改 nullable。
- 修改 default value。
- 修改 primary key。
- 修改 unique。
- 修改 comment。
- 删除 field。

Index 功能：

- 新增 index。
- 修改 index name。
- 修改 unique。
- 修改 index type。
- 修改字段顺序。
- 删除 index。

Check Constraint 功能：

- 新增 check。
- 修改表达式。
- 校验表达式格式。
- 删除 check。

#### Command 设计

所有编辑动作通过 command：

```ts
export interface DiagramCommand<TPayload = unknown> {
    id: string;
    type: string;
    payload: TPayload;
    createdAt: string;
}
```

Command 执行流程：

- validate。
- apply in memory。
- persist in transaction。
- push undo stack。
- emit event。

#### 验收标准

- 删除 field 时相关 relationship 和 index 引用被处理。
- 删除 table 时相关 relationship、dependency、note anchor 被处理。
- 所有核心编辑动作可 undo/redo。
- 每个 command 有单元测试。

### 4.7 关系编辑

#### 当前问题

- 关系方向和 cardinality 对用户不够直观。
- 关系线重叠会造成误解。
- 删除关联字段时关系处理需要更强约束。

#### 目标体验

用户可以清晰创建和理解表之间关系。

#### 功能设计

关系创建方式：

- 从字段拖拽到字段。
- 在关系弹窗中选择 source/target。
- 从 table context menu 创建关系。

关系属性：

- source table。
- source field。
- target table。
- target field。
- source cardinality。
- target cardinality。
- constraint name。
- on update。
- on delete。

关系可视化：

- hover 高亮两端字段。
- selected 高亮关系线。
- 显示 cardinality label。
- 关系冲突或缺失字段显示 warning。

#### 验收标准

- 自引用关系可创建、可展示、可导出。
- 复合外键可被表示。
- 删除字段前提示影响关系。
- 重叠关系线在示例中不造成明显误读。

### 4.8 自定义类型、枚举和数据库扩展对象

#### 当前问题

- 自定义类型存在模型，但 UI 和导入导出的覆盖不均。
- PostgreSQL enum/composite 支持需要能力矩阵化。

#### 目标体验

用户可以查看和编辑数据库自定义类型，并理解其对字段的影响。

#### 功能设计

Custom Type 类型：

- Enum。
- Composite。
- Domain-like type。
- Generic unsupported type placeholder。

功能：

- 查看 custom type 列表。
- 新增 enum。
- 修改 enum values。
- 查看使用该 type 的字段。
- 删除前检查引用。
- 导出到 SQL/DBML。

#### 验收标准

- 删除被字段引用的 custom type 需要确认。
- PostgreSQL enum round-trip 测试通过。
- Unsupported custom type 不静默丢失。

### 4.9 画布编辑

#### 当前问题

- Canvas 组件过大。
- 移动端操作入口不清楚。
- 大 schema 可能造成主线程压力。

#### 目标体验

画布是高密度、稳定、可扫描的 schema 工作区。

#### 功能设计

画布能力：

- 平移。
- 缩放。
- 框选。
- 多选。
- 拖拽 table。
- 自动布局。
- 按 schema 分组。
- 按 area 分组。
- 关系线高亮。
- minimap。
- fit view。
- 搜索定位 table。

拆分模块：

- `CanvasViewport`。
- `CanvasToolbar`。
- `CanvasNodeLayer`。
- `CanvasEdgeLayer`。
- `CanvasSelection`。
- `CanvasContextMenu`。
- `AutoLayoutService`。
- `AreaLayoutService`。

移动端策略：

- 底部浮动主操作按钮。
- 显式“添加表 / 导入 / 搜索”入口。
- 长按打开 context menu。
- 复杂编辑弹窗全屏展示。

#### 验收标准

- 100 tables / 500 fields 可流畅操作。
- 500 tables 进入 degraded mode，不冻结页面。
- 自动布局可取消。
- 移动端第一屏可找到新增或导入入口。

### 4.10 Area、Note 和视觉标注

#### 当前问题

- Note Markdown raw HTML 渲染风险已在 `CHARTDB-P1-003` 关闭，后续仍需保持回归测试。
- Area 和 Note 与 schema 对象的语义关系不够明确。

#### 目标体验

Area 和 Note 用于团队沟通、模块分组和文档补充，不应引入安全风险。

#### 功能设计

Area：

- 创建 area。
- 重命名 area。
- 修改颜色。
- 调整大小。
- 移动 area。
- 将 table 移入 area。
- area 内自动排列。

Note：

- 创建 note。
- 编辑 Markdown。
- 渲染 safe Markdown。
- 禁止 raw HTML 或仅允许安全 allowlist。
- 支持链接，但链接必须安全处理。
- 支持删除和颜色调整。

#### 验收标准

- `<script>`、事件属性、危险 URL 不会执行。
- Note 编辑和预览可键盘操作。
- Area 删除不删除其中 table，除非用户明确选择。

### 4.11 导出功能

#### 当前问题

- 同方言 deterministic export 与 AI export 边界不清。
- SVG 导出需要修复为真正 SVG。
- 跨方言转换可信度需要说明。

#### 目标体验

导出分为确定性导出和 AI 辅助导出。

确定性导出：

- Same dialect SQL。
- DBML。
- JSON backup。
- PNG。
- SVG。
- Markdown schema doc。

AI 辅助导出：

- 跨方言 SQL draft。
- Migration draft。
- SQL review suggestions。

AI 辅助导出必须显示：

- 输入摘要。
- 目标方言。
- 不支持对象。
- 风险提示。
- 人工审查提醒。

#### 验收标准

- 同方言 SQL 不调用 AI。
- AI 失败不影响 deterministic export。
- SVG 文件可被浏览器和设计工具打开为 SVG。
- 导出结果文件名稳定且可读。

### 4.12 备份、恢复和版本迁移

#### 当前问题

- 备份恢复不是结构化产品流程。
- IndexedDB migration 内联在 Provider。
- 缺少备份 schema version。

#### 目标体验

用户可以安全迁移本地数据。

#### 功能设计

Backup 文件结构：

```json
{
  "format": "chartdb.backup",
  "formatVersion": 1,
  "appVersion": "1.20.1",
  "createdAt": "2026-07-01T00:00:00.000Z",
  "diagram": {}
}
```

恢复流程：

- 选择 backup 文件。
- 校验格式。
- 展示 diagram 摘要。
- 选择作为新图导入或覆盖当前图。
- 执行恢复。

Migration：

- 独立 `StorageMigrationRunner`。
- 每个 migration 有测试。
- 支持 health check。

#### 验收标准

- 恢复前有 preview。
- 格式不匹配时错误清晰。
- migration 从旧版本到当前版本有自动化测试。
- 恢复失败不破坏现有 diagram。

### 4.13 模板和示例

#### 当前问题

- 模板数据和图片进入 bundle，影响性能。
- 模板 metadata 管理分散。

#### 目标体验

模板应作为按需加载的 schema 示例库。

#### 功能设计

Template manifest：

```ts
export interface TemplateManifest {
    id: string;
    name: string;
    dialect: DatabaseType;
    tags: string[];
    featured: boolean;
    thumbnailLight: string;
    thumbnailDark: string;
    loadDiagram: () => Promise<Diagram>;
}
```

模板页面：

- Featured。
- 按数据库筛选。
- 按标签筛选。
- 搜索。
- 详情页。
- Clone to local。

#### 验收标准

- 首屏不加载所有模板 diagram。
- 模板详情页才加载完整数据。
- 模板图片压缩。
- templates chunk 明显下降。

### 4.14 设置中心

#### 当前问题

- 本地配置散落在 LocalConfigProvider。
- AI、隐私、显示、快捷键、数据管理没有统一入口。

#### 目标体验

设置中心统一管理用户偏好和本地数据。

设置项：

- Theme。
- Language。
- Scroll action。
- Show cardinality。
- Show field attributes。
- Show DB views。
- Show minimap。
- AI mode。
- Analytics。
- Local data management。
- Keyboard shortcuts。

#### 验收标准

- 设置项有说明。
- 改动即时生效。
- localStorage 写入有容错。
- 设置导入导出不包含 secret。

### 4.15 多语言与可访问性

#### 当前问题

- 多个 locale 文件存在未完成翻译标记。
- 按钮和编辑器可访问名称不完整。

#### 目标体验

核心流程必须满足键盘和屏幕阅读器可用。

可访问性要求：

- 所有 icon button 有 `aria-label`。
- 所有 radio 有唯一名称。
- 所有 Monaco editor 有用途 label。
- Dialog focus trap 正确。
- Toast 内容可被辅助技术感知。
- Disabled 状态有原因。

多语言策略：

- 核心语言完整维护。
- 未完成语言标记 experimental。
- 禁止在正式 locale 中保留未完成翻译标记。

#### 验收标准

- axe smoke 无 critical/serious。
- 键盘可完成导入、建表、导出。
- locale placeholder 清零或被标记为 experimental。

### 4.16 AI 能力

#### 当前问题

- API Key 可能暴露到浏览器。
- AI export 发送 schema，隐私提示不足。
- 无成本、速率和超时保护。

#### 目标体验

AI 是可选增强能力，默认关闭。

AI 模式：

- Disabled：默认。
- BYOK Session：用户临时输入 key，仅保存在内存。
- Self-hosted Gateway：自托管后端代理调用模型。

AI Gateway 能力：

- API key 只在服务端。
- Rate limit。
- Timeout。
- Abort。
- Request size limit。
- 日志脱敏。
- 模型配置。
- 错误映射。

前端提示：

- 发送前展示将发送的 schema 摘要。
- 用户确认后才调用。
- 输出标记为 draft。

#### 验收标准

- 浏览器 bundle 和 `/config.js` 不包含 secret。
- AI 请求前有隐私确认。
- AI 失败时有可理解错误。
- AI 输出不会自动覆盖用户 diagram。

### 4.17 可选账号登录和云端协作

#### 范围说明

账号登录不属于首轮重构默认能力。首轮只做架构预留。

后续功能：

- Email/password 登录。
- OAuth。
- Workspace。
- Team。
- Diagram 云同步。
- 分享链接。
- 权限控制。
- 版本历史。
- 评论。

关键设计：

- 本地 diagram 和云端 diagram 分离标识。
- 用户主动开启同步。
- 冲突时进入 diff merge。
- 分享链接默认只读。

#### 验收标准

- 不登录仍可完整使用 OSS Core。
- 登录后不会自动上传历史本地数据。
- 用户可删除云端数据。

## 5. 技术架构设计

### 5.1 推荐目录结构

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

### 5.2 分层原则

- `schema-core` 不依赖 React。
- `dialects` 不依赖 UI。
- `storage` 不依赖 React component。
- `features` 编排流程。
- `ui` 只承载通用组件。
- `workers` 处理重解析、布局和导出。
- `ai` 不直接持有 secret，secret 只在 gateway 或 session memory。

### 5.3 Domain Model 重构

核心实体：

- `Diagram`。
- `DBTable`。
- `DBField`。
- `DBIndex`。
- `DBRelationship`。
- `DBDependency`。
- `DBCustomType`。
- `DBCheckConstraint`。
- `Area`。
- `Note`。

新增领域服务：

- `DiagramValidator`。
- `RelationshipResolver`。
- `IndexNormalizer`。
- `SchemaDiffService`。
- `CommandExecutor`。
- `ImportPreviewService`。
- `ExportPlanService`。

### 5.4 Storage 重构

Repository：

- `DiagramRepository`。
- `TableRepository`。
- `RelationshipRepository`。
- `DependencyRepository`。
- `AreaRepository`。
- `CustomTypeRepository`。
- `NoteRepository`。
- `ConfigRepository`。

事务服务：

- `DiagramTransactionService`。

事务场景：

- 删除 diagram。
- 清空 diagram。
- restore backup。
- apply import preview。
- apply DBML changes。

### 5.5 Importer / Exporter 插件化

Importer：

```ts
export interface SchemaImporter {
    dialect: DatabaseType;
    capabilities: ImportCapabilityMatrix;
    parse(input: string): Promise<ImportResult>;
}
```

Exporter：

```ts
export interface SchemaExporter {
    dialect: DatabaseType;
    mode: 'deterministic' | 'ai-assisted';
    export(diagram: Diagram, options: ExportOptions): Promise<ExportResult>;
}
```

Capability Matrix：

- tables。
- fields。
- indexes。
- relationships。
- comments。
- check constraints。
- views。
- materialized views。
- custom types。
- schemas。
- extensions。

支持等级：

- `full`。
- `partial`。
- `experimental`。
- `unsupported`。

## 6. 研发路线图

### Phase 0：基线修复

周期：1 周。

目标：

- 让项目恢复可信 CI 和安全基线。

任务：

- 修复 `npm run test:ci`。
- 升级 critical/high 安全依赖。（已完成生产依赖 high/critical 基线）
- 加入 `npm audit --omit=dev` CI gate。（已完成 PR CI 和 tag publish 门禁）
- 补充 `SECURITY.md`。
- README 标记当前 AI key 暴露风险。
- 建立风险登记文档。

验收：

- `npm run build` 通过。
- `npm run test:ci` 通过。
- 生产依赖 high advisory 清零，或有明确风险豁免记录。

### Phase 1：安全重构

周期：1 到 2 周。

目标：

- 关闭最高风险安全面。

任务：

- 编写 Phase 1 安全实施清单。（已完成，见 `docs/安全模型与AI边界.md`）
- 移除浏览器暴露 OpenAI key。（已完成，Docker 构建和 `/config.js` 不再输出 API key）
- 新增 AI Disabled / BYOK Session / Self-hosted Gateway 模式。（已完成 mode gate；完整设置 UI 后续进入设置中心任务）
- Note Markdown sanitize。（已完成，raw HTML 不再渲染为真实 DOM，链接仅允许 `http`、`https`、`mailto`）
- Nginx 增加 CSP 和安全响应头。（已完成，静态页面和 `/config.js` 均返回基础安全头）
- 完成 Phase 1 安全审查。（已完成，见 `docs/安全风险登记.md`；无开放 high/critical 风险）
- CLA workflow 权限收敛。（延后到发布治理阶段）
- Docker runtime config 不输出 secret。（已完成，`/config.js` 仅输出非敏感 endpoint、model 和开关，并设置 no-store）

验收：

- 浏览器无法读到服务端 API key。
- Markdown XSS 测试通过。
- Docker smoke 通过。
- AI export 有隐私确认。

### Phase 2：Schema Core 与 Command

周期：2 到 3 周。

当前状态：`CHARTDB-P2-000` 已完成，`docs/schema-core设计.md` 已定义旧类型映射、command contract、validator、diff 和 undo/redo 兼容层。下一步从 `CHARTDB-P2-001` 开始建立 `src/schema-core/model` 出口，不改变用户可见行为。

目标：

- 解耦 `ChartDBProvider`。

任务：

- 抽出 `schema-core/model`。
- 抽出 `schema-core/commands`。
- 建立 `DiagramCommand`。
- 改造 add/update/delete table、field、relationship、note、area。
- undo/redo 改为 command based。

验收：

- `ChartDBProvider` 行数显著下降。
- 核心编辑动作有单元测试。
- undo/redo 覆盖核心对象。
- 编辑失败不产生半持久化状态。

### Phase 3：Storage 与备份恢复

周期：1 到 2 周。

目标：

- 让本地数据可靠。

任务：

- 抽 Dexie repositories。
- 抽 migration runner。
- diagram 删除和恢复使用 transaction。
- 新增 backup/restore service。
- 新增 storage health check。

验收：

- migration 测试覆盖旧版本到当前版本。
- 删除 diagram 无孤儿记录。
- backup 可恢复完整 diagram。
- corrupted backup 有明确错误。

### Phase 4：Importer / Exporter 插件化

周期：3 到 4 周。

目标：

- 让多数据库支持可扩展、可声明、可测试。

任务：

- 定义 importer/exporter contract。
- 每个 dialect 输出 capability matrix。
- 拆 PostgreSQL importer。
- MySQL、MariaDB、SQL Server、SQLite、Oracle、ClickHouse 对齐接口。
- DBML import/export 统一到 pipeline。
- 所有导入进入 preview。

验收：

- 每个 dialect 有 fixture tests。
- Unsupported statement 被报告。
- 导入不会直接污染当前 diagram。
- 支持矩阵自动生成文档。

### Phase 5：产品体验与可访问性

周期：2 周。

目标：

- 降低首次使用门槛，补齐可访问性。

任务：

- 重做首次进入流程。
- 优化 Smart Query wizard。
- 所有 icon button 补 `aria-label`。
- Disabled 状态解释。
- 移动端首屏 CTA。
- 设置中心。
- i18n placeholder 清理。

验收：

- 桌面和移动端 smoke 通过。
- axe 无 critical/serious。
- 键盘可完成导入、建表、导出。
- 导入错误提示可被普通用户理解。

### Phase 6：性能优化

周期：2 周。

目标：

- 降低首屏包体和大 schema 卡顿。

任务：

- Monaco 懒加载。
- 语言 worker 按需加载。
- Templates lazy registry。
- Parser 和 layout 放 Web Worker。
- Bundle budget。
- 大 schema degraded mode。

验收：

- 主入口 chunk 明显下降。
- 首屏不加载全部模板。
- 100 tables 流畅。
- 500 tables 不冻结浏览器。
- CI 监控 bundle size。

### Phase 7：发布治理与文档

周期：1 周。

目标：

- 让项目可维护、可发布、可交付。

任务：

- 更新 README。
- 新增 architecture doc。
- 新增 dialect support matrix。
- 新增 AI/privacy doc。
- tag publish 跑 tests/audit/docker smoke。
- Dependabot 安全 PR 策略。
- Release checklist。

验收：

- 发布流程阻断 failing tests。
- Docker image 可启动。
- 文档覆盖本地、Docker、自托管 AI gateway。
- Issue template 引导用户提供 dialect 和输入样例。

### Phase 8：可选 Cloud/Team

周期：独立规划，不进入首轮。

目标：

- 在 OSS Core 稳定后增加账号、同步和协作。

任务：

- 后端 API。
- 账号登录。
- Workspace。
- Diagram 云同步。
- 分享权限。
- 版本历史。
- 审计日志。

验收：

- 不登录仍可完整使用 OSS Core。
- 用户主动开启云同步。
- 分享链接默认只读。
- 云端数据可导出和删除。

## 7. 测试策略

### 7.1 单元测试

覆盖：

- schema-core model。
- commands。
- validators。
- importers。
- exporters。
- storage migration。
- backup/restore。
- AI prompt builder。

要求：

- 每个 command 有成功和失败测试。
- 每个 dialect 有 fixture tests。
- 每次 bugfix 增加 regression test。

### 7.2 集成测试

覆盖：

- Smart Query JSON 导入。
- SQL DDL 导入。
- DBML 导入导出。
- Backup restore。
- Delete diagram transaction。
- Apply import preview。

要求：

- 使用真实 diagram fixture。
- 校验对象数量和引用完整性。

### 7.3 E2E 测试

核心路径：

- 首次进入，创建空白图。
- Smart Query 导入示例。
- 添加 table 和 field。
- 创建 relationship。
- 导出 DBML。
- 导出 PNG/SVG。
- Backup restore。

要求：

- 桌面 viewport。
- 移动 viewport。
- 键盘路径。

### 7.4 安全测试

覆盖：

- Markdown XSS。
- Dangerous URL。
- Raw HTML。
- AI key 不暴露。
- CSP 生效。
- Backup restore prototype pollution。
- Import parser ReDoS 输入。

### 7.5 性能测试

数据集：

- Small：10 tables。
- Medium：100 tables。
- Large：500 tables。
- Extra Large：1000 tables。

指标：

- 首屏加载时间。
- 导入解析时间。
- 自动布局时间。
- 画布交互 FPS。
- 主线程长任务。
- Bundle size。

## 8. 验收指标

### 8.1 安全指标

- 浏览器不可读取服务端 AI key。
- 生产依赖 high advisory 清零或有记录化豁免。
- Markdown XSS 测试通过。
- CSP 在 Docker 环境启用。

### 8.2 稳定性指标

- `npm run build` 通过。
- `npm run test:ci` 通过。
- 核心 E2E 通过。
- IndexedDB migration 测试通过。

### 8.3 产品指标

- 首次用户 3 步内能创建或导入 diagram。
- 导入失败原因可见。
- 导出类型和风险分级清晰。
- 移动端可完成基本查看和新增操作。

### 8.4 性能指标

- 首屏不加载 Monaco 完整语言包。
- 模板 diagram 按需加载。
- 100 tables 可流畅编辑。
- 500 tables 不冻结浏览器。

### 8.5 可维护性指标

- `ChartDBProvider` 不再承载大部分业务逻辑。
- 每个 dialect 单独测试。
- Storage 层 repository 化。
- Import/export contract 稳定。

## 9. 不纳入首轮范围

以下能力不建议进入 Phase 0 到 Phase 4：

- 账号登录。
- 多人实时协作。
- 在线评论。
- 云端 diagram 存储。
- 复杂权限模型。
- 计费。
- 企业 SSO。
- 数据库直连。
- 自动执行 migration。
- 生产数据库 DDL 自动应用。

原因：

- 当前最高风险是安全、测试、架构和导入导出可靠性。
- 账号和协作会引入后端、权限、租户隔离和数据合规复杂度。
- 在 OSS Core 未稳定前引入云端能力会扩大风险面。

## 10. 推荐执行顺序

第一优先级：

1. 建立 schema-core。
2. 抽离 storage / repository 边界。
3. 拆分 importer/exporter 方言能力。
4. 改善首次进入和设置中心体验。
5. 处理 Monaco、模板和 worker chunk 性能问题。

第二优先级：

1. Command 架构。
2. Storage transaction。
3. Importer/exporter contract。
4. Smart Query wizard。
5. Support matrix。

第三优先级：

1. 性能拆包。
2. Web Worker。
3. 移动端体验。
4. i18n 完整性。
5. 可选 Cloud/Team。

## 11. 文档交付物清单

重构过程中建议逐步新增：

- `docs/architecture.md`。
- `docs/security.md`。
- `docs/privacy-and-ai.md`。
- `docs/dialect-support-matrix.md`。
- `docs/import-export-contract.md`。
- `docs/storage-migrations.md`。
- `docs/release-checklist.md`。
- `docs/testing-strategy.md`。

## 12. 最小里程碑定义

### M1：安全可用版

- 测试通过。
- 无 key 暴露。
- 无 high 生产依赖 advisory。
- Markdown sanitize。
- Docker 可启动。
- Phase 1 安全风险完成 High、Medium、Low 分级登记。

### M2：架构可维护版

- Command core。
- Storage repository。
- Transaction delete。
- Importer/exporter contract。

### M3：产品体验版

- 新导入 wizard。
- 支持矩阵。
- 移动端核心入口。
- Accessibility smoke。

### M4：性能稳定版

- Monaco/template 拆包。
- Worker 化解析和布局。
- Bundle budget。
- 大 schema degraded mode。

### M5：可选云端版

- 登录。
- Workspace。
- 云同步。
- 分享权限。
- 审计与租户隔离。

## 13. 结论

ChartDB 的第一阶段重构应聚焦 OSS Core：安全、测试、架构、导入导出可靠性和本地体验。账号登录和云协作可以作为后续商业化或团队版方向，但不应抢在安全基线和架构边界之前。

最务实的推进方式是先完成 Phase 0 和 Phase 1，让当前项目变成安全可继续开发的状态；随后用 Phase 2 到 Phase 4 重塑核心架构；最后再做产品体验、性能和可选云端能力。
