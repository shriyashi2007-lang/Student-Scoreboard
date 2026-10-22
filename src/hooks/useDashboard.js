import { useEffect, useState } from "react";
const validPages = [
  "dashboard",
  "students",
  "analytics",
  "leaderboard",
  "settings",
];
const readPage = () => {
  const hash = location.hash.replace("#/", "");
  return validPages.includes(hash) ? hash : "dashboard";
};
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Keep this session usable when storage is unavailable. */
    }
  }, [key, value]);
  return [value, setValue];
}
export function usePage() {
  const [page, setPage] = useState(() => {
    if (!location.hash) {
      try {
        const previous = localStorage.getItem("scoreboard_page");
        if (validPages.includes(previous)) return previous;
      } catch {
        /* use home */
      }
    }
    return readPage();
  });
  useEffect(() => {
    if (!location.hash) location.hash = "/" + page;
    const change = () => {
      const next = readPage();
      setPage(next);
      try {
        localStorage.setItem("scoreboard_page", next);
      } catch {
        /* navigation remains available */
      }
    };
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, [page]);
  return [
    page,
    (next) => {
      location.hash = "/" + next;
    },
  ];
}
