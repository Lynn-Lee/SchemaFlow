import { describe, expect, it } from 'vitest';

import type { CommandContext, DiagramCommand } from '@/schema-core/commands';
import {
    applyFieldCommand,
    applyIndexCommand,
    applyRelationshipCommand,
    createAddFieldCommand,
    createAddIndexCommand,
    createAddRelationshipCommand,
    createDeleteFieldCommand,
    createUpdateIndexCommand,
    createUpdateRelationshipCommand,
    type DiagramFieldIndexRelationshipCommandState,
} from '@/schema-core/commands';
import type {
    DBField,
    DBIndex,
    DBRelationship,
    DBTable,
} from '@/schema-core/model';
import { DatabaseType } from '@/schema-core/model';

describe('schema-core field, index, and relationship commands', () => {
    const context: CommandContext = {
        now: () => new Date('2026-07-01T00:00:00.000Z'),
        generateId: () => 'command-1',
    };

    const createField = (overrides: Partial<DBField>): DBField => ({
        id: 'field-1',
        name: 'id',
        type: { id: 'integer', name: 'integer' },
        primaryKey: false,
        unique: false,
        nullable: true,
        createdAt: 1,
        ...overrides,
    });

    const createTable = (overrides: Partial<DBTable>): DBTable => ({
        id: 'table-1',
        name: 'users',
        x: 0,
        y: 0,
        fields: [],
        indexes: [],
        color: '#ffffff',
        isView: false,
        createdAt: 1,
        ...overrides,
    });

    const baseState = (
        overrides: Partial<DiagramFieldIndexRelationshipCommandState> = {}
    ): DiagramFieldIndexRelationshipCommandState => ({
        databaseType: DatabaseType.POSTGRESQL,
        tables: [],
        relationships: [],
        ...overrides,
    });

    it('deletes a field and reports removed relationships and index references', () => {
        const idField = createField({ id: 'id', name: 'id' });
        const emailField = createField({ id: 'email', name: 'email' });
        const users = createTable({
            id: 'users',
            fields: [idField, emailField],
            indexes: [
                {
                    id: 'idx-users-email',
                    name: 'idx_users_email',
                    unique: true,
                    fieldIds: ['email'],
                    type: 'btree',
                    createdAt: 1,
                },
                {
                    id: 'idx-users-id-email',
                    name: 'idx_users_id_email',
                    unique: false,
                    fieldIds: ['id', 'email'],
                    type: 'hash',
                    createdAt: 1,
                },
            ],
        });
        const posts = createTable({
            id: 'posts',
            name: 'posts',
            fields: [createField({ id: 'post-author-email', name: 'email' })],
        });
        const relationship: DBRelationship = {
            id: 'relationship-1',
            name: 'posts_author_email_fk',
            sourceTableId: 'posts',
            targetTableId: 'users',
            sourceFieldId: 'post-author-email',
            targetFieldId: 'email',
            sourceCardinality: 'many',
            targetCardinality: 'one',
            createdAt: 1,
        };

        const result = applyFieldCommand({
            command: createDeleteFieldCommand({
                context,
                tableId: 'users',
                fieldId: 'email',
            }),
            context,
            state: baseState({
                tables: [users, posts],
                relationships: [relationship],
            }),
        });

        expect(result.status).toBe('success');
        expect(result.state.tables[0].fields).toEqual([idField]);
        expect(result.state.tables[0].indexes).toEqual([
            {
                id: 'idx-users-id-email',
                name: 'idx_users_id_email',
                unique: false,
                fieldIds: ['id'],
                type: 'hash',
                createdAt: 1,
            },
        ]);
        expect(result.state.relationships).toEqual([]);
        expect(result.affectedEntityIds).toEqual([
            'users',
            'email',
            'idx-users-email',
            'idx-users-id-email',
            'relationship-1',
        ]);
        expect(result.risks).toEqual([
            {
                level: 'medium',
                code: 'field.delete.cascade',
                message:
                    'Deleting this field removes relationships and updates indexes that reference it.',
                affectedEntityIds: [
                    'users',
                    'email',
                    'idx-users-email',
                    'idx-users-id-email',
                    'relationship-1',
                ],
            },
        ]);
        expect(result.undoCommand).toMatchObject({
            type: 'field.restore',
            payload: {
                tableId: 'users',
                field: emailField,
                indexes: users.indexes,
                relationships: [relationship],
            },
        });
    });

    it('validates relationship endpoint table and field references before adding', () => {
        const users = createTable({
            id: 'users',
            fields: [createField({ id: 'id', name: 'id' })],
        });
        const posts = createTable({
            id: 'posts',
            fields: [createField({ id: 'author_id', name: 'author_id' })],
        });
        const relationship: DBRelationship = {
            id: 'relationship-1',
            name: 'posts_author_id_fk',
            sourceTableId: 'posts',
            targetTableId: 'users',
            sourceFieldId: 'missing-field',
            targetFieldId: 'id',
            sourceCardinality: 'many',
            targetCardinality: 'one',
            createdAt: 1,
        };

        const result = applyRelationshipCommand({
            command: createAddRelationshipCommand({
                context,
                relationship,
            }),
            context,
            state: baseState({ tables: [users, posts] }),
        });

        expect(result.status).toBe('validation_error');
        expect(result.state.relationships).toEqual([]);
        expect(result.validationErrors).toEqual([
            {
                code: 'relationship.source_field_not_found',
                message: 'Relationship source field was not found.',
                entityId: 'missing-field',
                path: ['relationships', 'relationship-1', 'sourceFieldId'],
            },
        ]);
    });

    it('adds a valid relationship and updates relationship cardinality', () => {
        const users = createTable({
            id: 'users',
            fields: [createField({ id: 'id', name: 'id' })],
        });
        const posts = createTable({
            id: 'posts',
            fields: [createField({ id: 'author_id', name: 'author_id' })],
        });
        const relationship: DBRelationship = {
            id: 'relationship-1',
            name: 'posts_author_id_fk',
            sourceTableId: 'posts',
            targetTableId: 'users',
            sourceFieldId: 'author_id',
            targetFieldId: 'id',
            sourceCardinality: 'many',
            targetCardinality: 'one',
            createdAt: 1,
        };

        const addResult = applyRelationshipCommand({
            command: createAddRelationshipCommand({
                context,
                relationship,
            }),
            context,
            state: baseState({ tables: [users, posts] }),
        });

        expect(addResult.status).toBe('success');
        expect(addResult.state.relationships).toEqual([relationship]);
        expect(addResult.undoCommand).toMatchObject<
            Partial<DiagramCommand<'relationship.delete'>>
        >({
            type: 'relationship.delete',
            payload: { relationshipId: 'relationship-1' },
        });

        const updateResult = applyRelationshipCommand({
            command: createUpdateRelationshipCommand({
                context,
                relationshipId: 'relationship-1',
                relationship: {
                    sourceCardinality: 'one',
                    targetCardinality: 'many',
                },
            }),
            context,
            state: addResult.state,
        });

        expect(updateResult.status).toBe('success');
        expect(updateResult.state.relationships).toEqual([
            {
                ...relationship,
                sourceCardinality: 'one',
                targetCardinality: 'many',
            },
        ]);
        expect(updateResult.undoCommand).toMatchObject({
            type: 'relationship.update',
            payload: {
                relationshipId: 'relationship-1',
                relationship,
            },
        });
    });

    it('adds and updates indexes without losing unique, primary key, or type semantics', () => {
        const idField = createField({
            id: 'id',
            name: 'id',
            primaryKey: true,
            unique: true,
            nullable: false,
        });
        const emailField = createField({
            id: 'email',
            name: 'email',
            unique: true,
        });
        const table = createTable({
            id: 'users',
            fields: [idField, emailField],
        });
        const index: DBIndex = {
            id: 'idx-users-email',
            name: 'idx_users_email',
            unique: true,
            fieldIds: ['email'],
            type: 'btree',
            isPrimaryKey: false,
            createdAt: 1,
        };

        const addResult = applyIndexCommand({
            command: createAddIndexCommand({
                context,
                tableId: 'users',
                index,
            }),
            context,
            state: baseState({ tables: [table] }),
        });

        expect(addResult.status).toBe('success');
        expect(addResult.state.tables[0].indexes).toEqual([index]);

        const updateResult = applyIndexCommand({
            command: createUpdateIndexCommand({
                context,
                tableId: 'users',
                indexId: 'idx-users-email',
                index: {
                    name: 'idx_users_email_hash',
                    unique: false,
                    type: 'hash',
                    isPrimaryKey: false,
                    fieldIds: ['id', 'email'],
                },
            }),
            context,
            state: addResult.state,
        });

        expect(updateResult.status).toBe('success');
        expect(updateResult.state.tables[0].indexes).toEqual([
            {
                ...index,
                name: 'idx_users_email_hash',
                unique: false,
                type: 'hash',
                isPrimaryKey: false,
                fieldIds: ['id', 'email'],
            },
        ]);
    });

    it('adds a field and returns a delete undo command', () => {
        const field = createField({ id: 'email', name: 'email' });
        const table = createTable({ id: 'users' });

        const result = applyFieldCommand({
            command: createAddFieldCommand({
                context,
                tableId: 'users',
                field,
            }),
            context,
            state: baseState({ tables: [table] }),
        });

        expect(result.status).toBe('success');
        expect(result.state.tables[0].fields).toEqual([field]);
        expect(result.undoCommand).toMatchObject({
            type: 'field.delete',
            payload: { tableId: 'users', fieldId: 'email' },
        });
    });
});
