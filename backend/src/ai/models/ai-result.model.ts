export interface AiCompletedResult {
    status: 'completed';
    answer: string;
}

export interface AiApprovalRequiredResult {
    status: 'approval_required';
    approvalId: string;
    toolName: string;
    arguments: string;
}

export type AiResult =
    | AiCompletedResult
    | AiApprovalRequiredResult;