"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_js_1 = require("../services/search.js");
const scraper_js_1 = require("../services/scraper.js");
const vertexai_js_1 = require("../services/vertexai.js");
const firestore_js_1 = require("../services/firestore.js");
const geocoding_js_1 = require("../utils/geocoding.js");
const schemas_js_1 = require("../utils/schemas.js");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        // Validate request
        const parseResult = schemas_js_1.DetectedProductSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
            return;
        }
        const product = parseResult.data;
        const cacheKey = (0, firestore_js_1.generateCacheKey)(product.brand, product.model, product.category);
        // Check cache first
        const cached = await (0, firestore_js_1.getCachedResearch)(cacheKey);
        if (cached) {
            console.log('Cache hit for:', cacheKey);
            res.json(cached);
            return;
        }
        console.log('Cache miss, performing live research for:', cacheKey);
        // Step 1: Search the web
        const searchResults = await (0, search_js_1.searchForProduct)(product.brand, product.model);
        console.log(`Found ${searchResults.length} search results`);
        // Step 2: Scrape content from results
        const urls = searchResults.map(r => r.link);
        const scrapedContent = await (0, scraper_js_1.scrapeMultipleUrls)(urls, 3);
        console.log(`Successfully scraped ${scrapedContent.length} pages`);
        // Step 3: Build sources array
        const sources = searchResults.map(r => ({
            title: r.title,
            url: r.link,
            domain: r.displayLink,
            snippet: r.snippet,
        }));
        // Step 4: Synthesize evidence with Gemini
        const { claims, overallConfidence } = await (0, vertexai_js_1.synthesizeEvidenceWithGemini)(product, scrapedContent);
        console.log(`Synthesized ${claims.length} claims with confidence ${overallConfidence}`);
        const evidencePack = {
            sources,
            claims,
            overallConfidence,
        };
        // Step 5: Build origin pins
        const originPins = [];
        const seenPlaces = new Set();
        // From claims with places
        for (const claim of claims) {
            for (const place of claim.places) {
                if (!seenPlaces.has(place)) {
                    seenPlaces.add(place);
                    // Try to get coordinates from our geocoding data based on materials
                    for (const material of claim.materials) {
                        const origins = (0, geocoding_js_1.getMaterialOrigins)(material);
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
                const origins = (0, geocoding_js_1.getMaterialOrigins)(material);
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
        await (0, firestore_js_1.setCachedResearch)(cacheKey, evidencePack, originPins);
        res.json({ evidencePack, originPins });
    }
    catch (error) {
        console.error('Research error:', error);
        res.status(500).json({ error: 'Failed to perform research' });
    }
});
exports.default = router;
//# sourceMappingURL=research.js.map