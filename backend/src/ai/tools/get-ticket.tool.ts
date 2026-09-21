import { tool } from '@openai/agents';
import { z } from 'zod';

import { tickets } from '../../data/tickets.data.js';

export const getTicketTool = tool({
    name: 'get_ticket',

    description:
        'Retrieve an internal development ticket when a specific ticket ID is known.',

    parameters: z.object({
        ticketId: z
            .string()
            .describe('The exact development ticket ID')
    }),

    execute: async ({ ticketId }) => {
        console.log(
            `[TOOL] get_ticket called with ticketId=${ticketId}`
        );

        const ticket = tickets.find(
            ticket =>
                ticket.id.toLowerCase() === ticketId.toLowerCase()
        );

        if (!ticket) {
            return {
                found: false,
                message: `Ticket ${ticketId} was not found.`
            };
        }

        return {
            found: true,
            ticket
        };
    }
});