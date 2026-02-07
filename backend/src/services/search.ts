import axios from 'axios';

const GOOGLE_CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY || '';
const GOOGLE_CSE_CX = process.env.GOOGLE_CSE_CX || '';

interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
}

export async function searchWeb(query: string, numResults: number = 10): Promise<SearchResult[]> {
    if (!GOOGLE_CSE_API_KEY || !GOOGLE_CSE_CX) {
        console.warn('Google Custom Search not configured, returning empty results');
        return [];
    }

    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: GOOGLE_CSE_API_KEY,
                cx: GOOGLE_CSE_CX,
                q: query,
                num: Math.min(numResults, 10), // Max 10 per request
            },
            timeout: 10000,
        });

        return (response.data.items || []).map((item: any) => ({
            title: item.title || '',
            link: item.link || '',
            snippet: item.snippet || '',
            displayLink: item.displayLink || '',
        }));
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
}

export function buildSearchQueries(brand: string, model: string): string[] {
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

export async function searchForProduct(
    brand: string,
    model: string
): Promise<SearchResult[]> {
    const queries = buildSearchQueries(brand, model);
    const allResults: SearchResult[] = [];
    const seenDomains = new Set<string>();

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
            if (allResults.length >= 15) break;

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`Search failed for query: ${query}`, error);
        }
    }

    return allResults.slice(0, 10);
}
