// Theme switching: persists the user's choice and falls back to the OS
// preference. The initial data-theme is set by an inline script in index.html
// (before paint) to avoid a flash; this module wires up the toggle button and
// keeps the canvas backdrop in sync.

const STORAGE_KEY = "elmr-theme";

type Theme = "light" | "dark";

function current(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function apply(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage unavailable (private mode, etc.) — theme still applies for the session
  }
  // let the canvas redraw with the new palette
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function initTheme(): void {
  const btn = document.querySelector<HTMLButtonElement>(".theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    apply(current() === "dark" ? "light" : "dark");
  });
}
