import { describe, expect, it } from 'vitest';
import { loadDatabaseMetadata } from '../metadata-types/database-metadata';

describe('loadDatabaseMetadata', () => {
    it('rejects parsed JSON that does not match the database metadata schema', () => {
        expect(() =>
            loadDatabaseMetadata(
                JSON.stringify({
                    tables: [],
                    columns: [],
                })
            )
        ).toThrow(/Invalid database metadata JSON/);
    });
});
