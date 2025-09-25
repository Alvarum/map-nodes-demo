
export interface DetectionPoint {
    // Representa un punto de detección
    id: string;
    name: string;
    lat: number;
    lng: number;
    neighbors: string[];
}

export interface Edge {
    // Representa una arista
    a: {
        id: string;
        lat: number;
        lng: number;
    };
    b: {
        id: string;
        lat: number;
        lng: number;
    };
}