import { z } from 'zod';
export declare const ProductCategorySchema: z.ZodEnum<["smartphone", "laptop", "smartwatch", "headphones", "tablet", "camera", "console", "generic_electronics"]>;
export declare const ComponentSchema: z.ZodObject<{
    name: z.ZodString;
    materials: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    materials: string[];
}, {
    name: string;
    materials: string[];
}>;
export declare const DetectedProductSchema: z.ZodObject<{
    category: z.ZodEnum<["smartphone", "laptop", "smartwatch", "headphones", "tablet", "camera", "console", "generic_electronics"]>;
    brand: z.ZodString;
    model: z.ZodString;
    confidence: z.ZodNumber;
    identifiers: z.ZodArray<z.ZodString, "many">;
    components: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        materials: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        materials: string[];
    }, {
        name: string;
        materials: string[];
    }>, "many">;
    materialsUsed: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
    brand: string;
    model: string;
    confidence: number;
    identifiers: string[];
    components: {
        name: string;
        materials: string[];
    }[];
    materialsUsed: string[];
}, {
    category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
    brand: string;
    model: string;
    confidence: number;
    identifiers: string[];
    components: {
        name: string;
        materials: string[];
    }[];
    materialsUsed: string[];
}>;
export declare const SourceSchema: z.ZodObject<{
    title: z.ZodString;
    url: z.ZodString;
    domain: z.ZodString;
    snippet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    url: string;
    domain: string;
    snippet: string;
}, {
    title: string;
    url: string;
    domain: string;
    snippet: string;
}>;
export declare const ClaimSchema: z.ZodObject<{
    type: z.ZodEnum<["sourcing", "policy", "controversy", "recycling"]>;
    text: z.ZodString;
    materials: z.ZodArray<z.ZodString, "many">;
    places: z.ZodArray<z.ZodString, "many">;
    citationUrl: z.ZodString;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    text: string;
    confidence: number;
    materials: string[];
    type: "sourcing" | "policy" | "controversy" | "recycling";
    places: string[];
    citationUrl: string;
}, {
    text: string;
    confidence: number;
    materials: string[];
    type: "sourcing" | "policy" | "controversy" | "recycling";
    places: string[];
    citationUrl: string;
}>;
export declare const EvidencePackSchema: z.ZodObject<{
    sources: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        domain: z.ZodString;
        snippet: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
        domain: string;
        snippet: string;
    }, {
        title: string;
        url: string;
        domain: string;
        snippet: string;
    }>, "many">;
    claims: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["sourcing", "policy", "controversy", "recycling"]>;
        text: z.ZodString;
        materials: z.ZodArray<z.ZodString, "many">;
        places: z.ZodArray<z.ZodString, "many">;
        citationUrl: z.ZodString;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        text: string;
        confidence: number;
        materials: string[];
        type: "sourcing" | "policy" | "controversy" | "recycling";
        places: string[];
        citationUrl: string;
    }, {
        text: string;
        confidence: number;
        materials: string[];
        type: "sourcing" | "policy" | "controversy" | "recycling";
        places: string[];
        citationUrl: string;
    }>, "many">;
    overallConfidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sources: {
        title: string;
        url: string;
        domain: string;
        snippet: string;
    }[];
    claims: {
        text: string;
        confidence: number;
        materials: string[];
        type: "sourcing" | "policy" | "controversy" | "recycling";
        places: string[];
        citationUrl: string;
    }[];
    overallConfidence: number;
}, {
    sources: {
        title: string;
        url: string;
        domain: string;
        snippet: string;
    }[];
    claims: {
        text: string;
        confidence: number;
        materials: string[];
        type: "sourcing" | "policy" | "controversy" | "recycling";
        places: string[];
        citationUrl: string;
    }[];
    overallConfidence: number;
}>;
export declare const OriginPinSchema: z.ZodObject<{
    material: z.ZodString;
    place: z.ZodString;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    citationUrl: z.ZodString;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    citationUrl: string;
    material: string;
    place: string;
    lat: number;
    lng: number;
}, {
    confidence: number;
    citationUrl: string;
    material: string;
    place: string;
    lat: number;
    lng: number;
}>;
export declare const EcoScoreSchema: z.ZodObject<{
    total: z.ZodNumber;
    sourcing: z.ZodNumber;
    transparency: z.ZodNumber;
    repairability: z.ZodNumber;
    rationaleBullets: z.ZodArray<z.ZodString, "many">;
    summary: z.ZodString;
    gemmaTips: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    sourcing: number;
    summary: string;
    rationaleBullets: string[];
    total: number;
    transparency: number;
    repairability: number;
    gemmaTips: string[];
}, {
    sourcing: number;
    summary: string;
    rationaleBullets: string[];
    total: number;
    transparency: number;
    repairability: number;
    gemmaTips: string[];
}>;
export declare const AnalyzeImageRequestSchema: z.ZodEffects<z.ZodObject<{
    imageBase64: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    imageBase64?: string | undefined;
    imageUrl?: string | undefined;
}, {
    imageBase64?: string | undefined;
    imageUrl?: string | undefined;
}>, {
    imageBase64?: string | undefined;
    imageUrl?: string | undefined;
}, {
    imageBase64?: string | undefined;
    imageUrl?: string | undefined;
}>;
export declare const ChatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodString;
    citations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    role: "user" | "assistant";
    content: string;
    citations?: string[] | undefined;
}, {
    role: "user" | "assistant";
    content: string;
    citations?: string[] | undefined;
}>;
export declare const ChatRequestSchema: z.ZodObject<{
    scanContext: z.ZodObject<{
        detectedProduct: z.ZodObject<{
            category: z.ZodEnum<["smartphone", "laptop", "smartwatch", "headphones", "tablet", "camera", "console", "generic_electronics"]>;
            brand: z.ZodString;
            model: z.ZodString;
            confidence: z.ZodNumber;
            identifiers: z.ZodArray<z.ZodString, "many">;
            components: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                materials: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                materials: string[];
            }, {
                name: string;
                materials: string[];
            }>, "many">;
            materialsUsed: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
            brand: string;
            model: string;
            confidence: number;
            identifiers: string[];
            components: {
                name: string;
                materials: string[];
            }[];
            materialsUsed: string[];
        }, {
            category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
            brand: string;
            model: string;
            confidence: number;
            identifiers: string[];
            components: {
                name: string;
                materials: string[];
            }[];
            materialsUsed: string[];
        }>;
        ecoScore: z.ZodObject<{
            total: z.ZodNumber;
            sourcing: z.ZodNumber;
            transparency: z.ZodNumber;
            repairability: z.ZodNumber;
            rationaleBullets: z.ZodArray<z.ZodString, "many">;
            summary: z.ZodString;
            gemmaTips: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            sourcing: number;
            summary: string;
            rationaleBullets: string[];
            total: number;
            transparency: number;
            repairability: number;
            gemmaTips: string[];
        }, {
            sourcing: number;
            summary: string;
            rationaleBullets: string[];
            total: number;
            transparency: number;
            repairability: number;
            gemmaTips: string[];
        }>;
        evidencePack: z.ZodObject<{
            sources: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                url: z.ZodString;
                domain: z.ZodString;
                snippet: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }, {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }>, "many">;
            claims: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["sourcing", "policy", "controversy", "recycling"]>;
                text: z.ZodString;
                materials: z.ZodArray<z.ZodString, "many">;
                places: z.ZodArray<z.ZodString, "many">;
                citationUrl: z.ZodString;
                confidence: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }, {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }>, "many">;
            overallConfidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            sources: {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }[];
            claims: {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }[];
            overallConfidence: number;
        }, {
            sources: {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }[];
            claims: {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }[];
            overallConfidence: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        detectedProduct: {
            category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
            brand: string;
            model: string;
            confidence: number;
            identifiers: string[];
            components: {
                name: string;
                materials: string[];
            }[];
            materialsUsed: string[];
        };
        ecoScore: {
            sourcing: number;
            summary: string;
            rationaleBullets: string[];
            total: number;
            transparency: number;
            repairability: number;
            gemmaTips: string[];
        };
        evidencePack: {
            sources: {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }[];
            claims: {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }[];
            overallConfidence: number;
        };
    }, {
        detectedProduct: {
            category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
            brand: string;
            model: string;
            confidence: number;
            identifiers: string[];
            components: {
                name: string;
                materials: string[];
            }[];
            materialsUsed: string[];
        };
        ecoScore: {
            sourcing: number;
            summary: string;
            rationaleBullets: string[];
            total: number;
            transparency: number;
            repairability: number;
            gemmaTips: string[];
        };
        evidencePack: {
            sources: {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }[];
            claims: {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }[];
            overallConfidence: number;
        };
    }>;
    message: z.ZodString;
    history: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodString;
        citations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        role: "user" | "assistant";
        content: string;
        citations?: string[] | undefined;
    }, {
        role: "user" | "assistant";
        content: string;
        citations?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    message: string;
    scanContext: {
        detectedProduct: {
            category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
            brand: string;
            model: string;
            confidence: number;
            identifiers: string[];
            components: {
                name: string;
                materials: string[];
            }[];
            materialsUsed: string[];
        };
        ecoScore: {
            sourcing: number;
            summary: string;
            rationaleBullets: string[];
            total: number;
            transparency: number;
            repairability: number;
            gemmaTips: string[];
        };
        evidencePack: {
            sources: {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }[];
            claims: {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }[];
            overallConfidence: number;
        };
    };
    history: {
        role: "user" | "assistant";
        content: string;
        citations?: string[] | undefined;
    }[];
}, {
    message: string;
    scanContext: {
        detectedProduct: {
            category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
            brand: string;
            model: string;
            confidence: number;
            identifiers: string[];
            components: {
                name: string;
                materials: string[];
            }[];
            materialsUsed: string[];
        };
        ecoScore: {
            sourcing: number;
            summary: string;
            rationaleBullets: string[];
            total: number;
            transparency: number;
            repairability: number;
            gemmaTips: string[];
        };
        evidencePack: {
            sources: {
                title: string;
                url: string;
                domain: string;
                snippet: string;
            }[];
            claims: {
                text: string;
                confidence: number;
                materials: string[];
                type: "sourcing" | "policy" | "controversy" | "recycling";
                places: string[];
                citationUrl: string;
            }[];
            overallConfidence: number;
        };
    };
    history: {
        role: "user" | "assistant";
        content: string;
        citations?: string[] | undefined;
    }[];
}>;
export declare const VoiceRequestSchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
export declare const EcoScoreRequestSchema: z.ZodObject<{
    detectedProduct: z.ZodObject<{
        category: z.ZodEnum<["smartphone", "laptop", "smartwatch", "headphones", "tablet", "camera", "console", "generic_electronics"]>;
        brand: z.ZodString;
        model: z.ZodString;
        confidence: z.ZodNumber;
        identifiers: z.ZodArray<z.ZodString, "many">;
        components: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            materials: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            materials: string[];
        }, {
            name: string;
            materials: string[];
        }>, "many">;
        materialsUsed: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
        brand: string;
        model: string;
        confidence: number;
        identifiers: string[];
        components: {
            name: string;
            materials: string[];
        }[];
        materialsUsed: string[];
    }, {
        category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
        brand: string;
        model: string;
        confidence: number;
        identifiers: string[];
        components: {
            name: string;
            materials: string[];
        }[];
        materialsUsed: string[];
    }>;
    evidencePack: z.ZodObject<{
        sources: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            url: z.ZodString;
            domain: z.ZodString;
            snippet: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            title: string;
            url: string;
            domain: string;
            snippet: string;
        }, {
            title: string;
            url: string;
            domain: string;
            snippet: string;
        }>, "many">;
        claims: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["sourcing", "policy", "controversy", "recycling"]>;
            text: z.ZodString;
            materials: z.ZodArray<z.ZodString, "many">;
            places: z.ZodArray<z.ZodString, "many">;
            citationUrl: z.ZodString;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            text: string;
            confidence: number;
            materials: string[];
            type: "sourcing" | "policy" | "controversy" | "recycling";
            places: string[];
            citationUrl: string;
        }, {
            text: string;
            confidence: number;
            materials: string[];
            type: "sourcing" | "policy" | "controversy" | "recycling";
            places: string[];
            citationUrl: string;
        }>, "many">;
        overallConfidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sources: {
            title: string;
            url: string;
            domain: string;
            snippet: string;
        }[];
        claims: {
            text: string;
            confidence: number;
            materials: string[];
            type: "sourcing" | "policy" | "controversy" | "recycling";
            places: string[];
            citationUrl: string;
        }[];
        overallConfidence: number;
    }, {
        sources: {
            title: string;
            url: string;
            domain: string;
            snippet: string;
        }[];
        claims: {
            text: string;
            confidence: number;
            materials: string[];
            type: "sourcing" | "policy" | "controversy" | "recycling";
            places: string[];
            citationUrl: string;
        }[];
        overallConfidence: number;
    }>;
    originPins: z.ZodArray<z.ZodObject<{
        material: z.ZodString;
        place: z.ZodString;
        lat: z.ZodNumber;
        lng: z.ZodNumber;
        citationUrl: z.ZodString;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        citationUrl: string;
        material: string;
        place: string;
        lat: number;
        lng: number;
    }, {
        confidence: number;
        citationUrl: string;
        material: string;
        place: string;
        lat: number;
        lng: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    detectedProduct: {
        category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
        brand: string;
        model: string;
        confidence: number;
        identifiers: string[];
        components: {
            name: string;
            materials: string[];
        }[];
        materialsUsed: string[];
    };
    evidencePack: {
        sources: {
            title: string;
            url: string;
            domain: string;
            snippet: string;
        }[];
        claims: {
            text: string;
            confidence: number;
            materials: string[];
            type: "sourcing" | "policy" | "controversy" | "recycling";
            places: string[];
            citationUrl: string;
        }[];
        overallConfidence: number;
    };
    originPins: {
        confidence: number;
        citationUrl: string;
        material: string;
        place: string;
        lat: number;
        lng: number;
    }[];
}, {
    detectedProduct: {
        category: "smartphone" | "laptop" | "smartwatch" | "headphones" | "tablet" | "camera" | "console" | "generic_electronics";
        brand: string;
        model: string;
        confidence: number;
        identifiers: string[];
        components: {
            name: string;
            materials: string[];
        }[];
        materialsUsed: string[];
    };
    evidencePack: {
        sources: {
            title: string;
            url: string;
            domain: string;
            snippet: string;
        }[];
        claims: {
            text: string;
            confidence: number;
            materials: string[];
            type: "sourcing" | "policy" | "controversy" | "recycling";
            places: string[];
            citationUrl: string;
        }[];
        overallConfidence: number;
    };
    originPins: {
        confidence: number;
        citationUrl: string;
        material: string;
        place: string;
        lat: number;
        lng: number;
    }[];
}>;
//# sourceMappingURL=schemas.d.ts.map