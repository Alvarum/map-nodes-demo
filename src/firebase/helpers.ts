import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import type { DetectionPoint } from "../types/interfaces";

/**
 * Descarga to los puntos y sus vecinos desde Firestore,
 * Igual son caleta de lecturas xd, ver como optimizar.
 * @returns Array de puntos para cachearlos
 */
export async function fetchGraphFromFirestore(): Promise<DetectionPoint[]> {
  // Obtiene la ruta desde las variables de entorno, si no encuentra
  // lanza un error
  const dpPath: string = import.meta.env.VITE_DETECTION_POINTS_PATH;
  if (!dpPath || dpPath === "" || dpPath === undefined) throw new Error(
    "No se encuentra la ruta de los puntos en las variables de entorno"
  );

  //Lee la colección principal una sola vez:
  const pointsSnap = await getDocs(collection(db, dpPath));

  // Por cada punto saca la subcolección 
  const points: DetectionPoint[] = [];
  for (const docSnap of pointsSnap.docs) {
    const data = docSnap.data() as any;
    const base: DetectionPoint = {
      id: docSnap.id,
      name: data?.name ?? docSnap.id,
      lat: data?.lat ?? 0,
      lng: data?.lng ?? 0,
      neighbors: [],
    };

    // Subcolección /points/{id}/neighbors
    const neighborsRef = collection(db, "points", docSnap.id, "neighbors");
    const neighborsSnap = await getDocs(neighborsRef);

    const names: string[] = [];
    neighborsSnap.forEach((n) => {
      const nd = n.data() as any;
      // Si guardas ID, usa n.id; si guardas {name}, usa nd.name.
      if (nd?.name) names.push(String(nd.name));
    });

    base.neighbors = names;
    points.push(base);
  }

  return points;
}
