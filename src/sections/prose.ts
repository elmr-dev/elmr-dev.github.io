// Mid-page prose sections, crew-style: numbered eyebrow + big headline +
// supporting copy. Some render inside a full-width tinted band (see main.ts /
// style.css .band) to create rhythm between sections.

type Feature = { label: string; desc: string };

const WHY_FEATURES: Feature[] = [
  { label: "cross-platform", desc: "runs where you do — not just on one OS" },
  { label: "in the open", desc: "source, models, and method all public" },
  {
    label: "built to last",
    desc: "modern foundations, not another abandoned demo",
  },
];

export function why(): string {
  return `
    <section class="section">
      <p class="section-label">&sect; 01 &nbsp; Why <span class="name">elmr</span></p>
      <h2 class="section-title">The hobby runs on great work that <span class="hl">never left the workbench</span>.</h2>
      <div class="section-body">
        <p>Some of the best software in amateur radio was written years ago by one person, for one operating system, and never moved again. The ideas are sound. The code is stranded &mdash; locked to old platforms, hard to install, harder to contribute to.</p>
        <p><span class="name">elmr</span> picks up that thread. We take the everyday tools &mdash; decoding, logging, tracking, learning &mdash; and rebuild them to run anywhere, install in seconds, and improve in the open. No gatekeeping, no dead links, no "works on my rig."</p>
      </div>
      <div class="feature-row">
        ${WHY_FEATURES.map(
          (f) => `
        <div class="feature">
          <span class="feature-label">${f.label}</span>
          <span class="feature-desc">${f.desc}</span>
        </div>`,
        ).join("")}
      </div>
    </section>
  `;
}

export function how(): string {
  return `
    <section class="section">
      <p class="section-label">&sect; 02 &nbsp; How we work</p>
      <h2 class="section-title">A small team, building <span class="hl">out loud</span>.</h2>
      <div class="section-body">
        <p>Everything <span class="name">elmr</span> makes ships in public &mdash; working code, the models behind it, and the reasoning that got us there. We build AI-assisted and document the how, so the next ham who wants to write software has a map instead of a blank page.</p>
        <p>The apps come first and earn their keep. The packages underneath them are pulled out, named, and published so anyone can build on the same foundation. That's the real product: not just tools that work, but a shorter path for the people who want to make their own.</p>
        <p class="signoff"><span class="em">An Elmer brings people along.</span> We're building the floor others stand on.</p>
      </div>
    </section>
  `;
}
