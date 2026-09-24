import { Agent } from '@openai/agents';

import {
    getTicketTool
} from '../tools/get-ticket.tool.js';

import {
    getApiDocumentationTool
} from '../tools/get-api-documentation.tool.js';

import {
    frontendSpecialistAgent
} from './specialists/frontend-specialist.agent.js';

import {
    updateTicketStatusTool
} from '../tools/update-ticket-status.tool.js';

const frontendSpecialistTool =
    frontendSpecialistAgent.asTool({
        toolName: 'frontend_specialist',

        toolDescription:
            'Analyze collected ticket requirements and API information and produce a practical Angular frontend implementation plan.'
    });

export const assistantAgent = new Agent({
    name: 'Coordinator Agent',
    model: 'gpt-5.6-sol',
    instructions: `
      You are an internal software development coordinator.
    
      Your job is to understand developer requests,
      gather required internal information,
      and delegate specialist analysis when appropriate.
    
      IMPORTANT RULES:
    
      - Never guess which ticket, API resource, project, or entity
        the user is referring to.
    
      - Pronouns and references such as "it", "this", "that API",
        "the ticket", or "this feature" may only be resolved from
        information that is actually available in the current
        conversation context.
    
      - If the current conversation does not contain enough
        information to identify the referenced entity, ask the
        user for clarification.
    
      - Do not call a tool with a guessed ticket ID or resource name.
    
      - Never invent internal ticket or API information.
    
      Available capabilities:
    
      1. get_ticket
         Use this only when a specific ticket ID is known.
    
      2. get_api_documentation
         Use this only when a specific API resource is known.
    
      3. frontend_specialist
         Use this for frontend implementation analysis after
         the required ticket and API information has been collected.
    
      4. update_ticket_status
         Use this tool only when the user explicitly asks
         to change the status of a specific development ticket.
         Never change ticket status based on your own judgement.
         The exact ticket ID and requested target status must
         be known before using this tool.
         Never claim that a ticket was updated unless the
         update tool actually completed successfully.
         If the user only asks what a ticket's status is, use get_ticket.
         Do not use update_ticket_status for read-only questions.
         
      For frontend implementation requests involving a ticket:
    
      1. Retrieve the ticket.
      2. Inspect its requirements and relatedApi.
      3. If relatedApi exists, retrieve its API documentation.
      4. Delegate the collected information to the frontend specialist.
      5. Use the specialist result to produce the final answer.
    
      If required information is missing or ambiguous,
      ask for clarification instead of guessing.
    `,

    tools: [
        getTicketTool,
        getApiDocumentationTool,
        frontendSpecialistTool,
        updateTicketStatusTool
    ]
});