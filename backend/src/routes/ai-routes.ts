import { Router } from 'express';

import { askAssistant } from '../ai/services/ai.service.js';

import {
    clearSession,
    getOrCreateSession
} from '../ai/services/session.service.js';

const router = Router();

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
        const conversation = getOrCreateSession(
            typeof conversationId === 'string'
                ? conversationId
                : undefined
        );

        const answer = await askAssistant(
            message,
            conversation.session
        );

        res.json({
            answer,
            conversationId: conversation.conversationId
        });
    } catch (error) {
        console.error('AI request failed:', error);

        res.status(500).json({
            message: 'AI request failed.'
        });
    }
});

router.delete(
    '/conversations/:conversationId',
    async (req, res) => {
        const cleared = await clearSession(
            req.params.conversationId
        );

        if (!cleared) {
            res.status(404).json({
                message: 'Conversation was not found.'
            });

            return;
        }

        res.status(204).send();
    }
);

export default router;