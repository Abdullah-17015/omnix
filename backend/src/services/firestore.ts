import admin from 'firebase-admin';
import type { EvidencePack, OriginPin, ScanDocument, CacheDocument } from '../types/index.js';

// Initialize Firestore (assumes Firebase Admin is already initialized)
function getFirestore() {
    return admin.firestore();
}

// Cache operations
const CACHE_TTL_HOURS = 24;

export function generateCacheKey(brand: string, model: string, category: string): string {
    return `${brand}|${model}|${category}`.toLowerCase().replace(/\s+/g, '_');
}

export async function getCachedResearch(
    cacheKey: string
): Promise<{ evidencePack: EvidencePack; originPins: OriginPin[] } | null> {
    try {
        const db = getFirestore();
        const doc = await db.collection('cache').doc(cacheKey).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data() as CacheDocument;

        // Check if cache is expired
        // Firestore returns Timestamp even if interface says Date
        const expiresAt = (data.expiresAt as any).toDate ? (data.expiresAt as any).toDate() : data.expiresAt;

        if (expiresAt < new Date()) {
            // Delete expired cache
            await db.collection('cache').doc(cacheKey).delete();
            return null;
        }

        return {
            evidencePack: data.evidencePack,
            originPins: data.originPins,
        };
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
}

export async function setCachedResearch(
    cacheKey: string,
    evidencePack: EvidencePack,
    originPins: OriginPin[]
): Promise<void> {
    try {
        const db = getFirestore();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000);

        await db.collection('cache').doc(cacheKey).set({
            createdAt: admin.firestore.Timestamp.fromDate(now),
            expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
            evidencePack,
            originPins,
        });
    } catch (error) {
        console.error('Cache write error:', error);
    }
}

// Scan operations
export async function saveScan(scanData: Omit<ScanDocument, 'createdAt'>): Promise<string> {
    try {
        const db = getFirestore();
        const docRef = await db.collection('scans').add({
            ...scanData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Failed to save scan:', error);
        throw new Error('Failed to save scan');
    }
}

export async function getUserScans(uid: string, limit: number = 20): Promise<ScanDocument[]> {
    try {
        const db = getFirestore();
        const snapshot = await db
            .collection('scans')
            .where('uid', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => ({
            ...(doc.data() as ScanDocument),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
    } catch (error) {
        console.error('Failed to get user scans:', error);
        return [];
    }
}

export async function getScanById(scanId: string): Promise<ScanDocument | null> {
    try {
        const db = getFirestore();
        const doc = await db.collection('scans').doc(scanId).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data() as ScanDocument;
        return {
            ...data,
            createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
        };
    } catch (error) {
        console.error('Failed to get scan:', error);
        return null;
    }
}
