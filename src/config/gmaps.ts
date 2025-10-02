import { type CSSProperties } from "react";
import { customGrayStyle } from "./mapStyles";

/** Zoom del mapa */
export const defaultZoom: number = 4;

/** Centro del mapa */
export const defaultCenter: google.maps.LatLngLiteral = {
    lat: -15,
    lng: -60
};

/** Estilo del contenedor del mapa */
export const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%"
};

/** Opciones de los poligonos y guarda en memoria */
export const lineOptions: google.maps.PolylineOptions = {
  strokeColor: "#505050ff",
  strokeOpacity: 0.85,
  strokeWeight: 0.85,
  clickable: true,
};

/** Opciones del mapa */
export const mapOptions: google.maps.MapOptions = {
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  minZoom: 3,
  styles: customGrayStyle,
};

/** Iconos personalizados */
export function makeIcon(url: string, size: number): google.maps.Icon | undefined {
  if (!window.google) return undefined;
  return {
    url,
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(size / 2, size / 2),
  };
}
