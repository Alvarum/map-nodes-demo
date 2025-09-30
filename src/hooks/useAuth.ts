import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth";
import { loginWithEmail } from "../firebase/auth";
import { DEV_AUTH } from "../helpers/privateData";
import { FirebaseError } from "firebase/app";

import type { User } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";


/**
 * Hook que:
 * Escucha el estado de Firebase Auth (user, login/logout).
 * Intenta auto-login si existen VITE_FIREBASE_AUTH_EMAIL/PASSWORD.
 * Expone { user, ready, error } para que la UI no dependa de side-effects.
 */
export function useAuth() {
  // Usuario
  const [user, setUser] = useState<User | null>(null);
  // para saber si el auth esta listo
  const [ready, setReady] = useState(false);
  // para saber si hubo un error
  const [error, setError] = useState<Error | FirebaseError | null>(null);

  // Evita reintentos multiples de autologin en hot reload
  const triedAutoLogin = useRef(false);

  useEffect(() => {
    // Se suscribe a los cambios de estado del auth, guarda la función en `unsub`
    const unsub: Unsubscribe = onAuthStateChanged(
      auth,

      // Callback cada vez que cambia el estado, "nextOrObserver"
      (u) => {
        setUser(u);
        setReady(true);
      },

      // Callback en caso de error
      (err) => {
        if (err instanceof FirebaseError) {
          console.error(err.code, err.message);
        } else console.error(err);
        setError(err as Error);
        setReady(true);
      }
    );

    //Auto login solo si hay credenciales en .env y aun no hay loggeo.
    // es una IIFE async, por eso se usa () => {...}, basicamente una
    // funcion anonima que se ejecuta de inmediato al ser invocada
    (async () => {
      try {
        if (
          // si no se intento autologin
          !triedAutoLogin.current &&
          // y hay credenciales
          DEV_AUTH.email &&
          DEV_AUTH.password &&
          // y no hay loggeo actualmente
          !auth.currentUser
        ) {
          // intenta autologin y lo asigna al mismisimo para no repetir
          triedAutoLogin.current = true;
          await loginWithEmail(DEV_AUTH.email, DEV_AUTH.password);
          // de setear el ready se encarga arriba unsub, probar si sirve
        }
      // En caso de error, lo setea en la variable de errores
      } catch (e) {
        setError(e as Error);
      }
    })();

    // Limpia el listener
    return () => unsub();
  }, []);

  return { user, ready, error };
}
