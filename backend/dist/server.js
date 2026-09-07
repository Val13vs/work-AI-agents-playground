import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import ticketsRouter from './routes/tickets.routes.js';
import apiDocumentationRouter from './routes/api-documentation.routes.js';
const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(cors({ origin: 'http://localhost:4200', }));
app.use(express.json());
app.use('/api/tickets', ticketsRouter);
app.use('/api/docs', apiDocumentationRouter);
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'agent-lab-backend',
    });
});
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map