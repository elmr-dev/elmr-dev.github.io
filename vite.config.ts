import { defineConfig } from "vite";
import { renderApp } from "./src/app";

// Custom domain (elmr.dev) serves from root, so base is "/".
// public/ contents (CNAME, favicon.svg) are copied verbatim into dist/.
export default defineConfig({
  base: "/",
  plugins: [
    // Prerender the page markup into #app at build time so crawlers and
    // link-preview scrapers get real content without executing JS. The runtime
    // (main.ts) skips client rendering when #app is already populated.
    {
      name: "elmr-prerender",
      apply: "build",
      transformIndexHtml(html) {
        return html.replace(
          '<div id="app"></div>',
          `<div id="app">${renderApp()}</div>`,
        );
      },
    },
  ],
  build: {
    target: "es2022",
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
