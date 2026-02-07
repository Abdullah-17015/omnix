"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeSpeech = synthesizeSpeech;
exports.generateVoiceScript = generateVoiceScript;
const axios_1 = __importDefault(require("axios"));
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
async function synthesizeSpeech(text) {
    if (!ELEVENLABS_API_KEY) {
        throw new Error('ElevenLabs API key not configured');
    }
    // Truncate text if too long
    const truncatedText = text.slice(0, 1000);
    try {
        const response = await axios_1.default.post(`${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
            text: truncatedText,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
            },
        }, {
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
            },
            responseType: 'arraybuffer',
            timeout: 30000,
        });
        return Buffer.from(response.data);
    }
    catch (error) {
        console.error('ElevenLabs synthesis failed:', error);
        throw new Error('Voice synthesis failed');
    }
}
function generateVoiceScript(brand, model, category, ecoScore, topOrigins) {
    const originHighlights = topOrigins
        .slice(0, 2)
        .map(o => `${o.material} from ${o.place}`)
        .join(' and ');
    const scoreDescription = ecoScore >= 70 ? 'an excellent' :
        ecoScore >= 50 ? 'a moderate' :
            ecoScore >= 30 ? 'a below average' : 'a low';
    return `This ${brand} ${model} ${category} received ${scoreDescription} eco score of ${ecoScore} out of 100. Key materials include ${originHighlights}. Check the detailed breakdown for sourcing information and personalized sustainability tips.`;
}
//# sourceMappingURL=elevenlabs.js.map