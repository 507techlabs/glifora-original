"use strict";
/* ============================================================
   CATÁLOGO: un estilo = (fuente, efecto, paleta, variante).
   No se guarda ninguna imagen: cada combinación se convierte en una
   "receta" (lista de capas) y el motor la dibuja al momento.

   Total = FUENTES × EFECTOS × PALETAS × 5 variantes.
   Con 10 × 9 × 14 × 5 = 6.300 combinaciones. Añadir una fuente
   o una paleta multiplica el catálogo sin crear archivos.

   Las medidas de las capas están pensadas para un texto de tamaño 100
   y el motor las escala al tamaño real.
   ============================================================ */

const Estilos = (() => {
  const NV = 5; // variantes por combinación
  const rad = (g) => (g * Math.PI) / 180;
  const med = (p) => p.grad[Math.floor(p.grad.length / 2)][1];

  const EFECTOS = [
    { n: "Metal 3D", fn: (p, v) => {
        const prof = 6 + v * 3, a = rad(60);
        return [
          { t: "sombra", color: p.sombra, blur: 10 + v * 2, dx: Math.cos(a) * prof + 3, dy: Math.sin(a) * prof + 6 },
          { t: "extrusion", prof, angulo: 60, color: p.borde },
          { t: "contorno", ancho: 2 + v * 0.4, color: p.borde },
          { t: "relleno", grad: p.grad },
          { t: "brillo", int: 0.55 },
          { t: "bisel", d: 1 + v * 0.3 }
        ];
    } },
    { n: "Neón", fn: (p, v) => {
        const k = 1 + v * 0.25;
        return [
          { t: "glow", color: p.glow, radios: [4 * k, 10 * k, 20 * k, 36 * k] },
          { t: "contorno", ancho: 2.5, color: p.glow },
          { t: "relleno", color: p.claro }
        ];
    } },
    { n: "Contorno grueso", fn: (p, v) => [
        { t: "sombra", color: p.sombra, blur: 6, dx: 0, dy: 5 + v },
        { t: "contorno", ancho: 7 + v * 1.6, color: p.borde },
        { t: "relleno", grad: p.grad },
        { t: "brillo", int: 0.4 }
    ] },
    { n: "Bloque 3D", fn: (p, v) => {
        const prof = 14 + v * 5, ang = [90, 60, 120, 45, 135][v], a = rad(ang);
        return [
          { t: "sombra", color: p.sombra, blur: 14, dx: Math.cos(a) * prof + 2, dy: Math.sin(a) * prof + 8 },
          { t: "extrusion", prof, angulo: ang, color: p.borde },
          { t: "contorno", ancho: 2.5, color: p.borde },
          { t: "relleno", grad: p.grad },
          { t: "brillo", int: 0.35 }
        ];
    } },
    { n: "Retro", fn: (p, v) => [
        { t: "extrusion", prof: 8 + v * 2.5, angulo: 45, color: med(p) },
        { t: "contorno", ancho: 2.5, color: p.borde },
        { t: "relleno", color: p.claro }
    ] },
    { n: "Relieve piedra", fn: (p, v) => [
        { t: "sombra", color: p.sombra, blur: 6, dx: 2, dy: 4 + v },
        { t: "contorno", ancho: 1.6, color: p.borde },
        { t: "relleno", grad: p.grad },
        { t: "ruido", int: 0.18 + v * 0.07 },
        { t: "bisel", d: 1.6 + v * 0.4 },
        { t: "brillo", int: 0.2 }
    ] },
    { n: "Degradado suave", fn: (p, v) => [
        { t: "sombra", color: p.sombra, blur: 14 + v * 4, dx: 0, dy: 8 },
        { t: "relleno", grad: p.grad },
        { t: "brillo", int: 0.35 + v * 0.05 }
    ] },
    { n: "Doble contorno", fn: (p, v) => [
        { t: "contorno", ancho: 9 + v * 1.5, color: p.glow },
        { t: "contorno", ancho: 4.5, color: p.borde },
        { t: "relleno", grad: p.grad },
        { t: "brillo", int: 0.3 }
    ] },
    { n: "Glow metálico", fn: (p, v) => [
        { t: "glow", color: p.glow, radios: [8 + v * 2, 22 + v * 4] },
        { t: "contorno", ancho: 2.5, color: p.borde },
        { t: "relleno", grad: p.grad },
        { t: "brillo", int: 0.5 },
        { t: "bisel", d: 1.2 }
    ] }
  ];

  const total = FUENTES.length * EFECTOS.length * PALETAS.length * NV;

  const aId = (f, e, p, v) => ((f * EFECTOS.length + e) * PALETAS.length + p) * NV + v;
  function deId(id) {
    const v = id % NV; id = (id - v) / NV;
    const p = id % PALETAS.length; id = (id - p) / PALETAS.length;
    const e = id % EFECTOS.length; const f = (id - e) / EFECTOS.length;
    return { f, e, p, v };
  }

  /* Código corto y compartible: F9-E1-P1-V2 */
  const aCodigo = (s) => `F${s.f + 1}-E${s.e + 1}-P${s.p + 1}-V${s.v + 1}`;
  function deCodigo(txt) {
    const m = /^F(\d+)-E(\d+)-P(\d+)-V(\d+)$/i.exec(String(txt).trim());
    if (!m) return null;
    const s = { f: +m[1] - 1, e: +m[2] - 1, p: +m[3] - 1, v: +m[4] - 1 };
    if (s.f < 0 || s.f >= FUENTES.length || s.e < 0 || s.e >= EFECTOS.length ||
        s.p < 0 || s.p >= PALETAS.length || s.v < 0 || s.v >= NV) return null;
    return s;
  }

  const receta = (s) => ({ fuente: FUENTES[s.f], capas: EFECTOS[s.e].fn(PALETAS[s.p], s.v) });

  /* Presets curados (aparecen primero en la galería) */
  const PRESETS_DEF = [
    ["Oro pulido",       "Cinzel",         "Metal 3D",        "Oro",        1],
    ["Plata elegante",   "Great Vibes",    "Metal 3D",        "Plata",      2],
    ["Cromo retro",      "Lobster",        "Metal 3D",        "Cromo",      3],
    ["Neón rosa",        "Pacifico",       "Neón",            "Rosa neón",  2],
    ["Neón cian",        "Orbitron",       "Neón",            "Cian neón",  1],
    ["Fuego",            "Bungee",         "Bloque 3D",       "Fuego",      2],
    ["Hielo",            "Righteous",      "Contorno grueso", "Hielo",      1],
    ["Candy",            "Fredoka",        "Contorno grueso", "Candy",      2],
    ["Gótico bronce",    "UnifrakturCook", "Relieve piedra",  "Bronce",     2],
    ["Rosa gold",        "Dancing Script", "Degradado suave", "Rosa gold",  2],
    ["Atardecer retro",  "Lobster",        "Retro",           "Atardecer",  1],
    ["Esmeralda doble",  "Cinzel",         "Doble contorno",  "Esmeralda",  2]
  ];
  const PRESETS = new Map();
  for (const [nombre, fu, ef, pa, v] of PRESETS_DEF) {
    const f = FUENTES.findIndex((x) => x.id === fu);
    const e = EFECTOS.findIndex((x) => x.n === ef);
    const p = PALETAS.findIndex((x) => x.n === pa);
    if (f >= 0 && e >= 0 && p >= 0) PRESETS.set(aId(f, e, p, v), nombre);
  }
  const nombrePreset = (id) => PRESETS.get(id) || "";

  /* Orden de la galería: primero los presets, luego el resto mezclado
     con un generador determinista (siempre el mismo orden). */
  let semilla = 20251014;
  const azar = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
  const todos = Array.from({ length: total }, (_, i) => i).filter((i) => !PRESETS.has(i));
  for (let i = todos.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [todos[i], todos[j]] = [todos[j], todos[i]];
  }
  const ORDEN = [...PRESETS.keys(), ...todos];

  return { EFECTOS, NV, total, aId, deId, aCodigo, deCodigo, receta, nombrePreset, ORDEN };
})();
