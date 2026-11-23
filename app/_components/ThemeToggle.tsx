"use client";

import { useEffect, useState } from "react";

/* Kept in sync with THEME_SCRIPT in app/layout.tsx, which applies the saved
   choice before first paint. This component only reads what that script set
   and flips it, so the server render never has to know the theme. */
const THEME_KEY = "tp-theme";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  /* null until mounted: the server cannot know the theme, so the first client
     render matches the server's neutral markup and only then shows the state. */
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the theme the head script set
    setTheme(currentTheme());
  }, []);

  const isDark = theme === "dark";
  const next: Theme = isDark ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage blocked (private mode etc.): the switch still works for this page */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={theme ? `Switch to ${next} mode` : "Toggle dark mode"}
      onClick={toggle}
      data-ready={theme ? "" : undefined}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <svg className="theme-toggle-icon theme-toggle-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <svg className="theme-toggle-icon theme-toggle-moon" viewBox="0 0 24 24">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
        </svg>
        <span className="theme-toggle-knob" />
      </span>
    </button>
  );
}
