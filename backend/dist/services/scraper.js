"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeUrl = scrapeUrl;
exports.scrapeMultipleUrls = scrapeMultipleUrls;
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = require("jsdom");
const readability_1 = require("@mozilla/readability");
const USER_AGENT = 'Mozilla/5.0 (compatible; OmnixBot/1.0; +https://omnix.app)';
const TIMEOUT_MS = 5000;
const MAX_SIZE_BYTES = 500 * 1024; // 500KB
// Domains to skip
const BLOCKED_DOMAINS = [
    'youtube.com',
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'tiktok.com',
    'linkedin.com',
];
async function scrapeUrl(url) {
    const domain = new URL(url).hostname.replace('www.', '');
    // Check blocked domains
    if (BLOCKED_DOMAINS.some(blocked => domain.includes(blocked))) {
        return { url, title: '', content: '', success: false };
    }
    try {
        const response = await axios_1.default.get(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml',
            },
            timeout: TIMEOUT_MS,
            maxContentLength: MAX_SIZE_BYTES,
            responseType: 'text',
        });
        const html = response.data;
        const dom = new jsdom_1.JSDOM(html, { url });
        const reader = new readability_1.Readability(dom.window.document);
        const article = reader.parse();
        if (!article) {
            return { url, title: '', content: '', success: false };
        }
        // Clean and truncate content
        const cleanContent = article.textContent
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 10000); // Limit content length
        return {
            url,
            title: article.title || '',
            content: cleanContent,
            success: true,
        };
    }
    catch (error) {
        console.error(`Failed to scrape ${url}:`, error instanceof Error ? error.message : 'Unknown error');
        return { url, title: '', content: '', success: false };
    }
}
async function scrapeMultipleUrls(urls, maxConcurrent = 3) {
    const results = [];
    // Process in batches to limit concurrency
    for (let i = 0; i < urls.length; i += maxConcurrent) {
        const batch = urls.slice(i, i + maxConcurrent);
        const batchResults = await Promise.all(batch.map(url => scrapeUrl(url)));
        results.push(...batchResults);
    }
    return results.filter(r => r.success);
}
//# sourceMappingURL=scraper.js.map