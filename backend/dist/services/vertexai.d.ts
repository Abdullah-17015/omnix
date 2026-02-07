import type { DetectedProduct, Claim, EcoScore } from '../types/index.js';
export declare function analyzeImageWithGemini(imageBase64: string): Promise<DetectedProduct>;
export declare function synthesizeEvidenceWithGemini(product: DetectedProduct, scrapedContent: Array<{
    url: string;
    title: string;
    content: string;
}>): Promise<{
    claims: Claim[];
    overallConfidence: number;
}>;
export declare function generateEcoScoreExplanation(product: DetectedProduct, ecoScore: Omit<EcoScore, 'summary' | 'rationaleBullets'>, claims: Claim[]): Promise<{
    summary: string;
    rationaleBullets: string[];
}>;
export declare function generateGemmaTips(product: DetectedProduct, materials: string[]): Promise<string[]>;
export declare function generateChatResponse(context: {
    product: DetectedProduct;
    ecoScore: EcoScore;
    claims: Claim[];
}, message: string, history: Array<{
    role: string;
    content: string;
}>): Promise<{
    answer: string;
    citations: string[];
    followups: string[];
}>;
//# sourceMappingURL=vertexai.d.ts.map