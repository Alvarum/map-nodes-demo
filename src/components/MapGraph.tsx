import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  lineOptions,
  mapOptions,
  containerStyle,
  defaultCenter,
  defaultZoom,
  makeIcon
} from "../config/gmaps";
import {
  GOOGLE_MAPS,
  ICONS
} from "../helpers/privateData";
import type {
  DetectionPoint,
  MapGraphProps
} from "../types/interfaces";


// componente principal
export default function MapGraph(
  {
    points,
    edges,
    showPoints = true,
    showEdges = true,
    fitOnLoad = true
  }: MapGraphProps
){

  // Referencia donde se instancia el map
  const mapRef: React.RefObject<google.maps.Map | null> = (
    useRef<google.maps.Map | null>(null)
  );

  // Selección de un punto
  const [selected, setSelected] = useState<DetectionPoint | null>(null);

  // Carga el mapa, booleano que avisa si se ha cargado al mismo tiempo
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS.API_KEY,
  });


  // Auto ajusta el mapa
  useEffect(() => {
    // Si no se ha cargado el mapa, no hace narinas
    if (!isLoaded || !mapRef.current || !fitOnLoad) return;

    // Obtiene el mapa
    const map: google.maps.Map = mapRef.current;
    // Revisa si hay puntos de detección
    const hasPts: boolean = showPoints && points.length > 0;
    // Revisa si hay aristas
    const hasEdg: boolean = showEdges && edges.length > 0;

    // si no hay nada que mostrar, no hace nada
    if (!hasPts && !hasEdg) return;

    // enlaces
    const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();

    // Si hay puntos de detección, los agrega al bounds por sus coordenadas
    if (hasPts) for (const p of points) bounds.extend({ lat: p.lat, lng: p.lng });

    // Si hay aristas, las agrega al bounds por sus coordenadas
    if (hasEdg) {
      for (const e of edges) {
        bounds.extend({
          lat: e.a.lat,
          lng: e.a.lng
        });
        bounds.extend({
          lat: e.b.lat,
          lng: e.b.lng
        });
      }
    }

    // Ajusta el mapa
    map.fitBounds(bounds, 64);
  },[
      isLoaded,
      points,
      edges,
      showPoints,
      showEdges,
      fitOnLoad
    ]);

  // Render
  return isLoaded ? (
    // Si está cargado ya el mapa ps lo muestra
    <GoogleMap
      onLoad={(m) => { mapRef.current = m; }}
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={defaultZoom}
      options={mapOptions}
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
            icon={makeIcon(ICONS.GREENCIRCLE, 8)}
          />
        ))}

      {selected && (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <div style={{ maxWidth: 680 }}>
            <h3 style={{ margin: "0 0 6px", color: "#444" }}>{selected.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}</h3>
            <div style={{ fontSize: 14, color: "#444" }}>
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
