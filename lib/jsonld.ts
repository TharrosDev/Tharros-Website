/**
 * Serialise structured data for an inline <script type="application/ld+json">.
 *
 * `JSON.stringify` does not escape `<`, so a product name or a drop title
 * containing `</script>` would close the block and inject markup. Catalog
 * content is trusted today, but that stops being true the moment a CMS is
 * wired in behind `lib/catalog/queries.ts`.
 *
 * U+2028/U+2029 are escaped too: they are legal inside JSON strings but
 * terminate a line in JavaScript. The pattern is built from escapes rather
 * than written as a literal so this source file stays plain ASCII.
 */
const LINE_SEPARATORS = new RegExp("[\\u2028\\u2029]", "g");

/**
 * A BreadcrumbList from a trail of `[name, path]` pairs.
 *
 * Two routes used to publish one, each with its own hand-built
 * `itemListElement` array — so every other route was invisible to breadcrumb
 * rendering in results, and the two that were not could drift apart. Paths are site-relative; the site URL is applied here.
 *
 * No `@context` — this is always a node inside a page's own graph, and a
 * nested context is not what the caller means.
 */
export function breadcrumbList(
  siteUrl: string,
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: `${siteUrl}${entry.path === "/" ? "" : entry.path}`,
    })),
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(LINE_SEPARATORS, (char) =>
      char.charCodeAt(0) === 0x2028 ? "\\u2028" : "\\u2029",
    );
}
