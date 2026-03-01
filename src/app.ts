import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import apiRoutes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

// Global error handler
app.use(errorHandler);

export default app;
