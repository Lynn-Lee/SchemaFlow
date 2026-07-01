# ChartDB Storage 设计

> 状态：Phase 3 执行清单。`CHARTDB-P3-001` 已完成 Dexie schema 集中化，`CHARTDB-P3-002` 已完成 repository API 抽离；后续从 `CHARTDB-P3-003` 的 diagram transaction service 继续。

## 1. 目标

Phase 3 的目标是把 IndexedDB 访问从 React Provider 中抽离，形成可测试、可迁移、可事务化的 storage 层。

本阶段不改变用户可见功能，不引入账号、云端 diagram 存储、团队 Workspace、实时协作、权限模型或生产数据库直连。

## 2. 当前基线

当前 Dexie 初始化、表结构和 migration 已集中到 `src/storage/db`，CRUD repository 已集中到 `src/storage/repositories/chartdb-repositories.ts`：

- 数据库名：`ChartDB`。
- 当前 Dexie 版本：`13`。
- 当前表：`diagrams`、`db_tables`、`db_relationships`、`db_dependencies`、`areas`、`db_custom_types`、`notes`、`config`、`diagram_filters`。
- 既有 migration：字段 type 字符串迁移、relationship cardinality 迁移、field nullable 字符串迁移、config 重置。
- 当前风险：diagram 级创建、删除、导入和恢复尚未进入 transaction service，失败时的一致性仍需在 `CHARTDB-P3-003` 收敛；backup/restore versioning 仍在 `CHARTDB-P3-004`。

## 3. 目标目录

```text
src/storage/
  db/
    chartdb-dexie.ts
    schema-versions.ts
  repositories/
    diagram-repository.ts
    table-repository.ts
    relationship-repository.ts
    dependency-repository.ts
    area-repository.ts
    custom-type-repository.ts
    note-repository.ts
    diagram-filter-repository.ts
    config-repository.ts
  transactions/
    diagram-transaction-service.ts
  backup/
    backup-format.ts
    export-backup.ts
    import-backup.ts
  migrations/
    migration-log.ts
```

## 4. Dexie 与 migration 边界

`src/storage/db/chartdb-dexie.ts` 负责创建 Dexie instance。`src/storage/db/schema-versions.ts` 负责集中声明所有 stores 和 upgrade migration。

约束：

- migration version 必须集中可读，不再内联在 React Provider 中。
- 每个 upgrade 必须保留旧数据兼容逻辑，不重写用户 diagram。
- migration 测试应覆盖从旧版本 fixture 到当前版本的关键字段变更。
- `StorageProvider` 只消费 db instance 和 repository API，不直接声明 stores。

## 5. Repository 边界

repository 是 Dexie table 的唯一读写入口。React Provider 和 ChartDBProvider 不直接写 Dexie table。

首轮 repository API 只覆盖既有 StorageContext 能力：

- diagram repository：diagram CRUD 与 list/get include children 的组合读取。
- table repository：table CRUD 与 diagram 级 list/delete。
- relationship repository：relationship CRUD 与 diagram 级 list/delete。
- dependency repository：dependency CRUD 与 diagram 级 list/delete。
- area repository：area CRUD 与 diagram 级 list/delete。
- custom type repository：custom type CRUD 与 diagram 级 list/delete。
- note repository：note CRUD 与 diagram 级 list/delete。
- diagram filter repository：filter get/update/delete。
- config repository：config get/update 和 default diagram 初始化。

repository 不负责 UI toast、undo/redo、command risk 展示或路由跳转。

## 6. Transaction 边界

diagram 级写操作必须逐步迁移到 transaction service：

- `deleteDiagramWithChildren(diagramId)`：删除 diagram、tables、relationships、dependencies、areas、custom types、notes、diagram filters。
- `replaceDiagramData(diagram)`：导入或恢复时以 diagram 为单位替换完整数据。
- `createDiagramWithChildren(diagram)`：从导入、模板或 backup 创建完整 diagram。

验收标准：

- 删除 diagram 后没有孤儿记录。
- transaction 失败时不留下半成品 diagram。
- command history 和旧 undo/redo 仍由 ChartDBProvider 管理，不写入 storage transaction。

## 7. Backup / restore 格式

备份文件必须版本化，首个目标格式为 `chartdb.backup.v1`：

```ts
type ChartDBBackupV1 = {
    format: 'chartdb.backup';
    formatVersion: 1;
    createdAt: string;
    source: 'chartdb-local';
    diagrams: Diagram[];
};
```

约束：

- 导出必须包含 `format`、`formatVersion`、`createdAt` 和 diagram count。
- restore 前必须校验 JSON shape、format、formatVersion 和 diagram 基础字段。
- 不兼容 backup 给出可理解错误，不写入 IndexedDB。
- backup migration 与 IndexedDB migration 分开管理，避免混淆浏览器存储版本和文件格式版本。

## 8. 自动开发顺序

1. `CHARTDB-P3-001`：抽离 Dexie 数据库定义，新增 `src/storage/db` 和 schema version 测试。
2. `CHARTDB-P3-002`：抽 repository API，让 `StorageProvider` 组合 repository。（已完成）
3. `CHARTDB-P3-003`：实现 diagram transaction service，覆盖删除和替换一致性。
4. `CHARTDB-P3-004`：实现 backup schema version、校验和 restore migration。

Phase 3 完成后才允许进入 Phase 4 dialect contract，不跳过 storage 事务和备份恢复验收。

## 9. 验收命令

```bash
rg -n "Dexie|repository|transaction|backup|restore|migration" docs/storage设计.md
npm run lint
npm run test:ci
npm run build
git diff --check
```
