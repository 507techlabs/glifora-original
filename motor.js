"use strict";
/* ============================================================
   MOTOR DE RENDER POR CAPAS (Canvas 2D)
   Una receta = lista de capas. Cada tipo de capa es una función pequeña.
   El mismo motor dibuja la vista previa, las miniaturas y el PNG final,
   así lo que ves es lo que descargas.

   Tipos de capa: sombra, glow, extrusion, contorno, relleno,
                  brillo, bisel, ruido
   Las capas "interiores" (brillo, bisel, ruido) se aplican solo sobre
   la forma de las letras usando un lienzo temporal y 'source-atop'.
   ============================================================ */

const Motor = (() => {
  const MAX_DIM = 8192;          // lado máximo del canvas
  const MAX_PIXELS = 16000000;   // iOS Safari limita a ~16,7 millones de píxeles
  let ruidoCanvas = null;

  const crear = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const fuenteCSS = (f, tam) => `${f.peso} ${tam}px "${f.id}", sans-serif`;

  /* Espera a que la fuente (y los caracteres usados) estén cargados */
  async function cargarFuente(f, texto) {
    try { await document.fonts.load(`${f.peso} 64px "${f.id}"`, texto || "Aa"); }
    catch (e) { /* si falla, se usa la fuente de respaldo */ }
  }

  function patronRuido() {
    if (!ruidoCanvas) {
      ruidoCanvas = crear(128, 128);
      const x = ruidoCanvas.getContext("2d");
      const img = x.createImageData(128, 128);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() < 0.5 ? 0 : 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = (Math.random() * 255) | 0;
      }
      x.putImageData(img, 0, 0);
    }
    return ruidoCanvas;
  }

  /* Cuánto se extienden los efectos fuera de la letra (en unidades de tamaño 100) */
  function alcance(capas) {
    let s = 0, g = 0, e = 0, c = 0;
    for (const L of capas) {
      if (L.t === "sombra") s = Math.max(s, L.blur * 1.3 + Math.max(Math.abs(L.dx), Math.abs(L.dy)));
      else if (L.t === "glow") g = Math.max(g, Math.max(...L.radios) * 1.3);
      else if (L.t === "extrusion") e = Math.max(e, L.prof);
      else if (L.t === "contorno") c = Math.max(c, L.ancho);
    }
    return Math.max(s, g, e) + c + 2;
  }

  /**
   * render(texto, receta, { tam, escala }) -> { canvas, escala, ancho, alto }
   * - tam: tamaño de letra en px CSS
   * - escala: multiplicador de resolución (2 = doble de nítido)
   * El canvas queda con fondo transparente (nunca se pinta un fondo).
   */
  function render(texto, receta, opc) {
    const f = receta.fuente, capas = receta.capas;
    const tam = opc.tam * (f.k || 1);
    const u = tam / 100;
    const lineas = String(texto || "").split("\n").slice(0, 6).map((l) => (l.length ? l : " "));
    const fuente = fuenteCSS(f, tam);

    /* 1) Medir el texto */
    const m = crear(1, 1).getContext("2d");
    m.font = fuente; m.textAlign = "center";
    let ascR = 0, descR = 0, mitad = 0;
    for (const l of lineas) {
      const t = m.measureText(l);
      ascR = Math.max(ascR, t.actualBoundingBoxAscent || 0);
      descR = Math.max(descR, t.actualBoundingBoxDescent || 0);
      mitad = Math.max(mitad, t.actualBoundingBoxLeft || 0, t.actualBoundingBoxRight || 0, t.width / 2);
    }
    const asc = Math.max(ascR, tam * 0.5), desc = Math.max(descR, tam * 0.12);
    const inter = (asc + desc) * 1.1;
    const alto = inter * (lineas.length - 1) + asc + desc;
    const pad = Math.ceil(alcance(capas) * u + 4);
    const W = Math.ceil(mitad * 2 + pad * 2), H = Math.ceil(alto + pad * 2);

    /* 2) Limitar la resolución a lo que soporta el dispositivo */
    let esc = opc.escala || 1;
    if (W * esc > MAX_DIM) esc = MAX_DIM / W;
    if (H * esc > MAX_DIM) esc = MAX_DIM / H;
    if (W * H * esc * esc > MAX_PIXELS) esc = Math.sqrt(MAX_PIXELS / (W * H));

    const canvas = crear(Math.max(1, Math.round(W * esc)), Math.max(1, Math.round(H * esc)));
    const ctx = canvas.getContext("2d");
    ctx.scale(esc, esc);

    const cx = W / 2;
    const gTop = pad + asc - (ascR || asc);
    const gBot = pad + asc + inter * (lineas.length - 1) + (descR || desc);

    const dibujar = (c, modo, dx, dy) => {
      c.font = fuente; c.textAlign = "center"; c.textBaseline = "alphabetic";
      lineas.forEach((l, i) => {
        const y = pad + asc + i * inter + dy;
        if (modo === "fill") c.fillText(l, cx + dx, y); else c.strokeText(l, cx + dx, y);
      });
    };

    /* Lienzo temporal para capas interiores */
    let tmp = null, tctx = null;
    const vaciar = () => {
      if (!tmp) return;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(tmp, 0, 0); ctx.restore();
      tmp = null; tctx = null;
    };

    /* Dibuja SOLO la sombra (la letra se pinta fuera del lienzo y su sombra
       se desplaza de vuelta). Así no queda un borde oscuro bajo el relleno. */
    const D = W * 3;
    const soloSombra = (color, blur, dx, dy) => {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = blur * esc;
      ctx.shadowOffsetX = (D + dx) * esc;
      ctx.shadowOffsetY = dy * esc;
      ctx.fillStyle = "#000";
      dibujar(ctx, "fill", -D, 0);
      ctx.restore();
    };

    const INTERIOR = { brillo: 1, bisel: 1, ruido: 1 };

    /* 3) Dibujar capa por capa */
    for (const L of capas) {
      if (!INTERIOR[L.t] && L.t !== "relleno") vaciar();

      switch (L.t) {
        case "sombra":
          soloSombra(L.color, L.blur * u, L.dx * u, L.dy * u);
          break;

        case "glow":
          L.radios.forEach((r) => soloSombra(L.color, r * u, 0, 0));
          soloSombra(L.color, L.radios[0] * u, 0, 0); // refuerzo del núcleo
          break;

        case "extrusion": {
          const a = (L.angulo * Math.PI) / 180;
          const prof = L.prof * u, paso = Math.min(1, 1 / esc);
          ctx.save();
          ctx.fillStyle = L.color;
          for (let i = prof; i >= paso; i -= paso) dibujar(ctx, "fill", Math.cos(a) * i, Math.sin(a) * i);
          ctx.restore();
          break;
        }

        case "contorno":
          // se dibuja detrás del relleno: solo se ve la mitad exterior (ancho visible = L.ancho)
          ctx.save();
          ctx.lineJoin = "round"; ctx.miterLimit = 2;
          ctx.strokeStyle = L.color; ctx.lineWidth = L.ancho * u * 2;
          dibujar(ctx, "stroke", 0, 0);
          ctx.restore();
          break;

        case "relleno": {
          vaciar();
          tmp = crear(canvas.width, canvas.height);
          tctx = tmp.getContext("2d");
          tctx.scale(esc, esc);
          if (L.grad) {
            const g = tctx.createLinearGradient(0, gTop, 0, gBot);
            L.grad.forEach(([pos, col]) => g.addColorStop(pos, col));
            tctx.fillStyle = g;
          } else {
            tctx.fillStyle = L.color;
          }
          dibujar(tctx, "fill", 0, 0);
          break;
        }

        case "brillo": {
          if (!tctx) break;
          tctx.save();
          tctx.globalCompositeOperation = "source-atop";
          const g = tctx.createLinearGradient(0, gTop, 0, gBot);
          g.addColorStop(0, `rgba(255,255,255,${L.int})`);
          g.addColorStop(0.5, "rgba(255,255,255,0)");
          g.addColorStop(1, `rgba(0,0,0,${L.int * 0.3})`);
          tctx.fillStyle = g;
          tctx.fillRect(0, 0, W, H);
          tctx.restore();
          break;
        }

        case "bisel": {
          if (!tctx) break;
          const d = L.d * u;
          tctx.save();
          tctx.globalCompositeOperation = "source-atop";
          tctx.lineJoin = "round"; tctx.lineWidth = d * 1.5;
          tctx.strokeStyle = "rgba(255,255,255,0.85)";       // luz arriba-izquierda
          dibujar(tctx, "stroke", d, d);
          tctx.strokeStyle = "rgba(0,0,0,0.45)";             // sombra abajo-derecha
          dibujar(tctx, "stroke", -d, -d);
          tctx.restore();
          break;
        }

        case "ruido": {
          if (!tctx) break;
          tctx.save();
          tctx.globalCompositeOperation = "source-atop";
          tctx.globalAlpha = L.int;
          tctx.fillStyle = tctx.createPattern(patronRuido(), "repeat");
          tctx.fillRect(0, 0, W, H);
          tctx.restore();
          break;
        }
      }
    }
    vaciar();

    return { canvas, escala: esc, ancho: W, alto: H };
  }

  /* Recorta el espacio transparente sobrante (para exportar PNG ajustado) */
  function recortar(canvas, margen) {
    try {
      const w = canvas.width, h = canvas.height;
      const d = canvas.getContext("2d").getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let y = 0; y < h; y++) {
        const fila = y * w * 4;
        for (let x = 0; x < w; x++) {
          if (d[fila + x * 4 + 3] > 3) {
            if (x < x0) x0 = x; if (x > x1) x1 = x;
            if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < 0) return canvas;
      x0 = Math.max(0, x0 - margen); y0 = Math.max(0, y0 - margen);
      x1 = Math.min(w - 1, x1 + margen); y1 = Math.min(h - 1, y1 + margen);
      const out = crear(x1 - x0 + 1, y1 - y0 + 1);
      out.getContext("2d").drawImage(canvas, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
      return out;
    } catch (e) {
      return canvas;
    }
  }

  return { render, recortar, cargarFuente };
})();
