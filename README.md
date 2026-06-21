# elmr.dev

The org landing page for [elmr](https://github.com/elmr-dev) — ham radio software, rebuilt for everywhere.

Vite + vanilla TypeScript, built to static HTML/CSS/JS and deployed to GitHub Pages via GitHub Actions. Light/dark **Cosmic Night** theme (follows the OS preference, with a manual toggle). Interactive graph-paper background with a faint world map behind the hero, a cursor-follow cell, and a dit-dah CW wavefront on click.

## Develop

Uses [Bun](https://bun.sh).

```bash
bun install
bun run dev      # http://localhost:5173 with HMR
```

## Build

```bash
bun run build    # type-checks (tsc), then emits the static site to dist/
bun run preview  # serve the production build locally
```

## Structure

```
public/            CNAME, favicon.svg, .nojekyll — copied verbatim into dist/
src/
  main.ts          entry: mounts sections (band/block layout), inits grid + theme
  style.css        Cosmic Night light/dark tokens + all page styles
  theme.ts         light/dark toggle, persistence, system-preference fallback
  sections/
    header.ts      sticky header: dit-dah mark + wordmark + theme toggle + pill links
    hero.ts        eyebrow tagline, headline, lede, CTA
    prose.ts       §01 Why elmr, §02 How we work
    projects.ts    §03 What we're building (data-driven)
    join.ts        §04 Get involved
    icons.ts       GitHub/Discord/sun/moon icons + external links
  grid/
    grid.ts        canvas grid + cursor cell + dit-dah CW wavefront ripple
    coastline.ts   simplified world coastline data for the hero backdrop map
.github/workflows/deploy.yml   build (Bun) + deploy to Pages
```

Add a project by appending to the `PROJECTS` array in `src/sections/projects.ts`.

## Fonts & theme

- **Archivo** — display / headlines
- **Instrument Sans** — body
- **Azeret Mono** — wordmark, labels, and all monospace (with `cv11`/`ss01` stylistic sets on the wordmark)
- **Cosmic Night** palette, primary `#6e56cf` (light) / `#8b74e8` (dark)

The theme is light or dark. On first visit it follows the OS `prefers-color-scheme`;
the header toggle (moon/sun) overrides it and the choice persists in `localStorage`.
An inline script in `index.html` applies the saved theme before paint to avoid a
flash. All colors are CSS custom properties on `:root` / `[data-theme="dark"]`,
including the canvas backdrop channels (`--grid-*`), which `grid.ts` reads at
runtime and re-reads on the `themechange` event so the grid, map, and ripple
track the active theme.

## Deploy

Pages **Source** is set to **GitHub Actions**. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds with Bun and publishes `dist/`. You
can also run it manually from the **Actions** tab (`workflow_dispatch`).

- Custom domain `elmr.dev` is preserved via `public/CNAME` (Vite copies it to `dist/CNAME`).
- `public/.nojekyll` stops Pages from mangling Vite's `_`-prefixed asset paths.
- `.dev` is HSTS-preloaded — keep a valid cert and **Enforce HTTPS** checked. Confirm
  the deploy job goes green before assuming a release is live.
