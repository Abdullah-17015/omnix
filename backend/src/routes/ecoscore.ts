import { Router } from 'express';
import { generateEcoScoreExplanation, generateGemmaTips } from '../services/vertexai.js';
import { EcoScoreRequestSchema } from '../utils/schemas.js';
import type { EcoScore, DetectedProduct, EvidencePack, Claim, OriginPin } from '../types/index.js';

const router = Router();

// High-risk materials that affect sourcing score
const HIGH_RISK_MATERIALS = ['Cobalt', 'Tantalum', 'Tin', 'Tungsten', 'Gold'];

// Keywords indicating positive sourcing practices
const RESPONSIBLE_SOURCING_KEYWORDS = [
    'responsible sourcing',
    'conflict-free',
    'certified',
    'audited',
    'RMI',
    'responsible minerals',
    'supply chain transparency',
];

// Keywords indicating transparency
const TRANSPARENCY_KEYWORDS = [
    'sustainability report',
    'supplier list',
    'disclosure',
    'CSR report',
    'environmental report',
];

function calculateSourcingScore(
    product: DetectedProduct,
    claims: Claim[]
): number {
    let score = 20; // Start at midpoint

    // Check for high-risk materials
    const hasHighRisk = product.materialsUsed.some(m =>
        HIGH_RISK_MATERIALS.some(hr => m.toLowerCase().includes(hr.toLowerCase()))
    );
    if (hasHighRisk) score -= 5;

    // Check for responsible sourcing mentions
    const sourcingClaims = claims.filter(c => c.type === 'sourcing' || c.type === 'policy');
    const hasResponsibleSourcing = sourcingClaims.some(c =>
        RESPONSIBLE_SOURCING_KEYWORDS.some(kw => c.text.toLowerCase().includes(kw))
    );
    if (hasResponsibleSourcing) score += 10;

    // Boost for high confidence sourcing claims
    const avgSourcingConfidence = sourcingClaims.length > 0
        ? sourcingClaims.reduce((sum, c) => sum + c.confidence, 0) / sourcingClaims.length
        : 0.5;
    score += Math.floor(avgSourcingConfidence * 10);

    // Check for controversies
    const controversies = claims.filter(c => c.type === 'controversy');
    score -= controversies.length * 5;

    return Math.max(0, Math.min(40, score));
}

function calculateTransparencyScore(claims: Claim[]): number {
    let score = 10; // Start at low-mid

    // Check for transparency indicators
    const allText = claims.map(c => c.text.toLowerCase()).join(' ');
    const transparencyMatches = TRANSPARENCY_KEYWORDS.filter(kw =>
        allText.includes(kw.toLowerCase())
    );
    score += transparencyMatches.length * 5;

    // More sources = more transparency evidence
    const uniqueUrls = new Set(claims.map(c => c.citationUrl));
    score += Math.min(uniqueUrls.size * 2, 10);

    return Math.max(0, Math.min(30, score));
}

function calculateRepairabilityScore(
    product: DetectedProduct,
    claims: Claim[]
): number {
    let score = 15; // Default mid-low

    // Category-based heuristics
    const categoryScores: Record<string, number> = {
        smartphone: 10,
        laptop: 15,
        tablet: 10,
        smartwatch: 8,
        headphones: 20,
        camera: 18,
        console: 16,
        generic_electronics: 15,
    };
    score = categoryScores[product.category] || 15;

    // Check for recycling/repair mentions
    const recyclingClaims = claims.filter(c => c.type === 'recycling');
    if (recyclingClaims.length > 0) score += 5;

    // Check for take-back programs
    const hasTakeBack = claims.some(c =>
        c.text.toLowerCase().includes('take-back') ||
        c.text.toLowerCase().includes('recycling program') ||
        c.text.toLowerCase().includes('trade-in')
    );
    if (hasTakeBack) score += 5;

    // Check for recycled materials
    const hasRecycled = claims.some(c =>
        c.text.toLowerCase().includes('recycled')
    );
    if (hasRecycled) score += 5;

    return Math.max(0, Math.min(30, score));
}

router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = EcoScoreRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }

        const { detectedProduct, evidencePack, originPins } = parseResult.data;

        // Calculate deterministic sub-scores
        const sourcing = calculateSourcingScore(detectedProduct, evidencePack.claims);
        const transparency = calculateTransparencyScore(evidencePack.claims);
        const repairability = calculateRepairabilityScore(detectedProduct, evidencePack.claims);
        const total = sourcing + transparency + repairability;

        // Get Gemini explanation
        const { summary, rationaleBullets } = await generateEcoScoreExplanation(
            detectedProduct,
            { total, sourcing, transparency, repairability, gemmaTips: [] },
            evidencePack.claims
        );

        // Get Gemma tips
        const gemmaTips = await generateGemmaTips(
            detectedProduct,
            detectedProduct.materialsUsed
        );

        const ecoScore: EcoScore = {
            total,
            sourcing,
            transparency,
            repairability,
            summary,
            rationaleBullets,
            gemmaTips,
        };

        res.json(ecoScore);
    } catch (error) {
        console.error('Eco score error:', error);
        res.status(500).json({ error: 'Failed to calculate eco score' });
    }
});

export default router;
