import { header } from "./sections/header";
import { hero } from "./sections/hero";
import { why, how } from "./sections/prose";
import { projects } from "./sections/projects";
import { join } from "./sections/join";

// A full-width band with a tinted background; inner content stays column-width.
const band = (inner: string, variant = "") =>
  `<div class="band ${variant}"><div class="band-inner">${inner}</div></div>`;

// A plain column-width block (transparent, sits over the grid).
const block = (inner: string) =>
  `<div class="block"><div class="band-inner">${inner}</div></div>`;

// The full page markup (everything inside #app). Pure string output with no DOM
// access, so it runs both on the client at runtime and at build time to
// prerender static content into index.html.
export function renderApp(): string {
  return `
    ${header()}
    <main>
      ${block(hero())}
      ${band(why(), "band-tint")}
      ${block(how())}
      ${band(projects(), "band-soft")}
      ${block(join())}
    </main>
  `;
}
