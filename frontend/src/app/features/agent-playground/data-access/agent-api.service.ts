import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AiChatRequest,
  AiChatResponse
} from '../models/ai-chat.model';

@Injectable({
  providedIn: 'root'
})
export class AgentApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:3000/api/ai';

  chat(message: string): Observable<AiChatResponse> {
    const request: AiChatRequest = {
      message
    };

    return this.http.post<AiChatResponse>(
      `${this.baseUrl}/chat`,
      request
    );
  }
}
