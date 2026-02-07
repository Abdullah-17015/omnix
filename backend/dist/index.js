"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_js_1 = require("./middleware/auth.js");
const analyze_js_1 = __importDefault(require("./routes/analyze.js"));
const research_js_1 = __importDefault(require("./routes/research.js"));
const ecoscore_js_1 = __importDefault(require("./routes/ecoscore.js"));
const chat_js_1 = __importDefault(require("./routes/chat.js"));
const voice_js_1 = __importDefault(require("./routes/voice.js"));
// Load environment variables
dotenv_1.default.config();
// Initialize Firebase Admin
if (!firebase_admin_1.default.apps.length) {
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (serviceAccountPath && serviceAccountPath.endsWith('.json')) {
        try {
            // Use resolve to handle relative paths if needed, or just let certificate handle it
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert(serviceAccountPath),
                projectId: process.env.GCP_PROJECT_ID,
            });
            console.log('Firebase Admin initialized with service account certificate');
        }
        catch (error) {
            console.error('Failed to initialize with certificate, falling back to applicationDefault:', error);
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.applicationDefault(),
                projectId: process.env.GCP_PROJECT_ID,
            });
        }
    }
    else {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.applicationDefault(),
            projectId: process.env.GCP_PROJECT_ID,
        });
        console.log('Firebase Admin initialized with application default credentials');
    }
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' })); // Allow larger payloads for images
// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// Protected API routes
app.use('/api/analyze-image', auth_js_1.verifyFirebaseToken, analyze_js_1.default);
app.use('/api/live-research', auth_js_1.verifyFirebaseToken, research_js_1.default);
app.use('/api/eco-score', auth_js_1.verifyFirebaseToken, ecoscore_js_1.default);
app.use('/api/chat', auth_js_1.verifyFirebaseToken, chat_js_1.default);
app.use('/api/voice', auth_js_1.verifyFirebaseToken, voice_js_1.default);
// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`Omnix backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map