"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCacheKey = generateCacheKey;
exports.getCachedResearch = getCachedResearch;
exports.setCachedResearch = setCachedResearch;
exports.saveScan = saveScan;
exports.getUserScans = getUserScans;
exports.getScanById = getScanById;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// Initialize Firestore (assumes Firebase Admin is already initialized)
function getFirestore() {
    return firebase_admin_1.default.firestore();
}
// Cache operations
const CACHE_TTL_HOURS = 24;
function generateCacheKey(brand, model, category) {
    return `${brand}|${model}|${category}`.toLowerCase().replace(/\s+/g, '_');
}
async function getCachedResearch(cacheKey) {
    try {
        const db = getFirestore();
        const doc = await db.collection('cache').doc(cacheKey).get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        // Check if cache is expired
        // Firestore returns Timestamp even if interface says Date
        const expiresAt = data.expiresAt.toDate ? data.expiresAt.toDate() : data.expiresAt;
        if (expiresAt < new Date()) {
            // Delete expired cache
            await db.collection('cache').doc(cacheKey).delete();
            return null;
        }
        return {
            evidencePack: data.evidencePack,
            originPins: data.originPins,
        };
    }
    catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
}
async function setCachedResearch(cacheKey, evidencePack, originPins) {
    try {
        const db = getFirestore();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000);
        await db.collection('cache').doc(cacheKey).set({
            createdAt: firebase_admin_1.default.firestore.Timestamp.fromDate(now),
            expiresAt: firebase_admin_1.default.firestore.Timestamp.fromDate(expiresAt),
            evidencePack,
            originPins,
        });
    }
    catch (error) {
        console.error('Cache write error:', error);
    }
}
// Scan operations
async function saveScan(scanData) {
    try {
        const db = getFirestore();
        const docRef = await db.collection('scans').add({
            ...scanData,
            createdAt: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Failed to save scan:', error);
        throw new Error('Failed to save scan');
    }
}
async function getUserScans(uid, limit = 20) {
    try {
        const db = getFirestore();
        const snapshot = await db
            .collection('scans')
            .where('uid', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        return snapshot.docs.map(doc => ({
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
    }
    catch (error) {
        console.error('Failed to get user scans:', error);
        return [];
    }
}
async function getScanById(scanId) {
    try {
        const db = getFirestore();
        const doc = await db.collection('scans').doc(scanId).get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
        };
    }
    catch (error) {
        console.error('Failed to get scan:', error);
        return null;
    }
}
//# sourceMappingURL=firestore.js.map