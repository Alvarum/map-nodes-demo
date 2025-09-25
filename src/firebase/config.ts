import { initializeApp, getApp, getApps } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";


// Carga una variable de entorno con fail-fast
function env(key: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv] as unknown as string | undefined;
  if (!value) throw new Error(`Variable de entorno ${key} no encontrada`);
  return value;
}


// Carga las configuraciones desde las variables de entorno
const firebaseConfig: FirebaseOptions  = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Inicializa Firebase

// getApps() obtiene todas las apps inicializadas en el proyecto
// .length va a ser 0 si no hay ninguna app inicializada
// Si hay < 0, significa que hay apps inicializadas por lo que hace getApp()
// Si hay > 0, significa que no hay apps inicializadas por lo que hace initializeApp
const app: FirebaseApp = (
  getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
);

// Lo exporta para que igual lo puedan usar otros archivos
export const db: Firestore = getFirestore(app);