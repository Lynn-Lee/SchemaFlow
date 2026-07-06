import type { DBRelationship } from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export type AddRelationshipCommand = DiagramCommand<
    'relationship.add',
    {
        relationship: DBRelationship;
    }
>;

export type UpdateRelationshipCommand = DiagramCommand<
    'relationship.update',
    {
        relationshipId: string;
        relationship: Partial<DBRelationship>;
    }
>;

export type DeleteRelationshipCommand = DiagramCommand<
    'relationship.delete',
    {
        relationshipId: string;
    }
>;

export type RelationshipCommand =
    | AddRelationshipCommand
    | UpdateRelationshipCommand
    | DeleteRelationshipCommand;

export function createAddRelationshipCommand({
    context,
    relationship,
}: {
    context: CommandContext;
    relationship: DBRelationship;
}): AddRelationshipCommand {
    return createDiagramCommand({
        context,
        type: 'relationship.add',
        payload: { relationship },
    });
}

export function createUpdateRelationshipCommand({
    context,
    relationshipId,
    relationship,
}: {
    context: CommandContext;
    relationshipId: string;
    relationship: Partial<DBRelationship>;
}): UpdateRelationshipCommand {
    return createDiagramCommand({
        context,
        type: 'relationship.update',
        payload: { relationshipId, relationship },
    });
}

export function createDeleteRelationshipCommand({
    context,
    relationshipId,
}: {
    context: CommandContext;
    relationshipId: string;
}): DeleteRelationshipCommand {
    return createDiagramCommand({
        context,
        type: 'relationship.delete',
        payload: { relationshipId },
    });
}
