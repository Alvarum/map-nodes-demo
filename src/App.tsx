import { useEffect, useState } from "react";
import { useGraph } from "./hooks/useGraph";
import { loginWithEmail } from "./firebase/auth";

function App() {

  const [ready, setReady] = useState(false);
  const [authErr, setAuthErr] = useState<Error | null>(null);

  // sacar las credenciales del env
  const userMail: string = import.meta.env.VITE_FIREBASE_AUTH_EMAIL;
  const userPass: string = import.meta.env.VITE_FIREBASE_AUTH_PASSWORD;

  useEffect(() => {
    (async () => {
      try {
        await loginWithEmail(userMail, userPass);
        setReady(true);
      } catch (e) {
        setAuthErr(e as Error);
      }
    })();
  }, []);

  const { points, edges, loading, error } = useGraph();
  console.log({ points, edges, loading, error });

  if (authErr) return <div>Error de login: {String(authErr.message || authErr)}</div>;
  //if (!ready) return <div>Iniciando sesión…</div>;

  return (
    <div className="App">
      {/* <button onClick={buttonLogin}>Login</button>
      <h1>Grid Guardian - Mapa de Puntos</h1> */}
    </div>
  );
}

export default App
