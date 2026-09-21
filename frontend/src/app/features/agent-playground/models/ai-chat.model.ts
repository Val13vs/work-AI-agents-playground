export interface AiChatRequest {
  message: string;
  conversationId?: string;
}

export interface AiCompletedResponse {
  status: 'completed';
  answer: string;
}

export interface AiApprovalRequiredResponse {
  status: 'approval_required';
  approvalId: string;
  toolName: string;
  arguments: string;
}

export type AiResultResponse =
  | AiCompletedResponse
  | AiApprovalRequiredResponse;

export type AiChatResponse =
  AiResultResponse & {
  conversationId: string;
};

export interface AiApprovalDecisionRequest {
  approved: boolean;
}

export type AiApprovalDecisionResponse =
  AiResultResponse;

export type ChatMessageRole =
  | 'user'
  | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface PendingApproval {
  approvalId: string;
  toolName: string;
  arguments: string;
}
