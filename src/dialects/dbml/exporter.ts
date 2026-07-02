import { createExportResult, type SchemaExporter } from '@/dialects/common';
import { generateDBMLFromDiagram } from '@/lib/dbml/dbml-export/dbml-export';
import type { Diagram } from '@/lib/domain/diagram';
import { DBML_DIALECT } from './capabilities';
import { extractDBMLExportWarnings } from './warnings';

export interface DBMLExportInput {
    diagram: Diagram;
    inline?: boolean;
}

export const dbmlSchemaExporter: SchemaExporter<DBMLExportInput> = {
    async exportSchema({ diagram, inline = false }) {
        const { warnings, unsupportedObjects } =
            extractDBMLExportWarnings(diagram);
        const result = generateDBMLFromDiagram(diagram);
        const output = inline ? result.inlineDbml : result.standardDbml;
        const hasError = Boolean(result.error);

        return createExportResult({
            output,
            targetDialect: DBML_DIALECT,
            warnings: hasError
                ? [
                      ...warnings,
                      {
                          code: 'dbml.export_error',
                          severity: 'error',
                          message: result.error ?? 'Unknown DBML export error',
                      },
                  ]
                : warnings,
            unsupportedObjects,
            riskLevel:
                hasError || unsupportedObjects.length > 0 ? 'medium' : 'low',
        });
    },
};
