import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

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

export interface ScrapedContent {
    url: string;
    title: string;
    content: string;
    success: boolean;
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
    const domain = new URL(url).hostname.replace('www.', '');

    // Check blocked domains
    if (BLOCKED_DOMAINS.some(blocked => domain.includes(blocked))) {
        return { url, title: '', content: '', success: false };
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml',
            },
            timeout: TIMEOUT_MS,
            maxContentLength: MAX_SIZE_BYTES,
            responseType: 'text',
        });

        const html = response.data;
        const dom = new JSDOM(html, { url });
        const reader = new Readability(dom.window.document);
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
    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error instanceof Error ? error.message : 'Unknown error');
        return { url, title: '', content: '', success: false };
    }
}

export async function scrapeMultipleUrls(
    urls: string[],
    maxConcurrent: number = 3
): Promise<ScrapedContent[]> {
    const results: ScrapedContent[] = [];

    // Process in batches to limit concurrency
    for (let i = 0; i < urls.length; i += maxConcurrent) {
        const batch = urls.slice(i, i + maxConcurrent);
        const batchResults = await Promise.all(batch.map(url => scrapeUrl(url)));
        results.push(...batchResults);
    }

    return results.filter(r => r.success);
}
