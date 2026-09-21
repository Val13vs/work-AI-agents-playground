import {
    MemorySession,
    run,
    withTrace
} from '@openai/agents';

import {
    assistantAgent
} from '../agents/assistant.agent.js';

import {
    createPendingApproval
} from './approval.service.js';

import type {
    AiResult
} from '../models/ai-result.model.js';

export async function askAssistant(
    message: string,
    session: MemorySession
): Promise<AiResult> {
    const result = await withTrace(
        'AI Agents Lab - Developer Assistant',
        async () => {
            return await run(
                assistantAgent,
                message,
                {
                    session,

                    toolExecution: {
                        preApprovalInputGuardrails: true
                    }
                }
            );
        }
    );

    const interruption =
        result.interruptions?.[0];

    if (interruption) {
        const approvalId =
            createPendingApproval(
                result.state,
                interruption,
                session
            );

        const rawItem =
            interruption.rawItem;

        if (rawItem.type !== 'function_call') {
            throw new Error(
                `Unsupported approval interruption type: ${rawItem.type}`
            );
        }

        return {
            status: 'approval_required',
            approvalId,
            toolName: rawItem.name,
            arguments: rawItem.arguments
        };
    }

    return {
        status: 'completed',
        answer: result.finalOutput ?? ''
    };
}