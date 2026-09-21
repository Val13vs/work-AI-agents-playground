import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  AgentApiService
} from '../../data-access/agent-api.service';

import {
  AiApprovalDecisionResponse,
  AiChatResponse,
  ChatMessage,
  PendingApproval
} from '../../models/ai-chat.model';

@Component({
  selector: 'app-agent-playground-page',
  standalone: true,
  imports: [],
  templateUrl: './agent-playground-page.html',
  styleUrl: './agent-playground-page.scss'
})
export class AgentPlaygroundPage {
  private readonly agentApi =
    inject(AgentApiService);

  readonly message = signal('');

  readonly messages =
    signal<ChatMessage[]>([]);

  readonly conversationId =
    signal<string | null>(null);

  readonly pendingApproval =
    signal<PendingApproval | null>(null);

  readonly loading = signal(false);

  readonly approvalLoading =
    signal(false);

  readonly error =
    signal<string | null>(null);

  updateMessage(event: Event): void {
    const textarea =
      event.target as HTMLTextAreaElement;

    this.message.set(
      textarea.value
    );
  }

  sendMessage(): void {
    const message =
      this.message().trim();

    if (
      !message ||
      this.loading() ||
      this.approvalLoading() ||
      this.pendingApproval()
    ) {
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    this.messages.update(messages => [
      ...messages,
      {
        role: 'user',
        content: message
      }
    ]);

    this.message.set('');

    this.agentApi
      .chat(
        message,
        this.conversationId() ?? undefined
      )
      .subscribe({
        next: response => {
          this.conversationId.set(
            response.conversationId
          );

          this.handleChatResponse(
            response
          );

          this.loading.set(false);
        },

        error: error => {
          console.error(
            'AI request failed:',
            error
          );

          this.error.set(
            'The AI request could not be completed.'
          );

          this.loading.set(false);
        }
      });
  }

  approve(): void {
    this.resolveApproval(true);
  }

  reject(): void {
    this.resolveApproval(false);
  }

  newConversation(): void {
    const conversationId =
      this.conversationId();

    if (!conversationId) {
      this.resetConversationState();
      return;
    }

    this.agentApi
      .clearConversation(
        conversationId
      )
      .subscribe({
        next: () => {
          this.resetConversationState();
        },

        error: () => {
          this.resetConversationState();
        }
      });
  }

  private resolveApproval(
    approved: boolean
  ): void {
    const approval =
      this.pendingApproval();

    if (
      !approval ||
      this.approvalLoading()
    ) {
      return;
    }

    this.error.set(null);
    this.approvalLoading.set(true);

    this.agentApi
      .resolveApproval(
        approval.approvalId,
        approved
      )
      .subscribe({
        next: response => {
          this.pendingApproval.set(null);

          this.handleApprovalResponse(
            response
          );

          this.approvalLoading.set(false);
        },

        error: error => {
          console.error(
            'Approval request failed:',
            error
          );

          this.error.set(
            'The approval decision could not be completed.'
          );

          this.approvalLoading.set(false);
        }
      });
  }

  private handleChatResponse(
    response: AiChatResponse
  ): void {
    if (
      response.status ===
      'approval_required'
    ) {
      this.pendingApproval.set({
        approvalId:
        response.approvalId,

        toolName:
        response.toolName,

        arguments:
        response.arguments
      });

      return;
    }

    this.addAssistantMessage(
      response.answer
    );
  }

  private handleApprovalResponse(
    response: AiApprovalDecisionResponse
  ): void {
    if (
      response.status ===
      'approval_required'
    ) {
      this.pendingApproval.set({
        approvalId:
        response.approvalId,

        toolName:
        response.toolName,

        arguments:
        response.arguments
      });

      return;
    }

    this.addAssistantMessage(
      response.answer
    );
  }

  private addAssistantMessage(
    content: string
  ): void {
    this.messages.update(messages => [
      ...messages,
      {
        role: 'assistant',
        content
      }
    ]);
  }

  private resetConversationState(): void {
    this.conversationId.set(null);

    this.pendingApproval.set(null);

    this.messages.set([]);

    this.message.set('');

    this.error.set(null);

    this.loading.set(false);

    this.approvalLoading.set(false);
  }
}
