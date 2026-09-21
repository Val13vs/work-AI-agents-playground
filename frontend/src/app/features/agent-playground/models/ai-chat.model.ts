export interface AiChatRequest {
  message: string;
  conversationId?: string;
}

export interface AiChatResponse {
  answer: string;
  conversationId: string;
}

export type ChatMessageRole =
  | 'user'
  | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}
