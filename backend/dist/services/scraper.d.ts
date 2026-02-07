export interface ScrapedContent {
    url: string;
    title: string;
    content: string;
    success: boolean;
}
export declare function scrapeUrl(url: string): Promise<ScrapedContent>;
export declare function scrapeMultipleUrls(urls: string[], maxConcurrent?: number): Promise<ScrapedContent[]>;
//# sourceMappingURL=scraper.d.ts.map