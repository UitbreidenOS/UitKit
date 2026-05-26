/**
 * OG image generation — pure SVG, no external dependencies.
 * Returns a 1200×630 SVG string for a given page.
 */

export interface OgImageOptions {
  title: string;
  category?: string;
  collection?: string;
}

/** Escape XML special characters so the SVG is always well-formed. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Wraps text at a given char-width, returning an array of lines.
 * Keeps whole words wherever possible.
 */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function buildOgSvg({ title, category, collection }: OgImageOptions): string {
  const W = 1200;
  const H = 630;

  // Pill label: "SKILL · SMALL BUSINESS" or just "CLAUDIENT"
  const collectionLabel = collection
    ? collection.toUpperCase().replace(/-/g, " ")
    : "CLAUDIENT";
  const categoryLabel = category
    ? category.toUpperCase().replace(/-/g, " ")
    : null;
  const pillText = categoryLabel
    ? `${collectionLabel} · ${categoryLabel}`
    : collectionLabel;

  // Title wrapping — ~22 chars per line at 64px to stay within safe area
  const lines = wrapText(title, 22);
  const lineHeight = 78;
  const titleStartY = 290;

  // Build SVG rows for title lines
  const titleRows = lines
    .slice(0, 3) // max 3 lines
    .map((line, i) => {
      const y = titleStartY + i * lineHeight;
      return `<text x="80" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="#1f1f1f" letter-spacing="-1">${escapeXml(line)}</text>`;
    })
    .join("\n    ");

  // "C" logo in the bottom-right corner
  const logoSvg = `
    <g transform="translate(1080, 510)">
      <rect width="72" height="72" rx="16" fill="#1f1f1f" />
      <text x="36" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="42" font-weight="800" fill="#fafafa" text-anchor="middle" letter-spacing="-1">C</text>
    </g>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- background -->
  <rect width="${W}" height="${H}" fill="#fafafa" />

  <!-- subtle top stripe -->
  <rect width="${W}" height="6" fill="#ea580c" />

  <!-- pill label -->
  <rect x="80" y="80" width="${pillText.length * 9 + 32}" height="40" rx="20" fill="#fff7ed" />
  <text x="96" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#ea580c" letter-spacing="1.5">${escapeXml(pillText)}</text>

  <!-- title -->
  ${titleRows}

  <!-- bottom domain label -->
  <text x="80" y="585" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="22" font-weight="400" fill="#9ca3af" letter-spacing="0.5">claudient.tools</text>

  <!-- C logo -->
  ${logoSvg}
</svg>`;
}
