import "./style.css";
import { header } from "./sections/header";
import { hero } from "./sections/hero";
import { why, how } from "./sections/prose";
import { projects } from "./sections/projects";
import { join } from "./sections/join";
import { initGrid } from "./grid/grid";
import { initTheme } from "./theme";

// A full-width band with a tinted background; inner content stays column-width.
const band = (inner: string, variant = "") =>
  `<div class="band ${variant}"><div class="band-inner">${inner}</div></div>`;

// A plain column-width block (transparent, sits over the grid).
const block = (inner: string) =>
  `<div class="block"><div class="band-inner">${inner}</div></div>`;

const app = document.getElementById("app");
if (app) {
  app.innerHTML = `
    ${header()}
    <main>
      <div class="block"><div class="band-inner">${hero()}</div></div>
      ${band(why(), "band-tint")}
      ${block(how())}
      ${band(projects(), "band-soft")}
      ${block(join())}
    </main>
  `;
}

const canvas = document.getElementById("grid-bg");
if (canvas instanceof HTMLCanvasElement) {
  initGrid(canvas);
}

initTheme();
