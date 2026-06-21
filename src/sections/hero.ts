import { LINKS } from "./icons";

// Hero: short and bold (crew-style) — eyebrow, big statement, lede, CTA.
// The prose lives in the numbered sections below.
export function hero(): string {
  return `
    <section class="hero">
      <p class="eyebrow">&mdash; modern ham radio software, in the open</p>

      <h1 class="hero-title">Ham radio software <span class="hl">worth using</span>.</h1>

      <p class="lede">Modern, cross-platform, built to last &mdash; starting with the CW decoder you can run right now.</p>

      <div class="cta-row">
        <a class="cta" href="${LINKS.morse}">Try the decoder <span aria-hidden="true">&rarr;</span></a>
        <span class="cta-note">no install &middot; runs in your browser</span>
      </div>
    </section>
  `;
}
