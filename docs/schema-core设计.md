# schema-core 设计

> 任务：`SCHEMAFLOW-P2-000`
> 阶段：Phase 2 Schema Core 与 Command 架构
> 状态：执行清单已定义，后续从 `SCHEMAFLOW-P2-001` 开始编码。

## 1. 目标

`schema-core` 是 SchemaFlow 后续 diagram 编辑的纯领域层。它负责统一模型、command、validator、diff 和 undo/redo contract，让 React Provider、Dexie、Canvas、SQL importer/exporter 不再各自维护一套隐式业务规则。

本阶段不改变用户可见能力，不新增账号、云端 diagram 存储、团队协作、权限、计费或生产数据库直连。Phase 2 的首要目标是建立兼容层，逐步把现有编辑动作迁入可测试的纯函数。

## 2. 边界

### 2.1 允许进入 schema-core

- Diagram、Table、Field、Index、Relationship、Area、Note、CustomType 等纯 domain type。
- 编辑命令的输入、输出、校验结果、风险 metadata。
- 纯函数 validator、diff、apply command。
- undo/redo 所需的 inverse command 或 undo payload。
- 不依赖浏览器 API 的 fixture 与单元测试。

### 2.2 不允许进入 schema-core

- React component、hook、context provider。
- Dexie、IndexedDB、localStorage、sessionStorage。
- Monaco、XYFlow、DOM、Canvas、window、document。
- Nginx、Docker、AI provider SDK、网络请求。
- 用户登录、Workspace、权限模型或云端同步逻辑。

## 3. 目标目录

```text
src/schema-core/
  model/
    diagram.ts
    table.ts
    field.ts
    relationship.ts
    index.ts
    visual.ts
    custom-type.ts
    index.ts
  commands/
    diagram-command.ts
    command-result.ts
    command-context.ts
    table-commands.ts
    field-commands.ts
    index-commands.ts
    relationship-commands.ts
    visual-commands.ts
    command-history.ts
  validation/
    validation-result.ts
    diagram-validator.ts
    reference-validator.ts
  diff/
    diagram-diff.ts
    impacted-entities.ts
```

目录按任务逐步创建，不在 `SCHEMAFLOW-P2-001` 一次性搬迁所有类型。

## 4. 旧类型到新 domain type 的映射

| 现有位置                                          | Phase 2 目标位置                              | 迁移方式                                          |
| ------------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| `src/lib/domain` 的 diagram/table/field 类型      | `src/schema-core/model`                       | 先在新目录建立 re-export，再逐个迁移定义          |
| `src/context/schemaflow-context` 中的 table 编辑逻辑 | `src/schema-core/commands/table-commands.ts`  | Provider 保留 orchestration，业务规则进纯 command |
| field、index、relationship 的散落更新逻辑         | `src/schema-core/commands/*-commands.ts`      | 先写 command tests，再接入 Provider               |
| area、note、custom type 的画布辅助对象更新        | `src/schema-core/commands/visual-commands.ts` | 保持 UI 行为不变，只迁移状态变更规则              |
| history context 的 action 字符串和 patch 数据     | `src/schema-core/commands/command-history.ts` | 先兼容旧 history，再逐步改为 inverse command      |

## 5. Command contract

```ts
export interface DiagramCommand<
    TType extends string = string,
    TPayload = unknown,
> {
    id: string;
    type: TType;
    payload: TPayload;
    createdAt: string;
}

export type CommandRiskLevel = 'none' | 'low' | 'medium' | 'high';

export interface CommandRisk {
    level: CommandRiskLevel;
    code: string;
    message: string;
    affectedEntityIds: string[];
}

export interface CommandResult<TState> {
    status: 'success' | 'validation_error';
    state: TState;
    undoCommand?: DiagramCommand;
    affectedEntityIds: string[];
    risks: CommandRisk[];
    validationErrors: ValidationIssue[];
}

export interface CommandContext {
    now: () => Date;
    generateId: () => string;
}
```

约束：

- command 不直接写 Dexie。
- command 不直接调用 React state setter。
- command 输入必须能由单元测试构造。
- destructive command 必须返回 risk metadata，例如删除 table、删除 field、删除 custom type。
- command result 必须能表达 validation error，不能通过 throw 作为常规业务失败路径。

## 6. Validator 与 diff

Validator 分两层：

- `reference-validator`：检查 table、field、relationship、index、custom type 的引用是否存在。
- `diagram-validator`：检查 diagram 级结构一致性和后续可扩展规则。

diff 分两类：

- `impacted-entities`：给 command result 和 UI warning 使用，表达本次变更影响哪些对象。
- `diagram-diff`：给后续导出、备份、审查和 Cloud/Team 预研使用，本阶段只定义边界，不做复杂可视化 diff。

## 7. undo/redo 兼容层

Phase 2 不一次性替换现有 undo/redo。兼容策略：

1. `SCHEMAFLOW-P2-002` 定义 `undoCommand` contract。
2. `SCHEMAFLOW-P2-003` 到 `SCHEMAFLOW-P2-005` 中，每类对象 command 先返回 inverse command 或足够生成 inverse command 的 payload。
3. Provider 接入时保留现有 history context API，新增 adapter 把 command result 转成旧 history 所需数据。
4. `SCHEMAFLOW-P2-006` 再把 history 内部逐步改为 command history。

保留周期：从 `SCHEMAFLOW-P2-001` 到 `SCHEMAFLOW-P2-006` 全程保留旧 import path 和旧 history API；Phase 2 退出验收通过后，再评估是否删除旧兼容层。

## 8. 自动开发顺序

### SCHEMAFLOW-P2-001：建立 schema-core 目录和领域模型出口

- 只创建 `src/schema-core/model` 和旧路径 re-export。
- 不改业务行为。
- 验收：`schema-core` 不依赖 React、Dexie、Monaco、DOM；`npm run lint`、`npm run test:ci`、`npm run build` 通过。

### SCHEMAFLOW-P2-002：定义 DiagramCommand 基础类型

- 新增 command、result、context、risk metadata。
- 新增 command contract tests。
- 验收：result 能表达 success、validation error、risk warning。
- 状态：已完成，业务行为未接入，下一项迁移 Table command。

### SCHEMAFLOW-P2-003：迁移 Table command

- 迁移 AddTable、UpdateTable、DeleteTable。
- 删除 table 必须报告 relationship、dependency、note anchor 等影响。
- Provider 只接入 table command，不同时迁移 field/index/relationship。
- 状态：已完成。已新增 table command 纯函数和单元测试，Provider 的新增、编辑、删除表已接入 command；当前 Note 模型没有 table anchor 字段，删除 table 不会改变 notes，后续若引入 anchor 字段需在 command 中补充影响报告。

### SCHEMAFLOW-P2-004：迁移 Field、Index、Relationship command

- 删除 field 必须处理 index 和 relationship 引用。
- 创建 relationship 前必须校验 source、target、column 引用。
- index command 保留唯一索引、主键索引、普通索引语义。
- 状态：已完成。已新增 field、index、relationship command 纯函数和单元测试，Provider 的 field/index/relationship 操作已接入 command；删除 field 会移除引用 relationship、收缩或删除相关 index，并在 undo 时恢复被级联移除的 relationship。

### SCHEMAFLOW-P2-005：迁移 Area、Note、CustomType command

- Area、Note 操作可撤销。
- CustomType 删除前检查字段引用。
- Note 内容仍只经过安全 Markdown 渲染，不重新引入 raw HTML。
- 状态：已完成。已新增 area、note、custom type command 纯函数和单元测试，Provider 的 area/note/custom type 操作已接入 command；删除 custom type 会在字段仍引用该类型时返回 validation error，不写入 Dexie 或 history。

### SCHEMAFLOW-P2-006：接入统一 undo/redo command history

- undo/redo 不再依赖散落 action 字符串。
- 每个 command 可生成 redo/undo 数据。
- 验收内存风险，避免大对象历史记录明显放大。

## 9. 测试策略

- 每个 CODE 任务先写失败测试，再实现。
- model contract 使用纯 TypeScript 单元测试。
- command tests 使用小型 diagram fixture，不依赖 React render。
- Provider adapter 只测试接线和兼容，不重复测试纯 command 规则。
- destructive command 至少覆盖一个 validation error 和一个 risk warning。

## 10. Phase 2 退出门槛

- `SchemaFlowProvider` 的核心编辑规则已迁出到 command 或 adapter。
- table、field、index、relationship、area、note、custom type 的主要编辑动作有 command 单元测试。
- undo/redo 覆盖核心对象，且旧行为保持可用。
- 编辑失败不产生半持久化状态。
- `npm run lint`、`npm run test:ci`、`npm run build`、`git diff --check` 通过。
