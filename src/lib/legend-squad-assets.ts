export const legendSquadPalette = {
  dark: {
    background: "#0b0f14",
    panel: "#101826",
    panelAlt: "#0e1624",
    text: "#e6e7ea",
    muted: "#9aa3ad",
    accent: "#ff5a00",
    accentBright: "#ff7a1a",
  },
  light: {
    background: "#f8fafc",
    panel: "#ffffff",
    panelAlt: "#f1f5f9",
    text: "#0f172a",
    muted: "#475569",
    accent: "#e04f00",
    accentStrong: "#c94800",
  },
} as const;

export const legendSquadAssets = {
  logo: "/media/legend-squad/brand/lgnd-squad-logo.png",
  fire001Banner:
    "/media/legend-squad/events/fire-001-ticketandgo-banner.webp",
  fire002Banner:
    "/media/legend-squad/events/fire-002-ticketandgo-banner.webp",
  fire002Editorial:
    "/media/legend-squad/events/fire-002-instagram-post.jpg",
  fire004ReelCover:
    "/media/legend-squad/events/fire-004-reel-cover.jpg",
  readyToServe:
    "/media/legend-squad/operations/prontos-para-servir-reel-cover.jpg",
  reconstruction:
    "/media/legend-squad/operations/reconstrucao-minas-do-leao-reel-cover.jpg",
  fieldSupport:
    "/media/legend-squad/operations/apoio-minas-do-leao.webp",
  aboutSquad:
    "/media/legend-squad/social/o-que-e-lgnd-squad.jpg",
  globalAlert: "/media/legend-squad/social/alerta-global.jpg",
  fireHighlight:
    "/media/legend-squad/social/instagram-highlight-fire.jpg",
  manifest: "/media/legend-squad/manifest.json",
} as const;

export type LegendSquadAssetName = keyof typeof legendSquadAssets;

