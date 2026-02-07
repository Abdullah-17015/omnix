import { z } from 'zod';

export const ProductCategorySchema = z.enum([
    'smartphone',
    'laptop',
    'smartwatch',
    'headphones',
    'tablet',
    'camera',
    'console',
    'generic_electronics',
]);

export const ComponentSchema = z.object({
    name: z.string(),
    materials: z.array(z.string()),
});

export const DetectedProductSchema = z.object({
    category: ProductCategorySchema,
    brand: z.string(),
    model: z.string(),
    confidence: z.number().min(0).max(1),
    identifiers: z.array(z.string()),
    components: z.array(ComponentSchema),
    materialsUsed: z.array(z.string()),
});

export const SourceSchema = z.object({
    title: z.string(),
    url: z.string().url(),
    domain: z.string(),
    snippet: z.string(),
});

export const ClaimSchema = z.object({
    type: z.enum(['sourcing', 'policy', 'controversy', 'recycling']),
    text: z.string(),
    materials: z.array(z.string()),
    places: z.array(z.string()),
    citationUrl: z.string().url(),
    confidence: z.number().min(0).max(1),
});

export const EvidencePackSchema = z.object({
    sources: z.array(SourceSchema),
    claims: z.array(ClaimSchema),
    overallConfidence: z.number().min(0).max(1),
});

export const OriginPinSchema = z.object({
    material: z.string(),
    place: z.string(),
    lat: z.number(),
    lng: z.number(),
    citationUrl: z.string(),
    confidence: z.number().min(0).max(1),
});

export const EcoScoreSchema = z.object({
    total: z.number().min(0).max(100),
    sourcing: z.number().min(0).max(40),
    transparency: z.number().min(0).max(30),
    repairability: z.number().min(0).max(30),
    rationaleBullets: z.array(z.string()),
    summary: z.string(),
    gemmaTips: z.array(z.string()),
});

export const AnalyzeImageRequestSchema = z.object({
    imageBase64: z.string().optional(),
    imageUrl: z.string().url().optional(),
}).refine(
    (data) => data.imageBase64 || data.imageUrl,
    { message: 'Either imageBase64 or imageUrl must be provided' }
);

export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    citations: z.array(z.string()).optional(),
});

export const ChatRequestSchema = z.object({
    scanContext: z.object({
        detectedProduct: DetectedProductSchema,
        ecoScore: EcoScoreSchema,
        evidencePack: EvidencePackSchema,
    }),
    message: z.string().min(1).max(2000),
    history: z.array(ChatMessageSchema),
});

export const VoiceRequestSchema = z.object({
    text: z.string().min(1).max(1000),
});

export const EcoScoreRequestSchema = z.object({
    detectedProduct: DetectedProductSchema,
    evidencePack: EvidencePackSchema,
    originPins: z.array(OriginPinSchema),
});
