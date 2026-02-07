import { Router } from 'express';
import { generateChatResponse } from '../services/vertexai.js';
import { ChatRequestSchema } from '../utils/schemas.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = ChatRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }

        const { scanContext, message, history } = parseResult.data;

        const response = await generateChatResponse(
            {
                product: scanContext.detectedProduct,
                ecoScore: scanContext.ecoScore,
                claims: scanContext.evidencePack.claims,
            },
            message,
            history
        );

        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

export default router;
