import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  GoogleMap,
  Marker, // pa los pines
  Polyline, // este maricon sirve para hacer lineas en el mapa
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import type { DetectionPoint, MapGraphProps } from "../types/interfaces";
import { GOOGLE_MAPS } from "../helpers/privateData";

// estilo del mapa en css (creo que se puede mover a un archivo css, ver después)
const containerStyle: CSSProperties = { width: "100%", height: "70vh" };
// coordenadas iniciales
const defaultCenter: google.maps.LatLngLiteral = { lat: -15, lng: -60 };
// zoom inicial
const defaultZoom: number = 4;

// componente principal
export default function MapGraph(
  {points, edges, showPoints = true, showEdges = true, fitOnLoad = true}: MapGraphProps
){

  // Referencia donde se instancia el map
  const mapRef = useRef<google.maps.Map | null>(null);

  // Selección de un punto
  const [selected, setSelected] = useState<DetectionPoint | null>(null);

  // Carga el mapa, booleano que avisa si se ha cargado al mismo tiempo
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS.API_KEY,
  });

  // Auto ajusta el mapa
  useEffect(() => {
    // si no se ha cargado el mapa, no hace nada
    if (!isLoaded || !mapRef.current || !fitOnLoad) return;

    // obtiene el mapa
    const map = mapRef.current;
    // Revisa si hay puntos de detección
    const hasPts = showPoints && points.length > 0;
    // Revisa si hay aristas
    const hasEdg = showEdges && edges.length > 0;

    // si no hay nada que mostrar, no hace nada
    if (!hasPts && !hasEdg) return;

    // enlaces
    const bounds = new google.maps.LatLngBounds();

    // Si hay puntos de detección, los agrega al bounds por sus coordenadas
    if (hasPts) for (const p of points) bounds.extend({ lat: p.lat, lng: p.lng });

    // Si hay aristas, las agrega al bounds por sus coordenadas
    if (hasEdg) {
      for (const e of edges) {
        bounds.extend({ lat: e.a.lat, lng: e.a.lng });
        bounds.extend({ lat: e.b.lat, lng: e.b.lng });
      }
    }

    // Ajusta el mapa
    map.fitBounds(bounds, 64);
  }, [isLoaded, points, edges, showPoints, showEdges, fitOnLoad]);

  // Opciones de los poligonos y guarda en memoria
  const lineOptions = useMemo<google.maps.PolylineOptions>(
    () => ({ strokeOpacity: 0.85, strokeWeight: 2, clickable: false }),
    []
  );

  // Render
  return isLoaded ? (
    // si está cargado ya el mapa lo muestra
    <GoogleMap
      onLoad={(m) => { mapRef.current = m; }}
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={defaultZoom}
      options={{
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        minZoom: 3 
      }}
      onClick={() => setSelected(null)}
    >
      {showEdges &&
        edges.map((e) => (
          <Polyline
            key={`edge-${e.a.id}-${e.b.id}`}
            path={[
              { lat: e.a.lat, lng: e.a.lng },
              { lat: e.b.lat, lng: e.b.lng },
            ]}
            options={lineOptions}
          />
        ))}

      {showPoints &&
        points.map((p) => (
          <Marker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            title={`${p.name} (${p.id})`}
            onClick={() => setSelected(p)}
          />
        ))}

      {selected && (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <div style={{ maxWidth: 280 }}>
            <h3 style={{ margin: "0 0 6px" }}>{selected.name}</h3>
            <div style={{ fontSize: 14 }}>
              <b>Vecinos:</b>{" "}
              {selected.neighbors.length ? selected.neighbors.join(", ") : "Ninguno"}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <p>Cargando mapa…</p>
  );
}
