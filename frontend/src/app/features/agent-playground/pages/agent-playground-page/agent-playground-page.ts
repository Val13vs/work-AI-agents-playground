import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  AgentApiService
} from '../../data-access/agent-api.service';

import {
  ChatMessage
} from '../../models/ai-chat.model';

@Component({
  selector: 'app-agent-playground-page',
  standalone: true,
  imports: [],
  templateUrl: './agent-playground-page.html',
  styleUrl: './agent-playground-page.scss'
})
export class AgentPlaygroundPage {
  private readonly agentApi = inject(AgentApiService);

  readonly message = signal('');
  readonly messages = signal<ChatMessage[]>([]);

  readonly conversationId =
    signal<string | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  updateMessage(event: Event): void {
    const textarea =
      event.target as HTMLTextAreaElement;

    this.message.set(textarea.value);
  }

  sendMessage(): void {
    const message = this.message().trim();

    if (!message || this.loading()) {
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

          this.messages.update(messages => [
            ...messages,
            {
              role: 'assistant',
              content: response.answer
            }
          ]);

          this.loading.set(false);
        },

        error: () => {
          this.error.set(
            'The AI request could not be completed.'
          );

          this.loading.set(false);
        }
      });
  }

  newConversation(): void {
    const conversationId =
      this.conversationId();

    if (!conversationId) {
      this.resetConversationState();
      return;
    }

    this.agentApi
      .clearConversation(conversationId)
      .subscribe({
        next: () => {
          this.resetConversationState();
        },

        error: () => {
          /*
           * Even if deleting the old backend
           * session fails, removing its ID locally
           * means the next message will create
           * a new conversation.
           */
          this.resetConversationState();
        }
      });
  }

  private resetConversationState(): void {
    this.conversationId.set(null);
    this.messages.set([]);
    this.message.set('');
    this.error.set(null);
  }
}
