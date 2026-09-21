import { randomUUID } from 'node:crypto';

import type {
    Agent,
    MemorySession,
    RunState,
    RunToolApprovalItem
} from '@openai/agents';

type AssistantAgent = Agent<unknown, 'text'>;

type AssistantRunState =
    RunState<undefined, AssistantAgent>;

export interface PendingApproval {
    state: AssistantRunState;
    interruption: RunToolApprovalItem;
    session: MemorySession;
}

const pendingApprovals =
    new Map<string, PendingApproval>();

export function createPendingApproval(
    state: AssistantRunState,
    interruption: RunToolApprovalItem,
    session: MemorySession
): string {
    const approvalId = randomUUID();

    pendingApprovals.set(
        approvalId,
        {
            state,
            interruption,
            session
        }
    );

    return approvalId;
}

export function getPendingApproval(
    approvalId: string
): PendingApproval | undefined {
    return pendingApprovals.get(approvalId);
}

export function removePendingApproval(
    approvalId: string
): void {
    pendingApprovals.delete(approvalId);
}