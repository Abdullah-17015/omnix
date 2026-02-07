"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcoScoreRequestSchema = exports.VoiceRequestSchema = exports.ChatRequestSchema = exports.ChatMessageSchema = exports.AnalyzeImageRequestSchema = exports.EcoScoreSchema = exports.OriginPinSchema = exports.EvidencePackSchema = exports.ClaimSchema = exports.SourceSchema = exports.DetectedProductSchema = exports.ComponentSchema = exports.ProductCategorySchema = void 0;
const zod_1 = require("zod");
exports.ProductCategorySchema = zod_1.z.enum([
    'smartphone',
    'laptop',
    'smartwatch',
    'headphones',
    'tablet',
    'camera',
    'console',
    'generic_electronics',
]);
exports.ComponentSchema = zod_1.z.object({
    name: zod_1.z.string(),
    materials: zod_1.z.array(zod_1.z.string()),
});
exports.DetectedProductSchema = zod_1.z.object({
    category: exports.ProductCategorySchema,
    brand: zod_1.z.string(),
    model: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
    identifiers: zod_1.z.array(zod_1.z.string()),
    components: zod_1.z.array(exports.ComponentSchema),
    materialsUsed: zod_1.z.array(zod_1.z.string()),
});
exports.SourceSchema = zod_1.z.object({
    title: zod_1.z.string(),
    url: zod_1.z.string().url(),
    domain: zod_1.z.string(),
    snippet: zod_1.z.string(),
});
exports.ClaimSchema = zod_1.z.object({
    type: zod_1.z.enum(['sourcing', 'policy', 'controversy', 'recycling']),
    text: zod_1.z.string(),
    materials: zod_1.z.array(zod_1.z.string()),
    places: zod_1.z.array(zod_1.z.string()),
    citationUrl: zod_1.z.string().url(),
    confidence: zod_1.z.number().min(0).max(1),
});
exports.EvidencePackSchema = zod_1.z.object({
    sources: zod_1.z.array(exports.SourceSchema),
    claims: zod_1.z.array(exports.ClaimSchema),
    overallConfidence: zod_1.z.number().min(0).max(1),
});
exports.OriginPinSchema = zod_1.z.object({
    material: zod_1.z.string(),
    place: zod_1.z.string(),
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
    citationUrl: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
});
exports.EcoScoreSchema = zod_1.z.object({
    total: zod_1.z.number().min(0).max(100),
    sourcing: zod_1.z.number().min(0).max(40),
    transparency: zod_1.z.number().min(0).max(30),
    repairability: zod_1.z.number().min(0).max(30),
    rationaleBullets: zod_1.z.array(zod_1.z.string()),
    summary: zod_1.z.string(),
    gemmaTips: zod_1.z.array(zod_1.z.string()),
});
exports.AnalyzeImageRequestSchema = zod_1.z.object({
    imageBase64: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
}).refine((data) => data.imageBase64 || data.imageUrl, { message: 'Either imageBase64 or imageUrl must be provided' });
exports.ChatMessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'assistant']),
    content: zod_1.z.string(),
    citations: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.ChatRequestSchema = zod_1.z.object({
    scanContext: zod_1.z.object({
        detectedProduct: exports.DetectedProductSchema,
        ecoScore: exports.EcoScoreSchema,
        evidencePack: exports.EvidencePackSchema,
    }),
    message: zod_1.z.string().min(1).max(2000),
    history: zod_1.z.array(exports.ChatMessageSchema),
});
exports.VoiceRequestSchema = zod_1.z.object({
    text: zod_1.z.string().min(1).max(1000),
});
exports.EcoScoreRequestSchema = zod_1.z.object({
    detectedProduct: exports.DetectedProductSchema,
    evidencePack: exports.EvidencePackSchema,
    originPins: zod_1.z.array(exports.OriginPinSchema),
});
//# sourceMappingURL=schemas.js.map