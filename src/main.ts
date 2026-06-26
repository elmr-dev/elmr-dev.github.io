import "./style.css";
import { renderApp } from "./app";
import { initGrid } from "./grid/grid";
import { initTheme } from "./theme";

const app = document.getElementById("app");
// In production the markup is prerendered into #app at build time; only render
// on the client when it's empty (the dev server, or if prerender is skipped).
if (app && app.childElementCount === 0) {
  app.innerHTML = renderApp();
}

const canvas = document.getElementById("grid-bg");
if (canvas instanceof HTMLCanvasElement) {
  initGrid(canvas);
}

initTheme();
