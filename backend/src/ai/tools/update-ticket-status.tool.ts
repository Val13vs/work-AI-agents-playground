import { tool } from '@openai/agents';
import { z } from 'zod';

import { tickets } from '../../data/tickets.data.js';

import {
    updateTicketStatusGuardrail
} from '../guardrails/update-ticket-status.guardrail.js';

export const updateTicketStatusTool = tool({
    name: 'update_ticket_status',

    description:
        'Update the status of an existing development ticket when the user explicitly requests the change.',

    parameters: z.object({
        ticketId: z.string(),

        status: z.enum([
            'OPEN',
            'IN_PROGRESS',
            'DONE'
        ])
    }),

    inputGuardrails: [
        updateTicketStatusGuardrail
    ],

    needsApproval: true,

    execute: async ({ ticketId, status }) => {
        console.log(
            `[TOOL] update_ticket_status executing: ${ticketId} -> ${status}`
        );

        const ticket = tickets.find(
            item =>
                item.id.toLowerCase() ===
                ticketId.toLowerCase()
        );

        if (!ticket) {
            return {
                success: false,
                message: `Ticket ${ticketId} was not found.`
            };
        }

        const previousStatus = ticket.status;

        ticket.status = status;

        return {
            success: true,
            ticketId: ticket.id,
            previousStatus,
            newStatus: ticket.status
        };
    }
});