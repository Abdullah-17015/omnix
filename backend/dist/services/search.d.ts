interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
}
export declare function searchWeb(query: string, numResults?: number): Promise<SearchResult[]>;
export declare function buildSearchQueries(brand: string, model: string): string[];
export declare function searchForProduct(brand: string, model: string): Promise<SearchResult[]>;
export {};
//# sourceMappingURL=search.d.ts.map