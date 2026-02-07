import type { EvidencePack, OriginPin, ScanDocument } from '../types/index.js';
export declare function generateCacheKey(brand: string, model: string, category: string): string;
export declare function getCachedResearch(cacheKey: string): Promise<{
    evidencePack: EvidencePack;
    originPins: OriginPin[];
} | null>;
export declare function setCachedResearch(cacheKey: string, evidencePack: EvidencePack, originPins: OriginPin[]): Promise<void>;
export declare function saveScan(scanData: Omit<ScanDocument, 'createdAt'>): Promise<string>;
export declare function getUserScans(uid: string, limit?: number): Promise<ScanDocument[]>;
export declare function getScanById(scanId: string): Promise<ScanDocument | null>;
//# sourceMappingURL=firestore.d.ts.map