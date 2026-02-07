"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWeb = searchWeb;
exports.buildSearchQueries = buildSearchQueries;
exports.searchForProduct = searchForProduct;
const axios_1 = __importDefault(require("axios"));
const GOOGLE_CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY || '';
const GOOGLE_CSE_CX = process.env.GOOGLE_CSE_CX || '';
async function searchWeb(query, numResults = 10) {
    if (!GOOGLE_CSE_API_KEY || !GOOGLE_CSE_CX) {
        console.warn('Google Custom Search not configured, returning empty results');
        return [];
    }
    try {
        const response = await axios_1.default.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: GOOGLE_CSE_API_KEY,
                cx: GOOGLE_CSE_CX,
                q: query,
                num: Math.min(numResults, 10), // Max 10 per request
            },
            timeout: 10000,
        });
        return (response.data.items || []).map((item) => ({
            title: item.title || '',
            link: item.link || '',
            snippet: item.snippet || '',
            displayLink: item.displayLink || '',
        }));
    }
    catch (error) {
        console.error('Search failed:', error);
        return [];
    }
}
function buildSearchQueries(brand, model) {
    const queries = [
        `${brand} ${model} materials`,
        `${brand} ${model} bill of materials`,
        `${brand} sustainability report`,
        `${brand} supplier list`,
        `${brand} responsible sourcing`,
        `${brand} conflict minerals report`,
        `${brand} recycled materials`,
    ];
    return queries;
}
async function searchForProduct(brand, model) {
    const queries = buildSearchQueries(brand, model);
    const allResults = [];
    const seenDomains = new Set();
    for (const query of queries) {
        try {
            const results = await searchWeb(query, 5);
            for (const result of results) {
                // Dedupe by domain
                if (!seenDomains.has(result.displayLink)) {
                    seenDomains.add(result.displayLink);
                    allResults.push(result);
                }
            }
            // Limit total results
            if (allResults.length >= 15)
                break;
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        catch (error) {
            console.error(`Search failed for query: ${query}`, error);
        }
    }
    return allResults.slice(0, 10);
}
//# sourceMappingURL=search.js.map