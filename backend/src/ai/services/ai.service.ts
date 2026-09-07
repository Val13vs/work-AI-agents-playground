import { run } from '@openai/agents';

import { assistantAgent } from '../agents/assistant.agent.js';

export async function askAssistant(
    message: string
): Promise<string> {

    const result = await run(
        assistantAgent,
        message
    );

    return result.finalOutput ?? '';
}