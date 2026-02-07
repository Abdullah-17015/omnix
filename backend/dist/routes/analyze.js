"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vertexai_js_1 = require("../services/vertexai.js");
const schemas_js_1 = require("../utils/schemas.js");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = schemas_js_1.AnalyzeImageRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }
        const { imageBase64, imageUrl } = parseResult.data;
        let base64Data;
        if (imageBase64) {
            // Remove data URL prefix if present
            base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        }
        else if (imageUrl) {
            // Fetch image from URL and convert to base64
            const response = await fetch(imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString('base64');
        }
        else {
            res.status(400).json({ error: 'Either imageBase64 or imageUrl required' });
            return;
        }
        const detectedProduct = await (0, vertexai_js_1.analyzeImageWithGemini)(base64Data);
        res.json(detectedProduct);
    }
    catch (error) {
        console.error('Analyze image error:', error);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
});
exports.default = router;
//# sourceMappingURL=analyze.js.map