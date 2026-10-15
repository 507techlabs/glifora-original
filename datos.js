"use strict";
/* ============================================================
   DATOS BASE: fuentes y paletas
   - Todas las fuentes son SIL OFL (Google Fonts), uso comercial permitido.
   - "k" ajusta el tamaño visual de cada fuente (algunas salen más chicas/grandes).
   - Antes de añadir una fuente nueva: verificar licencia y soporte de ñ á é í ó ú ¿ ¡.
   ============================================================ */

const FUENTES = [
  { id: "Pacifico",       peso: 400, cat: "Manuscrita",  k: 1.00, lic: "OFL" },
  { id: "Great Vibes",    peso: 400, cat: "Caligráfica", k: 1.35, lic: "OFL" },
  { id: "UnifrakturCook", peso: 700, cat: "Gótica",      k: 1.05, lic: "OFL" },
  { id: "Dancing Script", peso: 700, cat: "Cursiva",     k: 1.10, lic: "OFL" },
  { id: "Bungee",         peso: 400, cat: "Retro",       k: 0.85, lic: "OFL" },
  { id: "Orbitron",       peso: 800, cat: "Futurista",   k: 0.80, lic: "OFL" },
  { id: "Fredoka",        peso: 600, cat: "Infantil",    k: 1.00, lic: "OFL" },
  { id: "Lobster",        peso: 400, cat: "Retro",       k: 1.00, lic: "OFL" },
  { id: "Cinzel",         peso: 700, cat: "Elegante",    k: 0.90, lic: "OFL" },
  { id: "Righteous",      peso: 400, cat: "Moderna",     k: 0.95, lic: "OFL" }
];

/* Cada paleta: degradado vertical "grad" [posición, color], color de borde,
   color de sombra, color de brillo/neón (glow) y un color claro para rellenos planos. */
const PALETAS = [
  { n: "Oro",       grad: [[0, "#fff8c4"], [0.35, "#f7c52b"], [0.5, "#a86b00"], [0.56, "#e8a800"], [1, "#fff0a0"]],
    borde: "#5a3a00", sombra: "rgba(0,0,0,0.55)", glow: "#ffcc33", claro: "#fff3b0" },
  { n: "Plata",     grad: [[0, "#ffffff"], [0.4, "#c9d1d9"], [0.5, "#6f7a86"], [0.56, "#dfe5ea"], [1, "#ffffff"]],
    borde: "#39424c", sombra: "rgba(0,0,0,0.5)", glow: "#cfe6ff", claro: "#f4f8fc" },
  { n: "Cromo",     grad: [[0, "#eaf6ff"], [0.45, "#6fa8dc"], [0.5, "#1c2b3a"], [0.53, "#e7c9a0"], [1, "#fff3e0"]],
    borde: "#0f1a26", sombra: "rgba(0,0,0,0.55)", glow: "#7fc4ff", claro: "#f0f8ff" },
  { n: "Bronce",    grad: [[0, "#ffe0b5"], [0.4, "#d38a3c"], [0.5, "#6a3a12"], [0.56, "#c47a2c"], [1, "#ffd7a0"]],
    borde: "#3a1e08", sombra: "rgba(0,0,0,0.55)", glow: "#ff9d3c", claro: "#ffe9cc" },
  { n: "Rosa neón", grad: [[0, "#ffd6f3"], [0.5, "#ff4fd8"], [1, "#b0008f"]],
    borde: "#5a004a", sombra: "rgba(60,0,50,0.5)", glow: "#ff2bd6", claro: "#ffeafa" },
  { n: "Cian neón", grad: [[0, "#e6ffff"], [0.5, "#27e6ff"], [1, "#0077a8"]],
    borde: "#003a52", sombra: "rgba(0,40,60,0.5)", glow: "#00e5ff", claro: "#e8ffff" },
  { n: "Verde neón", grad: [[0, "#eaffd9"], [0.5, "#4dff2a"], [1, "#138a00"]],
    borde: "#0a4200", sombra: "rgba(0,50,0,0.5)", glow: "#39ff14", claro: "#efffe6" },
  { n: "Fuego",     grad: [[0, "#fff59d"], [0.4, "#ffb300"], [0.7, "#f4511e"], [1, "#b71c1c"]],
    borde: "#4a0d00", sombra: "rgba(60,0,0,0.55)", glow: "#ff6a00", claro: "#fff1c4" },
  { n: "Hielo",     grad: [[0, "#ffffff"], [0.45, "#bfe9ff"], [0.75, "#5aa9e6"], [1, "#e9f7ff"]],
    borde: "#1d4f7a", sombra: "rgba(0,40,80,0.5)", glow: "#7fd6ff", claro: "#f3fbff" },
  { n: "Arcoíris",  grad: [[0, "#ff3b3b"], [0.2, "#ffb703"], [0.4, "#9ef01a"], [0.6, "#00c2ff"], [0.8, "#7b2ff7"], [1, "#ff3bd4"]],
    borde: "#222222", sombra: "rgba(0,0,0,0.5)", glow: "#ffffff", claro: "#ffffff" },
  { n: "Atardecer", grad: [[0, "#ffd166"], [0.5, "#ef476f"], [1, "#7b2cbf"]],
    borde: "#2d0a4e", sombra: "rgba(30,0,60,0.5)", glow: "#ff6b9d", claro: "#ffe8f0" },
  { n: "Esmeralda", grad: [[0, "#d8ffe8"], [0.45, "#2ecc71"], [0.5, "#0b6b3a"], [1, "#7dffb3"]],
    borde: "#033d1e", sombra: "rgba(0,40,20,0.55)", glow: "#3dffa0", claro: "#e6fff0" },
  { n: "Rosa gold", grad: [[0, "#fde2e0"], [0.4, "#e8a5a0"], [0.5, "#b76e79"], [0.56, "#f5c9c3"], [1, "#fff0ee"]],
    borde: "#6b3a42", sombra: "rgba(60,20,30,0.5)", glow: "#ffb3c1", claro: "#fff0f2" },
  { n: "Candy",     grad: [[0, "#fff3a0"], [0.5, "#ff7eb6"], [1, "#6ec6ff"]],
    borde: "#ffffff", sombra: "rgba(80,0,80,0.35)", glow: "#ff9ad5", claro: "#ffffff" }
];
