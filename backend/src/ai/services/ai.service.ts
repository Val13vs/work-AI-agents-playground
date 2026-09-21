import { run, withTrace, MemorySession} from '@openai/agents';

import { assistantAgent } from '../agents/assistant.agent.js';

export async function askAssistant(
    message: string,
    session: MemorySession
): Promise<string> {

    const result = await withTrace(
        'AI Agents Lab - Developer Assistant',
        async () => {
            return await run(
                assistantAgent,
                message,
                {
                    session
                }
            );
        }
    );

    return result.finalOutput ?? '';
}