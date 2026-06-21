import { defineConfig } from "vite";

// Custom domain (elmr.dev) serves from root, so base is "/".
// public/ contents (CNAME, favicon.svg) are copied verbatim into dist/.
export default defineConfig({
  base: "/",
  build: {
    target: "es2022",
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
