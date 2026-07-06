import { describe, expect, it, vi } from 'vitest';
import {
    migrateV2FieldTypes,
    migrateV6RelationshipCardinalities,
    migrateV9FieldNullability,
    migrateV12ResetConfig,
} from '../schema-versions';

describe('SchemaFlow Dexie schema migrations', () => {
    it('migrates v1 field type strings into field type objects for v2', () => {
        const table = {
            fields: [
                { name: 'id', type: 'bigint unsigned' },
                { name: 'status', type: 'varchar' },
            ],
        };

        migrateV2FieldTypes(table);

        expect(table.fields).toEqual([
            {
                name: 'id',
                type: { id: 'bigint_unsigned', name: 'bigint unsigned' },
            },
            { name: 'status', type: { id: 'varchar', name: 'varchar' } },
        ]);
    });

    it('migrates v5 relationship type into v6 cardinality fields and removes type', () => {
        const relationship = {
            type: 'one_to_many' as const,
        };
        const ref = { value: relationship };

        migrateV6RelationshipCardinalities(relationship, ref);

        expect(relationship).toEqual({
            sourceCardinality: 'one',
            targetCardinality: 'many',
        });
    });

    it('migrates v8 string nullable flags into booleans for v9', () => {
        const table = {
            fields: [
                { name: 'required', type: 'text', nullable: 'FALSE' },
                { name: 'optional', type: 'text', nullable: 'true' },
                { name: 'alreadyBoolean', type: 'text', nullable: false },
            ],
        };

        migrateV9FieldNullability(table);

        expect(table.fields).toEqual([
            { name: 'required', type: 'text', nullable: false },
            { name: 'optional', type: 'text', nullable: true },
            { name: 'alreadyBoolean', type: 'text', nullable: false },
        ]);
    });

    it('clears config entries during the v12 migration', () => {
        const clear = vi.fn();
        const tx = {
            table: vi.fn(() => ({ clear })),
        };

        migrateV12ResetConfig(tx);

        expect(tx.table).toHaveBeenCalledWith('config');
        expect(clear).toHaveBeenCalledTimes(1);
    });
});
