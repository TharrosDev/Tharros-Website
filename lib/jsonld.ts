/**
 * Serialise structured data for an inline <script type="application/ld+json">.
 *
 * `JSON.stringify` does not escape `<`, so a product name or journal title
 * containing `</script>` would close the block and inject markup. Catalog
 * content is trusted today, but that stops being true the moment a CMS is
 * wired in behind `lib/catalog/queries.ts`.
 *
 * U+2028/U+2029 are escaped too: they are legal inside JSON strings but
 * terminate a line in JavaScript. The pattern is built from escapes rather
 * than written as a literal so this source file stays plain ASCII.
 */
const LINE_SEPARATORS = new RegExp("[\\u2028\\u2029]", "g");

export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(LINE_SEPARATORS, (char) =>
      char.charCodeAt(0) === 0x2028 ? "\\u2028" : "\\u2029",
    );
}
