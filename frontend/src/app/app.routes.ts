import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tickets'
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import(
        './features/tickets/pages/tickets-page/tickets-page'
        ).then(m => m.TicketsPage)
  },
  {
    path: 'api-docs',
    loadComponent: () =>
      import(
        './features/api-docs/pages/api-docs-page/api-docs-page'
        ).then(m => m.ApiDocsPage)
  },
  {
    path: 'agent',
    loadComponent: () =>
      import(
        './features/agent-playground/pages/agent-playground-page/agent-playground-page'
        ).then(m => m.AgentPlaygroundPage)
  }
];
