import { atom } from 'nanostores';

let theme;
if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
  theme = localStorage.getItem("theme") === "dark";
}

export const isDark = atom(theme);
