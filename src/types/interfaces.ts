
/**
 * DetectionPoint: representa un punto de detección.
 * - id: ID del doc en Firestore
 * - name: nombre de raptor
 * - lat/lng: coordenadas en grados decimales
 * - neighbors: lista de nombres de raptor de los vecinos
 */
export interface DetectionPoint {
    id: string;
    name: string;
    lat: number;
    lng: number;
    neighbors: string[];
}


/**
 * Edge: representa una arista.
 * - a/b: representan los nodos de la arista
 *  - id: ID del doc en Firestore
 *  - lat/lng: coordenadas en grados decimales
 */
export interface Edge {
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


/**
 * Representa el estado del grafo para guardar en cache
 * - version: versión del snapshot
 * - createdAt: fecha de creación
 * - points: puntos de detección con sus vecinos
 */
export interface GraphSnapshot {
  version: number;
  createdAt: string; // new Date().toISOString()
  points: DetectionPoint[];
}


export interface MapGraphProps {
  points: DetectionPoint[];
  edges: Edge[];
  showPoints?: boolean;
  showEdges?: boolean;
  fitOnLoad?: boolean;
}