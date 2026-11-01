export const DEFAULT_PLAN = "maraton-2027";

export const plans = [
  { id: "maraton-2027", name: "Maraton Juranda 2027", load: () => import("./maraton-2027.js") },
  { id: "gdansk-2026", name: "Półmaraton Gdańsk 2026", load: () => import("./gdansk-2026.js") },
];
