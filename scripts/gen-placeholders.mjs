import { mkdirSync, writeFileSync } from "node:fs";

// Local SVG placeholders so the app has zero dependency on an external
// image host (some sandboxed/offline environments can't reach arbitrary
// third-party domains). Swap these for real product photography per
// vendor/product later — just point imageUrl at a real URL or upload path.
const items = [
  { slug: "velvet-touch-massager", text: "Velvet Touch", bg: "#2a2a2a" },
  { slug: "midnight-bullet-vibe", text: "Bullet Vibe", bg: "#2a2a2a" },
  { slug: "lace-bodysuit", text: "Lace Bodysuit", bg: "#2a2a2a" },
  { slug: "satin-blindfold", text: "Blindfold", bg: "#2a2a2a" },
  { slug: "duo-pleasure-set", text: "Duo Set", bg: "#2a2a2a" },
  { slug: "leather-cuffs", text: "Leather Cuffs", bg: "#2a2a2a" },
  { slug: "pulse-100", text: "Pulse Wand", bg: "#1a1a1a" },
  { slug: "pulse-210", text: "Aria Ring", bg: "#1a1a1a" },
  { slug: "pulse-330", text: "Silk Set", bg: "#1a1a1a" },
  { slug: "default", text: "No Image", bg: "#3a3a3a" },
];

function svg(text, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="${bg}" />
  <text x="400" y="400" fill="#ffffff" font-family="system-ui, sans-serif" font-size="42" font-weight="600" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

mkdirSync(new URL("../public/placeholders", import.meta.url), { recursive: true });

for (const item of items) {
  const path = new URL(`../public/placeholders/${item.slug}.svg`, import.meta.url);
  writeFileSync(path, svg(item.text, item.bg));
}

console.log(`Wrote ${items.length} placeholder SVGs to public/placeholders/`);
