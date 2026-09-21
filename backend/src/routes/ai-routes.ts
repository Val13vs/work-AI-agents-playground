import { Router } from 'express';
import { run } from '@openai/agents';

import {
    askAssistant
} from '../ai/services/ai.service.js';

import {
    clearSession,
    getOrCreateSession
} from '../ai/services/session.service.js';

import {
    createPendingApproval,
    getPendingApproval,
    removePendingApproval
} from '../ai/services/approval.service.js';

import {
    assistantAgent
} from '../ai/agents/assistant.agent.js';

const router = Router();

/**
 * Send a message to the AI assistant.
 *
 * If conversationId is provided, the existing conversation
 * session will be reused.
 *
 * If the agent wants to execute a tool that requires approval,
 * the response will contain status: "approval_required".
 */
router.post('/chat', async (req, res) => {
    const {
        message,
        conversationId
    } = req.body;

    if (
        typeof message !== 'string' ||
        !message.trim()
    ) {
        res.status(400).json({
            message: 'Message is required.'
        });

        return;
    }

    try {
        const conversation =
            getOrCreateSession(
                typeof conversationId === 'string'
                    ? conversationId
                    : undefined
            );

        const result = await askAssistant(
            message.trim(),
            conversation.session
        );

        res.json({
            ...result,
            conversationId:
            conversation.conversationId
        });
    } catch (error) {
        console.error(
            'AI request failed:',
            error
        );

        res.status(500).json({
            message: 'AI request failed.'
        });
    }
});

/**
 * Approve or reject a pending tool execution.
 *
 * Example body:
 *
 * {
 *   "approved": true
 * }
 *
 * or:
 *
 * {
 *   "approved": false
 * }
 */
router.post(
    '/approvals/:approvalId',
    async (req, res) => {
        const { approvalId } = req.params;
        const { approved } = req.body;

        if (typeof approved !== 'boolean') {
            res.status(400).json({
                message:
                    'The approved property must be a boolean.'
            });

            return;
        }

        const pending =
            getPendingApproval(approvalId);

        if (!pending) {
            res.status(404).json({
                message:
                    'Approval request was not found.'
            });

            return;
        }

        try {
            /**
             * Store the human decision inside the RunState.
             *
             * The tool has NOT executed yet.
             */
            if (approved) {
                pending.state.approve(
                    pending.interruption
                );
            } else {
                pending.state.reject(
                    pending.interruption,
                    {
                        message:
                            'The user rejected this action.'
                    }
                );
            }

            /**
             * Prevent the same approval request
             * from being submitted twice.
             */
            removePendingApproval(approvalId);

            /**
             * Resume the SAME agent run from the
             * state where it was interrupted.
             *
             * This is the "resume approval run"
             * we talked about.
             */
            const result = await run(
                assistantAgent,
                pending.state,
                {
                    session: pending.session,

                    toolExecution: {
                        preApprovalInputGuardrails: true
                    }
                }
            );

            /**
             * It is possible for the resumed run
             * to request another approval.
             *
             * For our PoC we handle the first
             * pending interruption.
             */
            const nextInterruption =
                result.interruptions?.[0];

            if (nextInterruption) {
                const nextApprovalId =
                    createPendingApproval(
                        result.state,
                        nextInterruption,
                        pending.session
                    );

                res.json({
                    status: 'approval_required',
                    approvalId: nextApprovalId,
                    toolName:
                    nextInterruption.name,
                    arguments:
                    nextInterruption.arguments
                });

                return;
            }

            res.json({
                status: 'completed',
                answer:
                    result.finalOutput ?? ''
            });
        } catch (error) {
            console.error(
                'Failed to resume AI run:',
                error
            );

            res.status(500).json({
                message:
                    'Could not resume the AI run.'
            });
        }
    }
);

/**
 * Delete an existing conversation/session.
 *
 * Used by the "New chat" button.
 */
router.delete(
    '/conversations/:conversationId',
    async (req, res) => {
        const { conversationId } =
            req.params;

        try {
            const cleared =
                await clearSession(
                    conversationId
                );

            if (!cleared) {
                res.status(404).json({
                    message:
                        'Conversation was not found.'
                });

                return;
            }

            res.status(204).send();
        } catch (error) {
            console.error(
                'Failed to clear conversation:',
                error
            );

            res.status(500).json({
                message:
                    'Could not clear conversation.'
            });
        }
    }
);

export default router;