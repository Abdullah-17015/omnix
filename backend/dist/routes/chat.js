"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vertexai_js_1 = require("../services/vertexai.js");
const schemas_js_1 = require("../utils/schemas.js");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = schemas_js_1.ChatRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }
        const { scanContext, message, history } = parseResult.data;
        const response = await (0, vertexai_js_1.generateChatResponse)({
            product: scanContext.detectedProduct,
            ecoScore: scanContext.ecoScore,
            claims: scanContext.evidencePack.claims,
        }, message, history);
        res.json(response);
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map