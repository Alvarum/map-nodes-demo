import { useEffect, useState } from "react";
import { useGraph } from "./hooks/useGraph";
import { loginWithEmail } from "./firebase/auth";


export default function App() {

  // Para saber si el auth está listo
  const [ready, setReady] = useState(false);
  const [authErr, setAuthErr] = useState<Error | null>(null);

  // Lee credenciales del entorno SOLO si las configuraste (útil en dev).
  const userMail = import.meta.env.VITE_FIREBASE_AUTH_EMAIL as string | undefined;
  const userPass = import.meta.env.VITE_FIREBASE_AUTH_PASSWORD as string | undefined;

  useEffect(() => {
    (async () => {
      try {
        if (userMail && userPass) {
          await loginWithEmail(userMail, userPass);
        }
        setReady(true);
      } catch (e) {
        setAuthErr(e as Error);
      }
    })();
  }, [userMail, userPass]);

  const { points, edges, loading, error } = useGraph();

  if (authErr) {
    return (
      <div style={{ padding: 16, color: "crimson" }}>
        Error de login: {String(authErr.message || authErr)}
      </div>
    );
  }

  if (!ready) {
    return <div style={{ padding: 16 }}>Iniciando sesión…</div>;
  }

  // Aquí podrías renderizar tu <MapGraph /> si ya lo tienes:
  // <MapGraph points={points} edges={edges} showPoints showEdges fitOnLoad />

  
  return (
    <div style={{ padding: 16 }}>
      <h1>Grid Guardian — Demo (carga 1 listener)</h1>

      {loading && <div>Cargando puntos…</div>}
      {error && <div style={{ color: "crimson" }}>Error: {String(error.message || error)}</div>}

      {!loading && !error && (
        <>
          <p>
            Puntos: <b>{points.length}</b> · Conexiones: <b>{edges.length}</b>
          </p>
          <pre style={{ background: "#f6f7f9", padding: 12, borderRadius: 8, maxHeight: 300, overflow: "auto" }}>
            {JSON.stringify({ points, edges }, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
