import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './config';
import type { User } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

// Obtiene el auth
export const auth = getAuth(app);

/**
 * Loggea con email y password al desgraciado que este intentando usar la web
 * @param email
 * @param password
 * @returns
 */
export async function loginWithEmail(email: string, password: string): Promise<User> {

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login OK:", cred.user);
    return cred.user;
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error.code, error.message);
    throw error;
  }

  // // Intenta iniciar sesión
  // console.log("Intentando iniciar sesión: ", { email, password });

  // if (!auth) throw new Error("Problema con el auth");

  // const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  // console.log({ cred });

  // // Si no se pudo iniciar sesión, lanza un error
  // if (!cred.user) throw new Error("No se pudo iniciar sesión");

  // return cred.user;
}