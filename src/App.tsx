import { useAuth } from "./hooks/useAuth";
import { useGraph } from "./hooks/useGraph";
import { useMemo, useState } from "react";
import MapGraph from "./components/MapGraph";


/**
 * muestra estado de sesión, carga puntos/edges y dibuja el mapa.
 * @returns El componente principal
 */
export default function App() {

  // Para saber si el auth está listo
  const { user, ready, error: authErr } = useAuth();
  const { points, edges, loading, error } = useGraph();

  // UI, toggles de capas y auto-fit
  const [showPoints, setShowPoints] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [fitOnLoad, setFitOnLoad] = useState(true);

  // Stats simples para mostrar en el header
  const stats: { nPoints: number; nEdges: number } = useMemo(
    () => ({
      nPoints: points.length,
      nEdges: edges.length
    }), [points, edges]
  );


  // Auth error
  if (authErr) {
    return (
      <div style={{ padding: 16, color: "crimson" }}>
        Error de login: {String(authErr.message || authErr)}
      </div>
    );
  }

  // Loading
  if (!ready) {
    return <div style={{ padding: 16 }}>Iniciando sesión…</div>;
  }

  // UI
  return (
    <div
      style={{
        height: "100dvh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      {/* Header con controles estado, stats y login */}
      <header
        style={{
          padding: "10px 14px",
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <b>Grid Guardian — Mapa</b>

        <span style={{ opacity: 0.8 }}>
          Sesión: <b>{user ? user.email : "anónimo"}</b>
        </span>

        <label style={{
          display: "flex",
          gap: 6,
          alignItems: "center"
        }}>
          <input
            type="checkbox"
            checked={showPoints}
            onChange={(e) => setShowPoints(e.target.checked)}
          />
          Puntos
        </label>

        <label style={{
          display: "flex",
          gap: 6,
          alignItems: "center"
        }}>
          <input
            type="checkbox"
            checked={showEdges}
            onChange={(e) => setShowEdges(e.target.checked)}
          />
          Conexiones
        </label>

        <label style={{
          display: "flex",
          gap: 6,
          alignItems: "center"
        }}>
          <input
            type="checkbox"
            checked={fitOnLoad}
            onChange={(e) => setFitOnLoad(e.target.checked)}
            title="Ajustar vista automáticamente cuando cambian datos o toggles"
          />
          Auto-fit
        </label>

        <span style={{ opacity: 0.8 }}>
          {loading
            ? "Cargando puntos de detección"
            : `Puntos: ${stats.nPoints} · Conexiones: ${stats.nEdges}`}
        </span>

        {error && (
          <span style={{ color: "crimson" }}>
            Error: {String(error.message || error)}
          </span>
        )}
      </header>

      {/* Cuerpo: mapa o fallback */}
      <main style={{
        height: "100%",
        width: "100%",
        display: "flex"
      }}>
        {!loading && !error ? (
          <div style={{ flex: 1, minWidth: 0 }}>
            <MapGraph
              points={points}
              edges={edges}
              showPoints={showPoints}
              showEdges={showEdges}
              fitOnLoad={fitOnLoad}
            />
          </div>
        ) : (
          <div style={{ padding: 16 }}>
            {loading ? "Preparando el mapa…" : null}
          </div>
        )}
      </main>
    </div>
  );
}
