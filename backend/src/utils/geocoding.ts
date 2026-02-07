// Fallback geocoding data for common materials in electronics
// Used when search evidence doesn't provide specific locations

export interface MaterialOrigin {
    place: string;
    lat: number;
    lng: number;
    description: string;
}

export const MATERIAL_ORIGINS: Record<string, MaterialOrigin[]> = {
    'Lithium': [
        { place: 'Atacama Desert, Chile', lat: -23.5, lng: -68.0, description: 'Major lithium brine extraction site' },
        { place: 'Western Australia', lat: -30.0, lng: 121.0, description: 'Spodumene hard rock mining' },
        { place: 'Salar de Uyuni, Bolivia', lat: -20.2, lng: -67.5, description: 'World\'s largest salt flat with lithium reserves' },
    ],
    'Cobalt': [
        { place: 'Democratic Republic of Congo', lat: -11.0, lng: 26.0, description: 'Supplies ~70% of global cobalt' },
        { place: 'Zambia', lat: -13.5, lng: 28.3, description: 'Copper-cobalt belt mining' },
    ],
    'Rare Earth Elements': [
        { place: 'Inner Mongolia, China', lat: 40.8, lng: 111.7, description: 'Bayan Obo mining district' },
        { place: 'Mountain Pass, California', lat: 35.5, lng: -115.5, description: 'US rare earth mine' },
    ],
    'Copper': [
        { place: 'Chuquicamata, Chile', lat: -22.3, lng: -68.9, description: 'One of world\'s largest open-pit copper mines' },
        { place: 'Escondida, Chile', lat: -24.3, lng: -69.1, description: 'Largest copper mine by production' },
        { place: 'Grasberg, Indonesia', lat: -4.1, lng: 137.1, description: 'Major copper and gold mine' },
    ],
    'Aluminum': [
        { place: 'Weipa, Australia', lat: -12.7, lng: 141.9, description: 'Major bauxite mining region' },
        { place: 'Guinea', lat: 10.5, lng: -13.0, description: 'Large bauxite reserves' },
        { place: 'Jamaica', lat: 18.1, lng: -77.3, description: 'Caribbean bauxite producer' },
    ],
    'Gold': [
        { place: 'Witwatersrand, South Africa', lat: -26.2, lng: 28.0, description: 'Historic gold mining region' },
        { place: 'Nevada, USA', lat: 40.0, lng: -117.0, description: 'Carlin Trend gold deposits' },
        { place: 'Western Australia', lat: -30.7, lng: 121.5, description: 'Kalgoorlie goldfields' },
    ],
    'Tantalum': [
        { place: 'Democratic Republic of Congo', lat: -2.5, lng: 28.5, description: 'Conflict mineral source' },
        { place: 'Rwanda', lat: -2.0, lng: 29.5, description: 'Tantalum ore processing' },
        { place: 'Western Australia', lat: -28.8, lng: 121.0, description: 'Greenbushes mine' },
    ],
    'Tin': [
        { place: 'Bangka Island, Indonesia', lat: -2.5, lng: 106.0, description: 'Major tin mining island' },
        { place: 'Yunnan, China', lat: 23.4, lng: 103.4, description: 'Chinese tin production' },
        { place: 'Bolivia', lat: -18.0, lng: -65.5, description: 'Andean tin deposits' },
    ],
    'Tungsten': [
        { place: 'Jiangxi, China', lat: 26.0, lng: 115.0, description: 'Major tungsten producer' },
        { place: 'Rwanda', lat: -1.9, lng: 29.8, description: 'African tungsten source' },
    ],
    'Nickel': [
        { place: 'Sudbury, Ontario, Canada', lat: 46.5, lng: -81.0, description: 'Historic nickel mining region' },
        { place: 'Norilsk, Russia', lat: 69.3, lng: 88.2, description: 'Major nickel-palladium complex' },
        { place: 'New Caledonia', lat: -21.5, lng: 165.5, description: 'Nickel laterite deposits' },
    ],
    'Silicon': [
        { place: 'Xinjiang, China', lat: 43.8, lng: 87.6, description: 'Polysilicon production hub' },
        { place: 'Norway', lat: 60.5, lng: 8.0, description: 'Silicon metal production using hydropower' },
    ],
    'Glass': [
        { place: 'Corning, New York, USA', lat: 42.1, lng: -77.1, description: 'Gorilla Glass manufacturing' },
        { place: 'Shenzhen, China', lat: 22.5, lng: 114.1, description: 'Display glass production' },
    ],
    'Plastic': [
        { place: 'Houston, Texas, USA', lat: 29.8, lng: -95.4, description: 'Petrochemical production' },
        { place: 'Singapore', lat: 1.3, lng: 103.8, description: 'Asian petrochemical hub' },
    ],
    'Steel': [
        { place: 'Hebei, China', lat: 38.0, lng: 114.5, description: 'World\'s largest steel producing region' },
        { place: 'Pohang, South Korea', lat: 36.0, lng: 129.3, description: 'POSCO steel works' },
    ],
    'Graphite': [
        { place: 'Heilongjiang, China', lat: 45.8, lng: 126.5, description: 'Natural graphite processing' },
        { place: 'Mozambique', lat: -13.5, lng: 37.5, description: 'Emerging graphite source' },
    ],
    'Manganese': [
        { place: 'South Africa', lat: -27.5, lng: 22.5, description: 'Kalahari manganese field' },
        { place: 'Gabon', lat: -1.5, lng: 13.5, description: 'Major manganese exporter' },
    ],
};

export function getMaterialOrigins(material: string): MaterialOrigin[] {
    // Try exact match first
    if (MATERIAL_ORIGINS[material]) {
        return MATERIAL_ORIGINS[material];
    }

    // Try case-insensitive match
    const normalizedMaterial = material.toLowerCase();
    for (const [key, origins] of Object.entries(MATERIAL_ORIGINS)) {
        if (key.toLowerCase() === normalizedMaterial) {
            return origins;
        }
    }

    // Try partial match
    for (const [key, origins] of Object.entries(MATERIAL_ORIGINS)) {
        if (
            key.toLowerCase().includes(normalizedMaterial) ||
            normalizedMaterial.includes(key.toLowerCase())
        ) {
            return origins;
        }
    }

    return [];
}

export function getAllKnownMaterials(): string[] {
    return Object.keys(MATERIAL_ORIGINS);
}
