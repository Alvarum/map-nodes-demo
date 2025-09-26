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
  if (!auth) throw new Error("Problema con el auth");

  const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log({ cred });

  // Si no se pudo iniciar sesión, lanza un error
  if (!cred.user) throw new Error("No se pudo iniciar sesión");

  return cred.user;
}
