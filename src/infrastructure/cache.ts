import type { GraphSnapshot } from "../types/interfaces";

// Nombre de la clave del caché
const CACHE_KEY = "latam_graph_v1";

/**
 * Lee el snapshot del caché.
 * @returns GraphSnapshot o null si no hay caché o está corrupto.
 */
export function loadGraphCache(): GraphSnapshot | null {
  try {
    // Intenta leer el item del localStorage, si no lo encuentra 
    // devuelve null
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    // Intenta parsear el JSON, si parsed está vacio o points no es un
    // array, devuelve null
    const parsed = JSON.parse(raw) as GraphSnapshot;
    if (!parsed || !Array.isArray(parsed.points)) return null;

    return parsed;
  } catch {
    console.error("Caché corrupto");
    return null;
  }
}

/**
 * Guarda el snapshot en caché y sobre escribe si ya existe.
 * @param snapshot contenido a persistir (serializado como JSON)
 */
export function saveGraphCache(snapshot: GraphSnapshot): void {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify(snapshot)
);
}

/**
 * Borra el caché, para que los puntos se refresquen.
 */
export function clearGraphCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Determina si un snapshot está vencido por TTL.
 * @param snapshot contenido del caché
 * @param ttlMs    tiempo máximo de vida en milisegundos (p.ej., 1h)
 * @returns true si el snapshot esta vencido
 */
export function isExpired(snapshot: GraphSnapshot, ttlMs: number): boolean {
  // Obtiene la fecha de creación del snapshot
    const created = Date.parse(snapshot.createdAt);
  
  // Si el snapshot no tiene fecha de creación, lo considera vencido
  if (Number.isNaN(created)) return true;

  // Calcula el tiempo transcurrido desde la creación
  const age = Date.now() - created;

  // Si el tiempo transcurrido es mayor al TTL, lo considera vencido
  // retorna true si esta vencido
  return age > ttlMs;
}
