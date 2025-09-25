import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import { useState, useEffect } from "react";
import type { DetectionPoint } from "./types/interfaces";

function App() {

  // Use tate retorna 2 cosas, un estado (actual) y una funcion para actualizarlo
  // hay reglas para los hooks:
  //- sólo se llaman en el tope del cuerpo del componente (no dentro de if, for, callbacks)
  //- siempre en el mismo orden entre renders
  const [points, setPoints] = useState<DetectionPoint[]>([]);

  // Para pantalla de carga
  const [loading, setLoading] = useState(true);

  // Renderizado de mensaje de error
  const [error, setError] = useState<Error | null>(null);

  return (
    <div className="App">
      {/* Contenido de app irá aquí */}
      <h1>Grid Guardian - Mapa de Puntos</h1>
    </div>
  );
}

export default App
