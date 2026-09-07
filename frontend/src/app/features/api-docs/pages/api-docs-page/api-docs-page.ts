import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { JsonPipe } from '@angular/common';

import {
  ApiDocsApiService
} from '../../data-access/api-docs-api.service';

import {
  ApiDocumentation
} from '../../models/api-documentation.model';

@Component({
  selector: 'app-api-docs-page',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './api-docs-page.html',
  styleUrl: './api-docs-page.scss'
})
export class ApiDocsPage implements OnInit {
  private readonly apiDocsApi =
    inject(ApiDocsApiService);

  readonly documentation =
    signal<ApiDocumentation[]>([]);

  readonly selectedDocumentation =
    signal<ApiDocumentation | null>(null);

  readonly loading = signal(false);
  readonly detailsLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDocumentation();
  }

  selectResource(resource: string): void {
    this.detailsLoading.set(true);
    this.error.set(null);

    this.apiDocsApi
      .getDocumentationByResource(resource)
      .subscribe({
        next: documentation => {
          this.selectedDocumentation.set(documentation);
          this.detailsLoading.set(false);
        },
        error: () => {
          this.error.set(
            `Could not load API documentation for ${resource}.`
          );

          this.detailsLoading.set(false);
        }
      });
  }

  private loadDocumentation(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiDocsApi.getDocumentation().subscribe({
      next: documentation => {
        this.documentation.set(documentation);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'Could not load API documentation.'
        );

        this.loading.set(false);
      }
    });
  }
}
