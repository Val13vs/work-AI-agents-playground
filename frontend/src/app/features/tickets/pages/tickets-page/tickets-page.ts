import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { TicketsApiService } from '../../data-access/tickets-api.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [],
  templateUrl: './tickets-page.html',
  styleUrl: './tickets-page.scss'
})
export class TicketsPage implements OnInit {
  private readonly ticketsApi = inject(TicketsApiService);

  readonly tickets = signal<Ticket[]>([]);
  readonly selectedTicket = signal<Ticket | null>(null);

  readonly loading = signal(false);
  readonly detailsLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTickets();
  }

  selectTicket(id: string): void {
    this.detailsLoading.set(true);
    this.error.set(null);

    this.ticketsApi.getTicketById(id).subscribe({
      next: ticket => {
        this.selectedTicket.set(ticket);
        this.detailsLoading.set(false);
      },
      error: () => {
        this.error.set(`Could not load ticket ${id}.`);
        this.detailsLoading.set(false);
      }
    });
  }

  private loadTickets(): void {
    this.loading.set(true);
    this.error.set(null);

    this.ticketsApi.getTickets().subscribe({
      next: tickets => {
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load development tickets.');
        this.loading.set(false);
      }
    });
  }
}
