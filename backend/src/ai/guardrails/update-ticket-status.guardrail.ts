import {
    defineToolInputGuardrail,
    ToolGuardrailFunctionOutputFactory
} from '@openai/agents';

import {
    TicketStatus
} from '../../models/ticket.model.js';

import {
    tickets
} from '../../data/tickets.data.js';

interface UpdateTicketStatusArguments {
    ticketId?: string;
    status?: TicketStatus;
}

const allowedTransitions: Record<
    TicketStatus,
    TicketStatus[]
> = {
    OPEN: ['IN_PROGRESS'],
    IN_PROGRESS: ['DONE'],
    DONE: []
};

export const updateTicketStatusGuardrail =
    defineToolInputGuardrail({
        name: 'validate_ticket_status_transition',

        run: async ({ toolCall }) => {
            let args: UpdateTicketStatusArguments;

            try {
                args = JSON.parse(
                    toolCall.arguments
                ) as UpdateTicketStatusArguments;
            } catch {
                return ToolGuardrailFunctionOutputFactory.rejectContent(
                    'The ticket update arguments are invalid.'
                );
            }

            if (!args.ticketId || !args.status) {
                return ToolGuardrailFunctionOutputFactory.rejectContent(
                    'A ticket ID and target status are required.'
                );
            }

            const ticket = tickets.find(
                item =>
                    item.id.toLowerCase() ===
                    args.ticketId!.toLowerCase()
            );

            if (!ticket) {
                return ToolGuardrailFunctionOutputFactory.rejectContent(
                    `Ticket ${args.ticketId} does not exist.`
                );
            }

            if (ticket.status === args.status) {
                return ToolGuardrailFunctionOutputFactory.rejectContent(
                    `Ticket ${ticket.id} is already ${args.status}.`
                );
            }

            const allowedStatuses =
                allowedTransitions[ticket.status];

            if (!allowedStatuses.includes(args.status)) {
                return ToolGuardrailFunctionOutputFactory.rejectContent(
                    `Changing ${ticket.id} from ${ticket.status} to ${args.status} is not allowed.`
                );
            }

            console.log(
                `[GUARDRAIL] Allowed status transition: ` +
                `${ticket.id} ${ticket.status} -> ${args.status}`
            );

            return ToolGuardrailFunctionOutputFactory.allow();
        }
    });