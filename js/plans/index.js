export const DEFAULT_PLAN = "warszawa-2027";

export const plans = [
  { id: "warszawa-2027", name: "Półmaraton Warszawski 2027", load: () => import("./warszawa-2027.js") },
  { id: "gdansk-2026", name: "Półmaraton Gdańsk 2026", load: () => import("./gdansk-2026.js") },
];
