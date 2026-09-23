import express from 'express';
import cors from 'cors';

import { env } from './config/env.js';

import ticketsRouter from './routes/tickets.routes.js';

import apiDocumentationRouter
    from './routes/api-documentation.routes.js';

import aiRouter from './routes/ai-routes.js'

const app = express();

app.use(
    cors({
        origin: env.corsOrigin
    })
);

app.use(express.json());


app.get(
    '/api/health',
    (_req, res) => {
        res.json({
            status: 'ok',
            service: 'agent-lab-backend'
        });
    }
);


app.use(
    '/api/tickets',
    ticketsRouter
);

app.use(
    '/api/docs',
    apiDocumentationRouter
);

app.use(
    '/api/ai',
    aiRouter
);


/**
 * Unknown API route.
 */
app.use(
    (_req, res) => {
        res.status(404).json({
            message: 'API route was not found.'
        });
    }
);


/**
 * Final fallback error handler.
 */
app.use(
    (
        error: unknown,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
    ) => {
        console.error(
            'Unhandled server error:',
            error
        );

        res.status(500).json({
            message:
                'An unexpected server error occurred.'
        });
    }
);


app.listen(
    env.port,
    () => {
        console.log(
            `Backend running on http://localhost:${env.port}`
        );
    }
);