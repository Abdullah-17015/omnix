import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            uid?: string;
            email?: string;
        }
    }
}

export async function verifyFirebaseToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization header' });
        return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.uid = decodedToken.uid;
        req.email = decodedToken.email;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
}
