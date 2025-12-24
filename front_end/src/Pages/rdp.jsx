import React, { useState, useEffect } from "react";

export default function App() {
  const [places, setPlaces] = useState({
    etage1: 1,
    etage2: 0,
    porteOuverte: 0,
    porteFermee: 1,
    ascenseurEnMouvement: 0,
  });

  const [auto, setAuto] = useState(false);

  const transitions = {
    appelEtage2: { from: ["etage1", "porteFermee"], to: ["ascenseurEnMouvement"] },
    arriveEtage2: { from: ["ascenseurEnMouvement"], to: ["etage2", "porteFermee"] },
    ouverturePorte: { from: ["porteFermee"], to: ["porteOuverte"] },
    fermeturePorte: { from: ["porteOuverte"], to: ["porteFermee"] },
    retourEtage1: { from: ["etage2", "porteFermee"], to: ["ascenseurEnMouvement"] },
    arriveEtage1: { from: ["ascenseurEnMouvement"], to: ["etage1", "porteFermee"] },
  };

  const tirerTransition = (nom) => {
    const t = transitions[nom];
    const newPlaces = { ...places };

    // Vérifier si toutes les places d'entrée ont un jeton
    if (t.from.every((p) => newPlaces[p] > 0)) {
      // Retirer les jetons des places d'entrée
      t.from.forEach((p) => (newPlaces[p] -= 1));
      // Ajouter les jetons aux places de sortie
      t.to.forEach((p) => (newPlaces[p] += 1));
      setPlaces(newPlaces);
    }
  };

  useEffect(() => {
    if (auto) {
      const cycle = [
        "appelEtage2",
        "arriveEtage2",
        "ouverturePorte",
        "fermeturePorte",
        "retourEtage1",
        "arriveEtage1",
      ];
      let i = 0;
      const timer = setInterval(() => {
        tirerTransition(cycle[i]);
        i = (i + 1) % cycle.length;
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [auto]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Simulation Réseau de Petri - Ascenseur</h1>

      <svg width="500" height="300" style={{ border: "1px solid black" }}>
        {Object.entries(places).map(([place, token], idx) => (
          <g key={place}>
            <circle
              cx={100 + (idx % 3) * 150}
              cy={50 + Math.floor(idx / 3) * 150}
              r="30"
              fill="white"
              stroke="black"
              strokeWidth="2"
            />
            {token > 0 && (
              <circle
                cx={100 + (idx % 3) * 150}
                cy={50 + Math.floor(idx / 3) * 150}
                r="10"
                fill="black"
              />
            )}
            <text
              x={100 + (idx % 3) * 150}
              y={50 + Math.floor(idx / 3) * 150 + 50}
              fontSize="12"
              textAnchor="middle"
            >
              {place}
            </text>
          </g>
        ))}
      </svg>

      <div style={{ marginTop: "20px" }}>
        {Object.keys(transitions).map((t) => (
          <button key={t} onClick={() => tirerTransition(t)} style={{ margin: "5px" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setAuto(!auto)}>
          {auto ? "Arrêter Auto" : "Démarrer Auto"}
        </button>
      </div>
    </div>
  );
}
