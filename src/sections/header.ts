import { githubIcon, discordIcon, LINKS } from "./icons";

// crew-style sticky header: small dit-dah mark + Azeret Mono wordmark on the
// left, text/pill links on the right.
export function header(): string {
  return `
    <header class="topbar">
      <a class="brand" href="/" aria-label="elmr.dev home">
        <span class="brand-mark" aria-hidden="true">
          <span class="bm-dit"></span><span class="bm-dah"></span>
        </span>
        <span class="brand-word">elmr<span class="tld">.dev</span></span>
      </a>
      <nav class="topbar-links" aria-label="Primary">
        <a class="pill" href="${LINKS.github}">
          ${githubIcon(16)}
          <span class="pill-text">github.com/elmr-dev</span>
        </a>
        <a class="pill pill-solid" href="${LINKS.discord}" aria-label="Join the Elmr Discord">
          ${discordIcon(16)}
          <span class="pill-text">Discord</span>
        </a>
      </nav>
    </header>
  `;
}
