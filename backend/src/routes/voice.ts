import { Router } from 'express';
import { synthesizeSpeech } from '../services/elevenlabs.js';
import { VoiceRequestSchema } from '../utils/schemas.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = VoiceRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }

        const { text } = parseResult.data;

        const audioBuffer = await synthesizeSpeech(text);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
        });
        res.send(audioBuffer);
    } catch (error) {
        console.error('Voice error:', error);
        res.status(500).json({ error: 'Failed to synthesize voice' });
    }
});

export default router;
