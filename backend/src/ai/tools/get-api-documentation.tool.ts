import { tool } from '@openai/agents';
import { z } from 'zod';

import {
    apiDocumentation
} from '../../data/api-documentation.data.js';

export const getApiDocumentationTool = tool({
    name: 'get_api_documentation',

    description:
        'Retrieve internal API documentation when the exact API resource name is known.',

    parameters: z.object({
        resource: z
            .string()
            .describe(
                'The exact API resource name.'
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