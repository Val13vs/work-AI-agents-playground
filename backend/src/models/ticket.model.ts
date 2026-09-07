export type TicketStatus =
    | 'OPEN'
    | 'IN_PROGRESS'
    | 'DONE';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    requirements: string[];
    relatedApi?: string;
}