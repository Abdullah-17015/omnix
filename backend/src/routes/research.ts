import { Router } from 'express';
import { searchForProduct } from '../services/search.js';
import { scrapeMultipleUrls } from '../services/scraper.js';
import { synthesizeEvidenceWithGemini } from '../services/vertexai.js';
import { getCachedResearch, setCachedResearch, generateCacheKey } from '../services/firestore.js';
import { getMaterialOrigins } from '../utils/geocoding.js';
import type { DetectedProduct, EvidencePack, OriginPin, Source } from '../types/index.js';
import { DetectedProductSchema } from '../utils/schemas.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = DetectedProductSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }

        const product: DetectedProduct = parseResult.data;
        const cacheKey = generateCacheKey(product.brand, product.model, product.category);

        // Check cache first
        const cached = await getCachedResearch(cacheKey);
        if (cached) {
            console.log('Cache hit for:', cacheKey);
            res.json(cached);
            return;
        }

        console.log('Cache miss, performing live research for:', cacheKey);

        // Step 1: Search the web
        const searchResults = await searchForProduct(product.brand, product.model);
        console.log(`Found ${searchResults.length} search results`);

        // Step 2: Scrape content from results
        const urls = searchResults.map(r => r.link);
        const scrapedContent = await scrapeMultipleUrls(urls, 3);
        console.log(`Successfully scraped ${scrapedContent.length} pages`);

        // Step 3: Build sources array
        const sources: Source[] = searchResults.map(r => ({
            title: r.title,
            url: r.link,
            domain: r.displayLink,
            snippet: r.snippet,
        }));

        // Step 4: Synthesize evidence with Gemini
        const { claims, overallConfidence } = await synthesizeEvidenceWithGemini(product, scrapedContent);
        console.log(`Synthesized ${claims.length} claims with confidence ${overallConfidence}`);

        const evidencePack: EvidencePack = {
            sources,
            claims,
            overallConfidence,
        };

        // Step 5: Build origin pins
        const originPins: OriginPin[] = [];
        const seenPlaces = new Set<string>();

        // From claims with places
        for (const claim of claims) {
            for (const place of claim.places) {
                if (!seenPlaces.has(place)) {
                    seenPlaces.add(place);
                    // Try to get coordinates from our geocoding data based on materials
                    for (const material of claim.materials) {
                        const origins = getMaterialOrigins(material);
                        for (const origin of origins) {
                            if (origin.place.toLowerCase().includes(place.toLowerCase()) ||
                                place.toLowerCase().includes(origin.place.split(',')[0].toLowerCase())) {
                                originPins.push({
                                    material,
                                    place: origin.place,
                                    lat: origin.lat,
                                    lng: origin.lng,
                                    citationUrl: claim.citationUrl,
                                    confidence: claim.confidence,
                                });
                            }
                        }
                    }
                }
            }
        }

        // Add fallback pins from known material origins
        for (const material of product.materialsUsed) {
            if (!originPins.some(p => p.material === material)) {
                const origins = getMaterialOrigins(material);
                if (origins.length > 0) {
                    const origin = origins[0]; // Take first known origin
                    originPins.push({
                        material,
                        place: origin.place,
                        lat: origin.lat,
                        lng: origin.lng,
                        citationUrl: '',
                        confidence: 0.5, // Lower confidence for fallback
                    });
                }
            }
        }

        // Cache results
        await setCachedResearch(cacheKey, evidencePack, originPins);

        res.json({ evidencePack, originPins });
    } catch (error) {
        console.error('Research error:', error);
        res.status(500).json({ error: 'Failed to perform research' });
    }
});

export default router;
