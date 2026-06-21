// Interactive background grid for elmr.dev
// - faint graph-paper grid (light theme)
// - a highlight cell that snaps to follow the cursor
// - a click sends an expanding CW "wavefront" ripple from the cell
// - a faint world coastline map sits behind the hero, under the grid
//
// Honors prefers-reduced-motion: draws the static grid only, no cursor cell, no ripple.

import { COASTLINE } from "./coastline";

const CELL = 12; // px grid cell size — fine graph paper, half-density (crew-style)

type RGB = [number, number, number];

// Canvas colors are read from CSS custom properties so the backdrop tracks the
// active theme (light/dark). Re-read on theme change via readColors().
interface CanvasColors {
  line: string;
  cellFill: string;
  cellStroke: string;
  ripple: RGB;
  map: RGB;
  mapAlpha: number;
}

function rgbVar(styles: CSSStyleDeclaration, name: string, fallback: RGB): RGB {
  const v = styles.getPropertyValue(name).trim(); // e.g. "110, 86, 207"
  if (!v) return fallback;
  const parts = v.split(",").map((n) => parseFloat(n));
  if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
    return [parts[0], parts[1], parts[2]];
  }
  return fallback;
}

function numVar(styles: CSSStyleDeclaration, name: string, fallback: number): number {
  const v = parseFloat(styles.getPropertyValue(name));
  return isNaN(v) ? fallback : v;
}

function readColors(): CanvasColors {
  const s = getComputedStyle(document.documentElement);
  const line = rgbVar(s, "--grid-line", [110, 86, 207]);
  const lineA = numVar(s, "--grid-line-alpha", 0.05);
  const cell = rgbVar(s, "--grid-cell", [110, 86, 207]);
  return {
    line: `rgba(${line[0]}, ${line[1]}, ${line[2]}, ${lineA})`,
    cellFill: `rgba(${cell[0]}, ${cell[1]}, ${cell[2]}, 0.10)`,
    cellStroke: `rgba(${cell[0]}, ${cell[1]}, ${cell[2]}, 0.35)`,
    ripple: rgbVar(s, "--grid-ripple", [110, 86, 207]),
    map: rgbVar(s, "--grid-map", [120, 120, 140]),
    mapAlpha: numVar(s, "--grid-map-alpha", 0.26),
  };
}

interface Ripple {
  cx: number;
  cy: number;
  start: number; // performance.now() when this pulse was keyed
  thick: number; // base stroke width (dit thin, dah thick)
}

export function initGrid(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;

  // cursor cell (in grid coordinates); -1 means "no cursor"
  let cellX = -1;
  let cellY = -1;
  const ripples: Ripple[] = [];
  let colors = readColors(); // re-read on theme change

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGridLines(): void {
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = colors.line;
    ctx!.beginPath();
    for (let x = 0; x <= w; x += CELL) {
      ctx!.moveTo(x + 0.5, 0);
      ctx!.lineTo(x + 0.5, h);
    }
    for (let y = 0; y <= h; y += CELL) {
      ctx!.moveTo(0, y + 0.5);
      ctx!.lineTo(w, y + 0.5);
    }
    ctx!.stroke();
  }

  // Faint world coastline behind the hero. Equirectangular projection.
  // On wide screens it spans a bit past the viewport; on narrow (mobile)
  // screens it keeps real proportions by enforcing a minimum width and
  // letting the map bleed off both edges rather than crushing the globe.
  function drawMap(): void {
    const [r, g, b] = colors.map;
    const baseAlpha = colors.mapAlpha;
    // Keep continents readable: never let the world get narrower than ~900px.
    // On desktop this is w * 1.25; on mobile the max() floor kicks in so the
    // map bleeds off-edge (intentional) instead of compressing horizontally.
    const mapW = Math.max(w * 1.25, 900);
    const mapH = mapW / 2; // equirectangular is 2:1
    const offsetX = (w - mapW) / 2; // centered (negative on mobile = bleeds both sides)
    // Vertically place the map across the hero region.
    const offsetY = Math.min(h * 0.16, 120);
    // Fade band: full strength up top, gone by the bottom of the projection.
    const fadeStart = mapH * 0.5;
    const fadeEnd = mapH * 0.92;

    const project = (lon: number, lat: number): [number, number] => [
      offsetX + ((lon + 180) / 360) * mapW,
      offsetY + ((90 - lat) / 180) * mapH,
    ];

    ctx!.lineWidth = 1;
    ctx!.lineJoin = "round";
    for (const seg of COASTLINE) {
      // per-segment vertical fade based on its midpoint y
      const midY = offsetY + ((90 - seg[Math.floor(seg.length / 2)][1]) / 180) * mapH;
      let a = baseAlpha;
      if (midY > fadeStart) {
        a *= Math.max(0, 1 - (midY - fadeStart) / (fadeEnd - fadeStart));
      }
      if (a < 0.01) continue;
      ctx!.strokeStyle = `rgba(${r},${g},${b},${a})`;
      ctx!.beginPath();
      let started = false;
      for (const [lon, lat] of seg) {
        const [px, py] = project(lon, lat);
        if (!started) {
          ctx!.moveTo(px, py);
          started = true;
        } else {
          ctx!.lineTo(px, py);
        }
      }
      ctx!.stroke();
    }
  }

  // Static backdrop = map first (underneath), then grid lines on top.
  function drawBackground(): void {
    drawMap();
    drawGridLines();
  }

  function drawCursorCell(): void {
    if (cellX < 0 || cellY < 0) return;
    const px = cellX * CELL;
    const py = cellY * CELL;
    ctx!.fillStyle = colors.cellFill;
    ctx!.fillRect(px, py, CELL, CELL);
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = colors.cellStroke;
    ctx!.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1);
  }

  // Draw one soft wavefront: a band of concentric strokes whose opacity
  // falls off toward the inner and outer edge, so it reads as a feathered
  // RF ring rather than a hard hoop.
  function softRing(
    cx: number,
    cy: number,
    radius: number,
    band: number,
    peakAlpha: number,
    rgb: RGB,
  ): void {
    const [r, g, b] = rgb;
    const STEPS = 12; // concentric passes across the band thickness (more = smoother wide bands)
    for (let s = 0; s < STEPS; s++) {
      const f = s / (STEPS - 1); // 0..1 across the band
      const offset = (f - 0.5) * band; // -band/2 .. +band/2
      const rr = radius + offset;
      if (rr <= 0) continue;
      // bell falloff: bright in the middle of the band, soft at both edges
      const edge = 1 - Math.abs(f - 0.5) * 2; // 1 center -> 0 edges
      const a = peakAlpha * edge * edge;
      if (a < 0.004) continue;
      ctx!.beginPath();
      ctx!.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx!.lineWidth = band / STEPS + 0.6;
      ctx!.strokeStyle = `rgba(${r},${g},${b},${a})`;
      ctx!.stroke();
    }
  }

  function drawRipples(now: number): void {
    const DURATION = 4200; // ms — slow, unhurried glide outward
    const maxR = Math.hypot(w, h);
    const rgb = colors.ripple;

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rip = ripples[i];
      const t = (now - rip.start) / DURATION;
      if (t < 0) continue; // not keyed yet (dah waiting its turn)
      if (t >= 1) {
        ripples.splice(i, 1);
        continue;
      }
      // gentle ease-out: eases in softly, glides to the edge without snapping
      const eased = 1 - Math.pow(1 - t, 2.4);
      const radius = eased * maxR;
      const peak = Math.pow(1 - t, 1.5) * 0.16;
      if (peak < 0.005) continue;
      // band grows substantially as it travels — a fat, exaggerated wavefront
      const band = rip.thick * (1 + t * 2.4);
      softRing(rip.cx, rip.cy, radius, band, peak, rgb);
    }
  }

  let rafId = 0;
  function frame(now: number): void {
    ctx!.clearRect(0, 0, w, h);
    drawBackground();
    if (!reduceMotion) {
      drawCursorCell();
      drawRipples(now);
    }
    // Keep animating only while ripples are live; otherwise idle-draw on demand.
    if (ripples.length > 0) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = 0;
    }
  }

  function requestDraw(): void {
    if (rafId === 0) rafId = requestAnimationFrame(frame);
  }

  // Static first paint
  resize();
  ctx.clearRect(0, 0, w, h);
  drawBackground();

  // Re-read palette and repaint when the theme switches (light <-> dark).
  window.addEventListener("themechange", () => {
    colors = readColors();
    if (rafId === 0) {
      ctx.clearRect(0, 0, w, h);
      drawBackground();
      drawCursorCell();
    }
  });

  if (reduceMotion) return; // no interactivity under reduced motion

  window.addEventListener("resize", () => {
    resize();
    ctx.clearRect(0, 0, w, h);
    drawBackground();
    drawCursorCell();
  });

  window.addEventListener(
    "pointermove",
    (e: PointerEvent) => {
      const nx = Math.floor(e.clientX / CELL);
      const ny = Math.floor(e.clientY / CELL);
      if (nx !== cellX || ny !== cellY) {
        cellX = nx;
        cellY = ny;
        // redraw a single idle frame to move the cell
        if (rafId === 0) {
          ctx.clearRect(0, 0, w, h);
          drawBackground();
          drawCursorCell();
          drawRipples(performance.now());
        }
      }
    },
    { passive: true },
  );

  window.addEventListener("pointerleave", () => {
    cellX = -1;
    cellY = -1;
    if (rafId === 0) {
      ctx.clearRect(0, 0, w, h);
      drawBackground();
    }
  });

  window.addEventListener("pointerdown", (e: PointerEvent) => {
    // A click keys the letter A in CW: dit (thin) then dah (thick).
    const cx = Math.floor(e.clientX / CELL) * CELL + CELL / 2;
    const cy = Math.floor(e.clientY / CELL) * CELL + CELL / 2;
    const now = performance.now();
    const DIT = 260; // ms per element — unhurried sending speed
    // dit fires now; dah fires after the dit + an intra-character gap (~2 dits)
    ripples.push({ cx, cy, start: now, thick: 24 }); // dit
    ripples.push({ cx, cy, start: now + DIT * 2, thick: 52 }); // dah (thicker)
    requestDraw();
  });
}
