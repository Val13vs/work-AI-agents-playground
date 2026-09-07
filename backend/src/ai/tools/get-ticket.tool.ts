import { tool } from '@openai/agents';
import { z } from 'zod';

import { tickets } from '../../data/tickets.data.js';

export const getTicketTool = tool({
    name: 'get_ticket',

    description:
        'Get information about an internal development ticket by its ID. Use this tool when the user asks about a ticket such as DEV-101.',

    parameters: z.object({
        ticketId: z
            .string()
            .describe('The development ticket ID, for example DEV-101')
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