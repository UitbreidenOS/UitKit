/**
 * JSON-LD structured data helpers.
 * Each function returns a plain object ready for JSON.stringify().
 */

const SITE_URL = "https://claudient.tools";
const ORG_NAME = "Claudient";

/** Collections that map to SoftwareApplication schema */
const SOFTWARE_COLLECTIONS = new Set([
  "skills",
  "agents",
  "hooks",
  "mcp",
  "prompts",
  "rules",
]);

export interface JsonLdInput {
  collection: string;
  title: string;
  description: string;
  url: string;
}

export function buildJsonLd(input: JsonLdInput): Record<string, unknown> {
  const { collection, title, description, url } = input;
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  if (collection === "guides") {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: description || undefined,
      url: fullUrl,
      publisher: {
        "@type": "Organization",
        name: ORG_NAME,
        url: SITE_URL,
      },
    };
  }

  if (collection === "workflows") {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: title,
      description: description || undefined,
      url: fullUrl,
    };
  }

  if (SOFTWARE_COLLECTIONS.has(collection)) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: title,
      description: description || undefined,
      url: fullUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    };
  }

  // Generic fallback
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description || undefined,
    url: fullUrl,
  };
}

export function buildHomeJsonLd(): Record<string, unknown>[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: ORG_NAME,
      url: SITE_URL,
      description:
        "The Claude Code knowledge base — skills, agents, hooks, MCP configs, workflows, guides, and prompts.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      sameAs: ["https://github.com/tushar2704/Claudient"],
    },
  ];
}
