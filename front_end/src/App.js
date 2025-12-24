import React, { useState, useEffect, useRef } from "react";

// --- Places initiales ---
// panne = 1 signifie "pas de panne" (ascenseur OK)
// panne = 0 signifie "en panne"
const initialPlaces = {
  etage1: 1,
  etage2: 0,
  porteOuverte: 0,
  porteFermee: 1,
  ascenseurEnMouvement: 0,
  panne: 1, // Ascenseur OK au départ
  porteCoincee: 0,
};

// --- Transitions ---
const transitions = {
  appelEtage2: { from: ["etage1", "porteFermee", "panne"], to: ["ascenseurEnMouvement", "panne"] },
  arriveEtage2: { from: ["ascenseurEnMouvement", "panne"], to: ["etage2", "porteFermee", "panne"] },
  ouverturePorte: { from: ["porteFermee", "panne"], to: ["porteOuverte", "panne"] },
  fermeturePorte: { from: ["porteOuverte", "panne"], to: ["porteFermee", "panne"] },
  retourEtage1: { from: ["etage2", "porteFermee", "panne"], to: ["ascenseurEnMouvement", "panne"] },
  arriveEtage1: { from: ["ascenseurEnMouvement", "panne"], to: ["etage1", "porteFermee", "panne"] },

  porteCoinceeErreur: { from: ["porteOuverte"], to: ["porteCoincee"] },
  porteDebloquee: { from: ["porteCoincee"], to: ["porteOuverte"] },

  declarationPanne: { from: ["panne"], to: [] }, // panne : retirer jeton = panne active
  reparationPanne: { from: [], to: ["panne"] }, // remettre jeton = réparation OK
};

export default function App() {
  const [places, setPlaces] = useState(initialPlaces);
  const [auto, setAuto] = useState(false);
  const [log, setLog] = useState([]);
  const [animating, setAnimating] = useState(null);
  const timerRef = useRef(null);

  // Vérifie si une transition est tirable
  const isEnabled = (nom) => {
    const t = transitions[nom];
    if (!t) return false;
    return t.from.every((p) => places[p] > 0);
  };

  // Tirer une transition avec délais et contraintes
  const tirerTransition = (nom) => {
    if (!isEnabled(nom)) return;
    // Vérif erreurs porte coincée
    if (nom === "ouverturePorte" && places.porteCoincee) {
      ajouterLog("Erreur : porte coincée, impossible d'ouvrir !");
      return;
    }
    if (nom === "fermeturePorte" && places.porteCoincee) {
      ajouterLog("Erreur : porte coincée, impossible de fermer !");
      return;
    }

    if (nom === "appelEtage2" || nom === "retourEtage1") {
      ajouterLog(`Ascenseur démarre déplacement (${nom})`);
      setAnimating(nom);
      setTimeout(() => {
        appliquerTransition(nom);
        setAnimating(null);
        ajouterLog(`Ascenseur arrivé (${nom})`);
      }, 2000);
      return;
    }
    if (nom === "ouverturePorte" || nom === "fermeturePorte") {
      ajouterLog(`Porte ${nom === "ouverturePorte" ? "ouverture" : "fermeture"} en cours...`);
      setAnimating(nom);
      setTimeout(() => {
        appliquerTransition(nom);
        setAnimating(null);
        ajouterLog(`Porte ${nom === "ouverturePorte" ? "ouverte" : "fermée"}`);
      }, 1500);
      return;
    }

    if (nom === "porteCoinceeErreur") {
      ajouterLog("La porte vient de se coincer ! Intervention nécessaire.");
    }
    if (nom === "reparationPanne") {
      ajouterLog("Panne réparée, ascenseur opérationnel.");
    }
    if (nom === "declarationPanne") {
      ajouterLog("Panne détectée ! Ascenseur hors service.");
    }

    appliquerTransition(nom);
  };

  // Appliquer transition sans délai
  const appliquerTransition = (nom) => {
    const t = transitions[nom];
    if (!t) return;
    setPlaces((prev) => {
      if (!t.from.every((p) => prev[p] > 0)) return prev;
      const next = { ...prev };
      t.from.forEach((p) => (next[p] -= 1));
      t.to.forEach((p) => (next[p] += 1));
      return next;
    });
    setLog((old) => [`Transition: ${nom}`, ...old].slice(0, 20));
  };

  const ajouterLog = (msg) => {
    setLog((old) => [msg, ...old].slice(0, 20));
  };

  useEffect(() => {
    if (!auto) return;
    let i = 0;
    timerRef.current = setInterval(() => {
      // Si panne active (panne=0), on ne fait que réparation
      if (places.panne === 0 && cycle[i] !== "reparationPanne") {
        ajouterLog("Ascenseur en panne, en attente de réparation...");
      } else if (isEnabled(cycle[i])) {
        tirerTransition(cycle[i]);
      }
      i = (i + 1) % cycle.length;
    }, 3000);

    return () => clearInterval(timerRef.current);
  }, [auto, places]);

  const cycle = [
    "appelEtage2",
    "arriveEtage2",
    "ouverturePorte",
    "fermeturePorte",
    "porteCoinceeErreur",
    "porteDebloquee",
    "retourEtage1",
    "arriveEtage1",
    "declarationPanne",
    "reparationPanne",
  ];

  const getEtatAscenseur = () => {
    if (places.panne === 0) return "🚨 Ascenseur en panne !";
    if (places.ascenseurEnMouvement) return "Ascenseur en mouvement 🚀";
    if (places.porteOuverte) return "Porte ouverte 🚪";
    if (places.porteFermee) return "Porte fermée 🔒";
    return "Inconnu";
  };

  // Nouvelle position des places dans le SVG
  const coords = {
    etage1: { x: 150, y: 100 },
    porteFermee: { x: 350, y: 100 },
    ascenseurEnMouvement: { x: 550, y: 100 },
    etage2: { x: 350, y: 250 },
    porteOuverte: { x: 150, y: 250 },
    panne: { x: 550, y: 250 },
    porteCoincee: { x: 600, y: 250 }, // déplacé à droite, plus visible
  };

  return (
    <>
      {/* Import Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body {
          margin: 0; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Poppins', sans-serif;
          color: #333;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #764ba2;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #e0d7f4;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "transparent",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            fontWeight: 600,
            fontSize: 32,
            marginBottom: 20,
            textShadow: "0 3px 8px rgba(0,0,0,0.4)",
            animation: "pulse 2s infinite",
          }}
        >
          Simulation Réseau de Petri — Ascenseur Réaliste
        </h1>

        <p
          style={{
            background: "rgba(255 255 255 / 0.85)",
            borderRadius: 12,
            padding: "10px 20px",
            boxShadow: "0 4px 10px rgb(0 0 0 / 0.1)",
            maxWidth: 400,
            fontWeight: "600",
            fontSize: 18,
            marginBottom: 30,
            color: "#333",
          }}
        >
          <b>Position :</b>{" "}
          {places.etage1 ? "Étage 1" : places.etage2 ? "Étage 2" : "En transit"} — <b>État :</b>{" "}
          {getEtatAscenseur()}
        </p>

        <svg
          width="720"
          height="360"
          style={{
            borderRadius: 20,
            background: "white",
            boxShadow: "0 12px 20px rgb(0 0 0 / 0.15)",
            marginBottom: 30,
          }}
        >
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#764ba2" />
            </marker>
            <radialGradient id="gradGreen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b2fab4" />
              <stop offset="100%" stopColor="#4caf50" />
            </radialGradient>
          </defs>

          {/* Flèches */}
          <line
            x1="180"
            y1="100"
            x2="320"
            y2="100"
            stroke="#764ba2"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1="380"
            y1="100"
            x2="520"
            y2="100"
            stroke="#764ba2"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1="520"
            y1="100"
            x2="380"
            y2="240"
            stroke="#764ba2"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1="320"
            y1="240"
            x2="180"
            y2="240"
            stroke="#764ba2"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1="180"
            y1="240"
            x2="320"
            y2="100"
            stroke="#764ba2"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Places */}
          {Object.entries(places).map(([place, token]) => {
            const c = coords[place];
            if (!c) return null;

            // Dégradé vert clair si actif, gris clair sinon
            const fill = token > 0 ? "url(#gradGreen)" : "#f0f0f0";

            // Couleurs du contour animées
            const highlight =
              animating && transitions[animating]?.from.includes(place)
                ? "#ff9800"
                : animating && transitions[animating]?.to.includes(place)
                ? "#4caf50"
                : "#764ba2";

            return (
              <g key={place}>
                <circle cx={c.x} cy={c.y} r={30} fill={fill} stroke={highlight} strokeWidth={3} />
                {token > 0 && <circle cx={c.x} cy={c.y} r={12} fill="#1b5e20" />}
                <text
                  x={c.x}
                  y={c.y + 50}
                  fontSize={14}
                  textAnchor="middle"
                  fill="#444"
                  fontWeight="600"
                  style={{ userSelect: "none" }}
                >
                  {place}
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ marginBottom: 20 }}>
          {Object.keys(transitions).map((t) => (
            <button
              key={t}
              onClick={() => tirerTransition(t)}
              disabled={!isEnabled(t)}
              style={{
                margin: 6,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                backgroundColor: isEnabled(t) ? "#764ba2" : "#d1c4e9",
                color: isEnabled(t) ? "white" : "#9e9e9e",
                fontWeight: "600",
                cursor: isEnabled(t) ? "pointer" : "not-allowed",
                boxShadow: isEnabled(t) ? "0 4px 8px rgb(118 75 162 / 0.5)" : "none",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                if (isEnabled(t)) e.currentTarget.style.backgroundColor = "#5e35b1";
              }}
              onMouseLeave={(e) => {
                if (isEnabled(t)) e.currentTarget.style.backgroundColor = "#764ba2";
              }}
              title={`Tirer transition ${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={() => setAuto((v) => !v)}
            style={{
              padding: "12px 24px",
              borderRadius: 30,
              border: "none",
              backgroundColor: auto ? "#e53935" : "#43a047",
              color: "white",
              fontWeight: "700",
              fontSize: 16,
              cursor: "pointer",
              boxShadow: auto
                ? "0 6px 15px rgba(229, 57, 53, 0.7)"
                : "0 6px 15px rgba(67, 160, 71, 0.7)",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            {auto ? "⏹ Arrêter Auto" : "▶ Démarrer Auto"}
          </button>
        </div>

        <div
          style={{
            maxWidth: 700,
            margin: "40px auto 0",
            textAlign: "left",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 10px 20px rgb(0 0 0 / 0.1)",
            fontSize: 14,
            fontFamily: "'Courier New', monospace",
            color: "#444",
            maxHeight: 180,
            overflowY: "auto",
            userSelect: "text",
          }}
        >
          <h4 style={{ marginTop: 0, marginBottom: 12, color: "#764ba2" }}>📝 Journal (dernières actions)</h4>
          {log.length === 0 ? (
            <div style={{ color: "#999" }}>Aucune transition effectuée</div>
          ) : (
            log.map((l, i) => <div key={i}>{l}</div>) 
          )}
        </div>

        {/* Animation pulse CSS */}
        <style>{`
          @keyframes pulse {
            0% { text-shadow: 0 0 6px #b39ddb, 0 0 12px #b39ddb; }
            50% { text-shadow: 0 0 20px #7e57c2, 0 0 30px #7e57c2; }
            100% { text-shadow: 0 0 6px #b39ddb, 0 0 12px #b39ddb; }
          }
        `}</style>
      </div>
    </>
  );
}
