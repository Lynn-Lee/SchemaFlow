import { describe, expect, it } from 'vitest';
import { getCapabilitySupport } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';
import { mysqlCapabilities, mysqlSchemaImporter } from '../mysql';
import { mariadbCapabilities, mariadbSchemaImporter } from '../mariadb';
import { sqliteCapabilities, sqliteSchemaImporter } from '../sqlite';
import { sqlServerCapabilities, sqlServerSchemaImporter } from '../sqlserver';
import { oracleCapabilities, oracleSchemaImporter } from '../oracle';

describe('sql dialect schema importers', () => {
    it('wraps MySQL in the dialect import result contract', async () => {
        const result = await mysqlSchemaImporter.importSchema({
            sql: `
                CREATE TABLE \`accounts\` (
                    \`id\` BIGINT NOT NULL AUTO_INCREMENT,
                    \`email\` VARCHAR(255) NOT NULL,
                    PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `,
        });

        expect(result.sourceDialect).toBe(DatabaseType.MYSQL);
        expect(result.diagram.databaseType).toBe(DatabaseType.MYSQL);
        expect(result.diagram.tables?.map((table) => table.name)).toContain(
            'accounts'
        );
        expect(result.warnings.map((warning) => warning.code)).toContain(
            'mysql.engine_charset_metadata'
        );
        expect(
            getCapabilitySupport(mysqlCapabilities, 'import', 'tables')
        ).toBe('full');
        expect(getCapabilitySupport(mysqlCapabilities, 'import', 'views')).toBe(
            'partial'
        );
    });

    it('wraps MariaDB through the MySQL fallback with explicit warning metadata', async () => {
        const result = await mariadbSchemaImporter.importSchema({
            sql: `
                CREATE SEQUENCE account_seq;
                CREATE TABLE accounts (
                    id BIGINT NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    PRIMARY KEY (id)
                ) ENGINE=Aria;
            `,
        });

        expect(result.sourceDialect).toBe(DatabaseType.MARIADB);
        expect(result.diagram.databaseType).toBe(DatabaseType.MARIADB);
        expect(result.diagram.tables?.map((table) => table.name)).toContain(
            'accounts'
        );
        expect(result.warnings.map((warning) => warning.code)).toEqual(
            expect.arrayContaining([
                'mariadb.mysql_fallback',
                'mariadb.sequence_unsupported',
                'mariadb.engine_semantics_partial',
            ])
        );
        expect(
            getCapabilitySupport(mariadbCapabilities, 'import', 'tables')
        ).toBe('experimental');
    });

    it('wraps SQLite and reports unsupported virtual table syntax', async () => {
        const result = await sqliteSchemaImporter.importSchema({
            sql: `
                CREATE VIRTUAL TABLE docs USING fts5(title, body);
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL
                );
            `,
        });

        expect(result.sourceDialect).toBe(DatabaseType.SQLITE);
        expect(result.diagram.databaseType).toBe(DatabaseType.SQLITE);
        expect(result.diagram.tables?.map((table) => table.name)).toContain(
            'users'
        );
        expect(result.unsupportedObjects).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    objectType: 'virtual_table',
                    name: 'docs',
                    ignored: true,
                }),
            ])
        );
        expect(
            getCapabilitySupport(sqliteCapabilities, 'import', 'tables')
        ).toBe('full');
    });

    it('wraps SQL Server and reports stored procedure unsupported syntax', async () => {
        const result = await sqlServerSchemaImporter.importSchema({
            sql: `
                CREATE TABLE [dbo].[Accounts] (
                    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    [Email] NVARCHAR(255) NOT NULL
                );
                GO
                CREATE PROCEDURE [dbo].[ArchiveAccount] AS SELECT 1;
            `,
        });

        expect(result.sourceDialect).toBe(DatabaseType.SQL_SERVER);
        expect(result.diagram.databaseType).toBe(DatabaseType.SQL_SERVER);
        expect(result.diagram.tables?.map((table) => table.name)).toContain(
            'Accounts'
        );
        expect(result.warnings.map((warning) => warning.code)).toContain(
            'sqlserver.procedure_unsupported'
        );
        expect(
            getCapabilitySupport(sqlServerCapabilities, 'import', 'schemas')
        ).toBe('partial');
    });

    it('wraps Oracle and reports sequence and package unsupported syntax', async () => {
        const result = await oracleSchemaImporter.importSchema({
            sql: `
                CREATE SEQUENCE account_seq START WITH 1;
                CREATE TABLE accounts (
                    id NUMBER(10) NOT NULL,
                    email VARCHAR2(255) NOT NULL,
                    CONSTRAINT pk_accounts PRIMARY KEY (id)
                );
                CREATE OR REPLACE PACKAGE account_pkg AS
                    PROCEDURE archive_account;
                END account_pkg;
            `,
        });

        expect(result.sourceDialect).toBe(DatabaseType.ORACLE);
        expect(result.diagram.databaseType).toBe(DatabaseType.ORACLE);
        expect(result.diagram.tables?.map((table) => table.name)).toContain(
            'accounts'
        );
        expect(result.warnings.map((warning) => warning.code)).toEqual(
            expect.arrayContaining([
                'oracle.sequence_unsupported',
                'oracle.package_unsupported',
            ])
        );
        expect(
            getCapabilitySupport(oracleCapabilities, 'import', 'tables')
        ).toBe('full');
    });
});
