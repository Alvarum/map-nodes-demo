import { useEffect, useMemo, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import type { DetectionPoint, Edge } from "../types/interfaces";

/**
 * Hook responsable de:
 * - Escuchar en tiempo real la colección "points".
 * - Para cada punto, escuchar su subcolección "neighbors".
 * - Mantener `points` actualizado sin fugas de memoria (limpieza adecuada).
 * - Derivar `edges` no direccionales deduplicadas.
 */
export function useGraph() {
  // Use tate retorna 2 cosas, un estado (actual) y una funcion para actualizarlo
  // hay reglas para los hooks:
  //- sólo se llaman en el tope del cuerpo del componente (no dentro de if, for, callbacks)
  //- siempre en el mismo orden entre renders
  const [points, setPoints] = useState<DetectionPoint[]>([]);

  // Para pantalla de carga
  const [loading, setLoading] = useState(true);

  // Renderizado de mensaje de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * Mantenemos un mapa puntoId -> función de desuscripción de neighbors.
   * - Así podemos cancelar listeners cuando cambia el conjunto de puntos
   *   o cuando el componente se desmonta (evita fugas).
   */
  const neighborUnsubs = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    // 1) Suscripción principal a "points".
    const pointsRef = collection(db, "points");

    const unsubscribePoints = onSnapshot(
      pointsRef,
      (snap) => {
        // Transformamos docs en puntos base (sin neighbors por ahora).
        const base: DetectionPoint[] = snap.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            name: data?.name ?? doc.id,
            lat: data?.lat ?? 0,
            lng: data?.lng ?? 0,
            neighbors: [],
          };
        });

        // Índice rápido id -> posición en el array `base`.
        const idx = new Map<string, number>();
        base.forEach((p, i) => idx.set(p.id, i));

        // Cerrar listeners de neighbors para puntos que ya no existen.
        for (const [pid, off] of neighborUnsubs.current) {
          if (!idx.has(pid)) {
            off();
            neighborUnsubs.current.delete(pid);
          }
        }

        // Abrir listeners de neighbors para puntos nuevos.
        base.forEach((p) => {
          // Si ya hay listener activo, no duplicar.
          if (neighborUnsubs.current.has(p.id)) return;

          const nbrsRef = collection(db, "points", p.id, "neighbors");
          const off = onSnapshot(
            nbrsRef,
            (nSnap) => {
              // Extraemos `name` de cada doc en subcolección.
              const names: string[] = [];
              nSnap.forEach((nd) => {
                const d = nd.data() as any;
                if (d?.name) names.push(String(d.name));
              });

              // Actualizamos SOLO los vecinos del punto correspondiente.
              setPoints((prev) => {
                // Si `prev` aún no está seteado (primer batch), clonamos `base`.
                const arr = prev.length ? [...prev] : [...base];
                const pos = idx.get(p.id);
                if (pos == null) return arr; // Si el punto ya no existe, salir.
                arr[pos] = { ...arr[pos], neighbors: names };
                return arr;
              });
            },
            (err) => setError(err as Error)
          );

          neighborUnsubs.current.set(p.id, off);
        });

        // Inicializamos `points` con el baseline (neighbors llegarán luego).
        setPoints(base);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    // Limpieza global: quitar todos los listeners al desmontar.
    return () => {
      unsubscribePoints();
      for (const [, off] of neighborUnsubs.current) off();
      neighborUnsubs.current.clear();
    };
  }, []);

  /**
   * Derivamos aristas no direccionales desde `points`.
   * - Usamos useMemo para recalcular SOLO cuando cambie `points`.
   * - Deduplicamos parejas (A,B) con una key ordenada "A::B".
   */
  const edges: Edge[] = useMemo(() => {
    const index = new Map(points.map((p) => [p.id, p]));
    const seen = new Set<string>();
    const list: Edge[] = [];

    for (const p of points) {
      for (const n of p.neighbors ?? []) {
        const q = index.get(n);
        if (!q) continue; // Vecino no está cargado.
        const key = [p.id, q.id].sort().join("::");
        if (seen.has(key)) continue; // Ya agregada la arista opuesta.
        seen.add(key);
        list.push({
          a: { id: p.id, lat: p.lat, lng: p.lng },
          b: { id: q.id, lat: q.lat, lng: q.lng },
        });
      }
    }

    return list;
  }, [points]);

  return { points, edges, loading, error };
}
