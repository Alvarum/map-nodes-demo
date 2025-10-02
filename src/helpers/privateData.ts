// data "privada" de la app, ir agregando aquí rutas y variables de
// entorno, para llevar un orden más que nada
import type { FirebaseOptions } from "firebase/app";
import { env, toSegments } from "./env.ts"

// convierte a segmentos
const detectionPointsStr: string = env(
    "VITE_DETECTION_POINTS",
    "string"
);
const detectionPoints: readonly string[] = toSegments(detectionPointsStr);

//Configuración de Firebase
export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
};

// Credenciales de autenticación en desarrollo (las propias)
export const DEV_AUTH: Record<string, string> = Object.freeze({
  email: env('VITE_FIREBASE_AUTH_EMAIL'),
  password: env('VITE_FIREBASE_AUTH_PASSWORD'),
});

//Paths de Firestore.
export const FIRESTORE_PATHS: Record<string, readonly string[]> = Object.freeze({
    DETECTION_POINTS: detectionPoints,
})

//Maps
export const GOOGLE_MAPS: Record<string, string> = Object.freeze({
    API_KEY: env('VITE_GOOGLE_MAPS_API_KEY'),
})

//Path locales de los iconos
export const ICONS: Record<string, string> = Object.freeze({
    GREENCIRCLE: 'icons/green.png',
})
