"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseToken = verifyFirebaseToken;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
async function verifyFirebaseToken(req, res, next) {
    // Dev bypass: if DISABLE_AUTH is set to 'true', skip token verification
    if (process.env.DISABLE_AUTH === 'true') {
        console.warn('verifyFirebaseToken: DISABLE_AUTH=true, skipping token verification (development only)');
        // allow a fake uid for request handlers
        req.uid = 'dev-user';
        req.email = 'dev@example.com';
        next();
        return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization header' });
        return;
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(idToken);
        req.uid = decodedToken.uid;
        req.email = decodedToken.email;
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
}
//# sourceMappingURL=auth.js.map