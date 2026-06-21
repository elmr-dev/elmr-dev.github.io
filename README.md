# elmr.dev

The org landing page for [elmr](https://github.com/elmr-dev) — ham radio software, rebuilt for everywhere.

Vite + vanilla TypeScript, built to static HTML/CSS/JS and deployed to GitHub Pages via GitHub Actions. Light theme (Cosmic Night). Interactive graph-paper background with a cursor-follow cell and a dit-dah CW wavefront on click.

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
  main.ts          entry: mounts sections (band/block layout), inits the grid
  style.css        Cosmic Night light tokens + all page styles
  sections/
    header.ts      sticky header: dit-dah mark + Azeret wordmark + pill links
    hero.ts        eyebrow tagline, headline, lede, CTA
    prose.ts       §01 Why elmr, §02 How we work
    projects.ts    §03 What we're building (data-driven)
    join.ts        §04 Get involved
    icons.ts       GitHub/Discord icons + external links
  grid/grid.ts     canvas grid + cursor cell + dit-dah CW wavefront ripple
.github/workflows/deploy.yml   build (Bun) + deploy to Pages
```

Add a project by appending to the `PROJECTS` array in `src/sections/projects.ts`.

## Fonts & theme

- **Archivo** — display / headlines
- **Instrument Sans** — body
- **Azeret Mono** — wordmark, labels, and all monospace (with `cv11`/`ss01` stylistic sets on the wordmark)
- Light-only **Cosmic Night** palette; primary `#6e56cf`

## Deploy

Pages **Source** is set to **GitHub Actions**. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds with Bun and publishes `dist/`. You
can also run it manually from the **Actions** tab (`workflow_dispatch`).

- Custom domain `elmr.dev` is preserved via `public/CNAME` (Vite copies it to `dist/CNAME`).
- `public/.nojekyll` stops Pages from mangling Vite's `_`-prefixed asset paths.
- `.dev` is HSTS-preloaded — keep a valid cert and **Enforce HTTPS** checked. Confirm
  the deploy job goes green before assuming a release is live.
