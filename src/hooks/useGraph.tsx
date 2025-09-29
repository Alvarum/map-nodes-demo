import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import type { DetectionPoint, Edge } from "../types/interfaces";

export function useGraph() {
  const [points, setPoints] = useState<DetectionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Lee los puntos desde Firestore
    const pointsRef = collection(
      db,
      "grid_guardian",
      "data",
      "detection_points"
    );

    const unsubscribe = onSnapshot(
      pointsRef, (snap) => {
        const base: DetectionPoint[] = snap.docs.map((doc) => {
          // Separa los datos del documentillo
          const data = doc.data() as any;
          const tower = data?.tower ?? {};
          const coords = tower?.coords ?? {};
          const neighbors = data?.neighbors ?? {};

          // Convierte a DetectionPoint
          return {
            id: doc.id,
            name: tower?.name ?? doc.id,
            lat: coords?.lat ?? 0,
            lng: coords?.lng ?? 0,
            neighbors: Object.keys(neighbors),
          };
        });

        // Actualiza los datos de points
        setPoints(base);
        // Actualiza el estado de carga de datos
        setLoading(false);
      },
      (err) => {
        // Agrega el error
        setError(err as Error);
        // Deja la carga de datos en false
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const edges: Edge[] = useMemo(() => {
    const index = new Map(points.map((p) => [p.id, p]));
    const seen = new Set<string>();
    const list: Edge[] = [];

    for (const p of points) {
      for (const n of p.neighbors ?? []) {
        // ojo: en neighbors están con mayúsculas/espacios,
        // y los IDs de doc están en minúsculas → normaliza
        const q = index.get(n.toLowerCase());
        if (!q) continue;
        const key = [p.id, q.id].sort().join("::");
        if (seen.has(key)) continue;
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
