// Inicializa Firebase
import { initializeApp, getApp, getApps } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../helpers/privateData";
import type { FirebaseApp} from "firebase/app";

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
    : initializeApp(FIREBASE_CONFIG)
);

// Lo exporta para que igual lo puedan usar otros archivos
export const db: Firestore = getFirestore(app);
