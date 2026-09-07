import { tool } from '@openai/agents';
import { z } from 'zod';

import {
    apiDocumentation
} from '../../data/api-documentation.data.js';

export const getApiDocumentationTool = tool({
    name: 'get_api_documentation',

    description:
        'Get internal API documentation for a resource such as Locations, Events, or Users. Use this tool when implementation requires information about internal API endpoints.',

    parameters: z.object({
        resource: z
            .string()
            .describe(
                'The API resource name, for example Locations, Events, or Users'
            )
    }),

    execute: async ({ resource }) => {
        console.log(
            `[TOOL] get_api_documentation called with resource=${resource}`
        );

        const documentation = apiDocumentation.find(
            item =>
                item.resource.toLowerCase() === resource.toLowerCase()
        );

        if (!documentation) {
            return {
                found: false,
                message:
                    `API documentation for ${resource} was not found.`
            };
        }

        return {
            found: true,
            documentation
        };
    }
});