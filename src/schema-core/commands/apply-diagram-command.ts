import type { DBField, Diagram } from '../model';
import type { CommandContext } from './command-context';
import {
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
    type ValidationIssue,
} from './command-result';
import {
    createReplaceDiagramCommand,
    type DiagramCommandState,
    type DiagramStateCommand,
} from './diagram-commands';

export function applyDiagramCommand({
    command,
    context,
    state,
}: {
    command: DiagramStateCommand;
    context: CommandContext;
    state: DiagramCommandState;
}): CommandResult<DiagramCommandState> {
    switch (command.type) {
        case 'diagram.replace':
            return applyReplaceDiagramCommand({ command, context, state });
        case 'diagram.mergeDiff':
            return applyMergeDiagramDiffCommand({ command, context, state });
    }
}

function applyReplaceDiagramCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyDiagramCommand
>[0]): CommandResult<DiagramCommandState> {
    if (command.type !== 'diagram.replace') {
        return createValidationErrorResult({
            state,
            validationErrors: [],
        });
    }

    const nextDiagram = cloneDiagram(command.payload.diagram);
    const validationErrors = validateDiagram(nextDiagram);
    if (validationErrors.length > 0) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: collectDiagramEntityIds(nextDiagram),
            validationErrors,
        });
    }

    return createSuccessResult({
        state: { diagram: nextDiagram },
        affectedEntityIds: collectDiagramEntityIds(nextDiagram),
        undoCommand: createReplaceDiagramCommand({
            context,
            diagram: state.diagram,
        }),
    });
}

function applyMergeDiagramDiffCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyDiagramCommand
>[0]): CommandResult<DiagramCommandState> {
    if (command.type !== 'diagram.mergeDiff') {
        return createValidationErrorResult({
            state,
            validationErrors: [],
        });
    }

    const additions = command.payload.additions;
    const baseDiagram = cloneDiagram(state.diagram);
    const fieldsByTableId = additions.fieldsByTableId ?? new Map();
    const nextDiagram = cloneDiagram({
        ...baseDiagram,
        tables: [
            ...(baseDiagram.tables ?? []).map((table) => ({
                ...table,
                fields: [
                    ...table.fields.map(cloneField),
                    ...(fieldsByTableId.get(table.id) ?? []).map(cloneField),
                ],
            })),
            ...(additions.tables ?? []),
        ],
        relationships: [
            ...(baseDiagram.relationships ?? []),
            ...(additions.relationships ?? []),
        ],
        dependencies: [
            ...(baseDiagram.dependencies ?? []),
            ...(additions.dependencies ?? []),
        ],
        areas: [...(baseDiagram.areas ?? []), ...(additions.areas ?? [])],
        customTypes: [
            ...(baseDiagram.customTypes ?? []),
            ...(additions.customTypes ?? []),
        ],
        notes: [...(baseDiagram.notes ?? []), ...(additions.notes ?? [])],
    });

    const missingTableErrors = Array.from(fieldsByTableId.keys())
        .filter(
            (tableId) =>
                !(baseDiagram.tables ?? []).some(
                    (table) => table.id === tableId
                )
        )
        .map(
            (tableId): ValidationIssue => ({
                code: 'diagram.diff_table_not_found',
                message: 'Diff field target table was not found.',
                entityId: tableId,
                path: ['tables', tableId],
            })
        );
    const validationErrors = [
        ...missingTableErrors,
        ...validateDiagram(nextDiagram),
    ];
    if (validationErrors.length > 0) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: collectDiagramEntityIds(nextDiagram),
            validationErrors,
        });
    }

    return createSuccessResult({
        state: { diagram: nextDiagram },
        affectedEntityIds: collectDiagramEntityIds(nextDiagram),
        undoCommand: createReplaceDiagramCommand({
            context,
            diagram: state.diagram,
        }),
    });
}

function validateDiagram(diagram: Diagram): ValidationIssue[] {
    const seen = new Map<string, Array<string | number>>();
    const duplicates: ValidationIssue[] = [];
    const track = (id: string | undefined, path: Array<string | number>) => {
        if (!id) return;
        if (seen.has(id)) {
            duplicates.push({
                code: 'diagram.duplicate_entity_id',
                message: 'Diagram contains duplicate entity ids.',
                entityId: id,
                path,
            });
            return;
        }
        seen.set(id, path);
    };

    track(diagram.id, ['diagram', diagram.id]);
    (diagram.tables ?? []).forEach((table) => {
        track(table.id, ['tables', table.id]);
        table.fields.forEach((field) =>
            track(field.id, ['tables', table.id, 'fields', field.id])
        );
        table.indexes.forEach((index) =>
            track(index.id, ['tables', table.id, 'indexes', index.id])
        );
    });
    (diagram.relationships ?? []).forEach((relationship) =>
        track(relationship.id, ['relationships', relationship.id])
    );
    (diagram.dependencies ?? []).forEach((dependency) =>
        track(dependency.id, ['dependencies', dependency.id])
    );
    (diagram.areas ?? []).forEach((area) => track(area.id, ['areas', area.id]));
    (diagram.customTypes ?? []).forEach((customType) =>
        track(customType.id, ['customTypes', customType.id])
    );
    (diagram.notes ?? []).forEach((note) => track(note.id, ['notes', note.id]));

    return duplicates;
}

function collectDiagramEntityIds(diagram: Diagram): string[] {
    return [
        diagram.id,
        ...(diagram.tables ?? []).flatMap((table) => [
            table.id,
            ...table.fields.map((field) => field.id),
            ...table.indexes.map((index) => index.id),
        ]),
        ...(diagram.relationships ?? []).map((relationship) => relationship.id),
        ...(diagram.dependencies ?? []).map((dependency) => dependency.id),
        ...(diagram.areas ?? []).map((area) => area.id),
        ...(diagram.customTypes ?? []).map((customType) => customType.id),
        ...(diagram.notes ?? []).map((note) => note.id),
    ];
}

function cloneState(state: DiagramCommandState): DiagramCommandState {
    return { diagram: cloneDiagram(state.diagram) };
}

function cloneDiagram(diagram: Diagram): Diagram {
    return structuredClone(diagram);
}

function cloneField(field: DBField): DBField {
    return structuredClone(field);
}
