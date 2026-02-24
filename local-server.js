import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// API Handlers
import submitHandler from './api/submit.js';
import leaderboardHandler from './api/leaderboard.js';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(express.json());

// Proxy-friendly wrapper for Vercel handlers
const vercelToExpress = (handler) => async (req, res) => {
    const vercelRes = {
        status: (code) => {
            res.status(code);
            return vercelRes;
        },
        json: (data) => {
            res.json(data);
            return vercelRes;
        },
        setHeader: (name, value) => {
            res.setHeader(name, value);
            return vercelRes;
        }
    };
    try {
        await handler(req, vercelRes);
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

app.post('/api/submit', vercelToExpress(submitHandler));
app.get('/api/leaderboard', vercelToExpress(leaderboardHandler));

app.listen(port, () => {
    console.log(`Local API Server running at http://localhost:${port}`);
    console.log(`Vite Proxy should target this server for /api calls.`);
});
