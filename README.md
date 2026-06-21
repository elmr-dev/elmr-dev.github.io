# elmr.dev

The org landing page for [Elmr](https://github.com/elmr-dev) — Ham radio software, rebuilt for everywhere.

Vite + vanilla TypeScript, built to static HTML/CSS/JS and deployed to GitHub Pages. Light theme (Cosmic Night). Interactive graph-paper background with a cursor-follow cell and a CW-wavefront click ripple.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173 with HMR
```

## Build

```bash
npm run build    # type-checks, then emits static site to dist/
npm run preview  # serve the production build locally
```

## Structure

```
public/            CNAME, favicon.svg, .nojekyll — copied verbatim into dist/
src/
  main.ts          entry: mounts sections, inits the grid
  style.css        Cosmic Night light tokens + all page styles
  sections/        hero, projects, join, icons (data-driven, easy to grow)
  grid/grid.ts     canvas grid + cursor cell + CW ripple (idea 3)
.github/workflows/deploy.yml   build + deploy to Pages
```

Add a project by appending to the `PROJECTS` array in `src/sections/projects.ts`.

## Deploy / cutover (one-time)

This repo previously served a single `index.html` from the branch root. To switch
to the built site **without breaking the live elmr.dev deploy**:

1. Push this project to a branch first (not `main`) and let the Action build, or run
   `npm run build` locally and confirm `dist/` looks right (`npm run preview`).
2. In GitHub repo **Settings → Pages → Build and deployment → Source**, change from
   "Deploy from a branch" to **GitHub Actions**.
3. Merge to `main`. The workflow builds and publishes `dist/`.
4. The custom domain (`elmr.dev`) is preserved via `public/CNAME`. Confirm
   **Enforce HTTPS** stays checked once the deploy completes.

`.dev` is HSTS-preloaded — don't leave the site without a valid cert. Verify the
Action's deploy succeeds before assuming the cutover is clean.
