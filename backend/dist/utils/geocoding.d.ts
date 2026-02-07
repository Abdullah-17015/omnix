export interface MaterialOrigin {
    place: string;
    lat: number;
    lng: number;
    description: string;
}
export declare const MATERIAL_ORIGINS: Record<string, MaterialOrigin[]>;
export declare function getMaterialOrigins(material: string): MaterialOrigin[];
export declare function getAllKnownMaterials(): string[];
//# sourceMappingURL=geocoding.d.ts.map