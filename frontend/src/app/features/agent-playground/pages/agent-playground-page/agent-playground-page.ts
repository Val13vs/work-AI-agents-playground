import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  AgentApiService
} from '../../data-access/agent-api.service';

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
  readonly answer = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  updateMessage(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.message.set(textarea.value);
  }

  sendMessage(): void {
    const message = this.message().trim();

    if (!message || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.answer.set('');

    this.agentApi.chat(message).subscribe({
      next: response => {
        this.answer.set(response.answer);
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
}
