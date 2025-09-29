//** Helpers para trabajar con variables de entorno. */
type EnvKey = keyof ImportMetaEnv;

// region tipado
type EnvType = "string" | "boolean" | "int" | "float";
type EnvTypeMap = {
  string: string;
  boolean: boolean;
  int: number;
  float: number;
};

// region overloads
// Le dicen al compilador que es lo que va a devolver dependiendo de
// los argumentos, si no, los infiere y hay que ponerlos manualmente
export function env(key: EnvKey): string;
export function env(key: EnvKey, type: "string"): string;
export function env(key: EnvKey, type: "boolean"): boolean;
export function env(key: EnvKey, type: "int"): number;
export function env(key: EnvKey, type: "float"): number;


// region functions
/**
 * Retorna el valor de la variable de entorno convertido al tipo solicitado.
 * @param key - Nombre de la variable de entorno.
 * @param type - Tipo de retorno esperado ("string", "boolean", "int").
 * @returns El valor convertido al tipo indicado.
 * @throws Error si la variable no existe o no cumple con el formato esperado.
 */
export function env<T extends EnvType>(
  key: EnvKey,
  type: T = "string" as T
): EnvTypeMap[T] {

  // Obtiene la variable de entorno, si no encuentra la variable de 
  // entorno lanza un error
  const raw = import.meta.env[key];
  if (!raw) throw new Error(`Variable de entorno ${key} no encontrada`);

  // Trim borra espacios en blanco al principio y al final xd
  const value = raw.trim();

  // Si es booleano
  if (type === "boolean") {
    const normalized = value.toLowerCase();
    if (normalized === "true" || normalized === "1") return true as any;
    if (normalized === "false" || normalized === "0") return false as any;
    throw new Error(`Variable ${key} debe ser booleana (true/false/1/0)`);
  }

  // Si es entero
  if (type === "int") {
    const n = Number(value);
    if (!Number.isInteger(n)) {
      throw new Error(`Variable ${key} debe ser entero`);
    }
    return n as any;
  }

  // Si es float
  if (type === "float") {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      throw new Error(`Variable ${key} debe ser float`);
    }
    return n as any;
  }

  // Si no es ninguno, ps debería ser string el por defecto
  return value as any;
}

/**
 * "a/b//c/" -> ["a","b","c"] (sin vacíos).
 * Basicamente divide el string en segmentos, sirve para rutas para
 * firebase
 * @param path - String a dividir, separado por "/"
 * @returns Array de segmentos string
 */
export function toSegments(path: string): readonly string[] {
  // Limpia el path
  const cleaned = path.trim();

  // revisa si el path esta vacio
  if (cleaned.length === 0) {
    throw new Error("toSegments: path no puede ser vacío");
  }

  // Limpia el path, por si hay "/" al principio o al final
  const segments = cleaned.split("/").filter(Boolean);
  if (segments.length === 0) {
    throw new Error("toSegments: no hay segmentos válidos en el path");
  }

  // si llega aqui, todo bien todo correcto
  return segments as readonly string[];
}
