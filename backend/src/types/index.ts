// Core domain types for Omnix

export interface DetectedProduct {
    category: ProductCategory;
    brand: string;
    model: string;
    confidence: number;
    identifiers: string[];
    components: Component[];
    materialsUsed: string[];
}

export type ProductCategory =
    | 'smartphone'
    | 'laptop'
    | 'smartwatch'
    | 'headphones'
    | 'tablet'
    | 'camera'
    | 'console'
    | 'generic_electronics';

export interface Component {
    name: string;
    materials: string[];
}

export interface EvidencePack {
    sources: Source[];
    claims: Claim[];
    overallConfidence: number;
}

export interface Source {
    title: string;
    url: string;
    domain: string;
    snippet: string;
}

export interface Claim {
    type: 'sourcing' | 'policy' | 'controversy' | 'recycling';
    text: string;
    materials: string[];
    places: string[];
    citationUrl: string;
    confidence: number;
}

export interface OriginPin {
    material: string;
    place: string;
    lat: number;
    lng: number;
    citationUrl: string;
    confidence: number;
}

export interface EcoScore {
    total: number;
    sourcing: number;
    transparency: number;
    repairability: number;
    rationaleBullets: string[];
    summary: string;
    gemmaTips: string[];
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    citations?: string[];
}

export interface ChatRequest {
    scanContext: {
        detectedProduct: DetectedProduct;
        ecoScore: EcoScore;
        evidencePack: EvidencePack;
    };
    message: string;
    history: ChatMessage[];
}

export interface ChatResponse {
    answer: string;
    citations: string[];
    followups: string[];
}

export interface ScanDocument {
    uid: string;
    createdAt: Date;
    detectedProduct: DetectedProduct;
    evidencePack: Omit<EvidencePack, 'sources'> & { sourceSummary: string };
    originPins: OriginPin[];
    ecoScore: EcoScore;
}

export interface CacheDocument {
    createdAt: Date;
    expiresAt: Date;
    evidencePack: EvidencePack;
    originPins: OriginPin[];
}
