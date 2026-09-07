import { Router } from 'express';

import { tickets } from '../data/tickets.data.js';

const router = Router();

router.get('/', (_req, res) => {
    res.json(tickets);
});

router.get('/:id', (req, res) => {
    const ticket = tickets.find(
        ticket => ticket.id === req.params.id
    );

    if (!ticket) {
        res.status(404).json({
            message: `Ticket ${req.params.id} was not found`
        });

        return;
    }

    res.json(ticket);
});

export default router;