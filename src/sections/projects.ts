import { LINKS } from "./icons";

type Project = {
  cw: string;
  name: string;
  desc: string;
  href?: string; // omit for "soon"
};

const PROJECTS: Project[] = [
  {
    cw: "&middot;&middot;&middot;&middot;",
    name: "Morse",
    desc: "browser CW decoder &mdash; pull weak code out of the noise floor, no install",
    href: LINKS.morse,
  },
  {
    cw: "&middot;&middot;&middot;",
    name: "More",
    desc: "logging, tracking, learning &mdash; earned by the apps, not announced before them",
  },
];

function projectRow(p: Project): string {
  if (p.href) {
    return `
      <a class="proj" href="${p.href}">
        <span class="proj-cw" aria-hidden="true">${p.cw}</span>
        <span class="proj-name">${p.name}</span>
        <span class="proj-desc">${p.desc}</span>
        <span class="proj-arrow" aria-hidden="true">&rarr;</span>
      </a>`;
  }
  return `
      <div class="proj soon">
        <span class="proj-cw" aria-hidden="true">${p.cw}</span>
        <span class="proj-name">${p.name}</span>
        <span class="proj-desc">${p.desc}</span>
      </div>`;
}

export function projects(): string {
  return `
    <section class="section" aria-label="Projects">
      <p class="section-label">&sect; 03 &nbsp; What we're building</p>
      <h2 class="section-title">One app live. <span class="hl">More on the bench.</span></h2>
      <nav class="projects">
        ${PROJECTS.map(projectRow).join("")}
      </nav>
    </section>
  `;
}
