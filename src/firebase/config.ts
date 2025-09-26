import { initializeApp, getApp, getApps } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";

/**
  * Retorna el valor de la variable de entorno si es que existe, caso
  * contrario lanza un error (fail-fast).
  * @param key - Clave de la variable de entorno.
  * @returns Valor de la variable de entorno, si es que existe.
  * @throws Error si no existe o está vacía.
  */
function env(key: string): string {
  // Obtiene el valor de la variable de entorno (como string)
  const value = (
    import.meta.env[
      key as keyof ImportMetaEnv
    ] as unknown as string | undefined
  );

  // Si no encuentra la variable de entorno, lanza un error
  if (!value){
    throw new Error(`Variable de entorno ${key} no encontrada`)
  };

  // Si todo ok devuelve el valor
  return value;
}

/**
 * Contiene las credenciales de Firebase
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
};

// Inicializa Firebase

/**
 * Obtiene la app de Firebase, Singleton.
 * @remarks
 * - getApps() obtiene todas las apps inicializadas en el proyecto
 * - .length va a ser 0 si no hay ninguna app inicializada
 * - Si hay < 0, significa que hay apps inicializadas por lo que hace getApp()
 * - Si hay > 0, significa que no hay apps inicializadas por lo que hace initializeApp
 */
export const app: FirebaseApp = (
  getApps().length
  // operador ternario = ? "que pasa si true" : "que pasa si false"
    ? getApp()
    : initializeApp(firebaseConfig)
);

// Lo exporta para que igual lo puedan usar otros archivos
export const db: Firestore = getFirestore(app);
