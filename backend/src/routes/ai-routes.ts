import { Router } from 'express';

import { askAssistant } from '../ai/services/ai.service.js';

const router = Router();

router.post('/chat', async (req, res) => {
    const { message } = req.body;

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
        const answer = await askAssistant(message);

        res.json({
            answer
        });
    } catch (error) {
        console.error('AI request failed:', error);

        res.status(500).json({
            message: 'AI request failed.'
        });
    }
});

export default router;