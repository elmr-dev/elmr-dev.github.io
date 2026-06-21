import { discordIcon, LINKS } from "./icons";

export function join(): string {
  return `
    <section class="section join-section">
      <p class="section-label">&sect; 04 &nbsp; Get involved</p>
      <h2 class="section-title">Tired of the same software too?</h2>
      <div class="section-body">
        <p>If you write code, train models, design interfaces, or just have strong opinions about how this should work &mdash; there's a place for you here. We're a small crew and the door to the shack is open.</p>
        <p><strong>Come on in,</strong> we think you&rsquo;re gonna like it here.</p>
      </div>
      <a class="join-link" href="${LINKS.discord}">
        ${discordIcon(18)}
        Start in the Discord
      </a>
    </section>
  `;
}
