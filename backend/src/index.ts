import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

import { verifyFirebaseToken } from './middleware/auth.js';
import analyzeRouter from './routes/analyze.js';
import researchRouter from './routes/research.js';
import ecosoreRouter from './routes/ecoscore.js';
import chatRouter from './routes/chat.js';
import voiceRouter from './routes/voice.js';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.GCP_PROJECT_ID,
    });
}

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for images

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Protected API routes
app.use('/api/analyze-image', verifyFirebaseToken, analyzeRouter);
app.use('/api/live-research', verifyFirebaseToken, researchRouter);
app.use('/api/eco-score', verifyFirebaseToken, ecosoreRouter);
app.use('/api/chat', verifyFirebaseToken, chatRouter);
app.use('/api/voice', verifyFirebaseToken, voiceRouter);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Omnix backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
