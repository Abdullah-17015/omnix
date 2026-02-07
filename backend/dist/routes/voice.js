"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const elevenlabs_js_1 = require("../services/elevenlabs.js");
const schemas_js_1 = require("../utils/schemas.js");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = schemas_js_1.VoiceRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }
        const { text } = parseResult.data;
        const audioBuffer = await (0, elevenlabs_js_1.synthesizeSpeech)(text);
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
        });
        res.send(audioBuffer);
    }
    catch (error) {
        console.error('Voice error:', error);
        res.status(500).json({ error: 'Failed to synthesize voice' });
    }
});
exports.default = router;
//# sourceMappingURL=voice.js.map