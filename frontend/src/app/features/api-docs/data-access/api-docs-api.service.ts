import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiDocumentation } from '../models/api-documentation.model';

@Injectable({
  providedIn: 'root'
})
export class ApiDocsApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:3000/api/docs';

  getDocumentation(): Observable<ApiDocumentation[]> {
    return this.http.get<ApiDocumentation[]>(
      this.baseUrl
    );
  }

  getDocumentationByResource(
    resource: string
  ): Observable<ApiDocumentation> {
    return this.http.get<ApiDocumentation>(
      `${this.baseUrl}/${resource}`
    );
  }
}
