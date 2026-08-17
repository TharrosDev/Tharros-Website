type Props = {
  className?: string;
  /** Rendered as the accessible name; set false when a parent already labels it. */
  label?: boolean;
};

/**
 * The THARROS wordmark. Typographic on purpose — set in the display face so it
 * works at 12px in the header and at 20vw in the footer. Replace with an SVG
 * lockup when the final logo asset lands; nothing else needs to change.
 *
 * Letter-spacing belongs to `type-wordmark`, not to this component. It used to
 * take a `tracking` prop defaulting to `0.14em` and write it as an inline
 * style, which outranks any class — so `--type-wordmark`'s `-0.01em` was dead
 * at both of the two call sites, which are the only call sites. A token nothing
 * can reach is worse than no token.
 */
export default function Wordmark({ className = "", label = true }: Props) {
  return (
    <span
      className={`font-display font-extrabold uppercase ${className}`}
      aria-hidden={label ? undefined : "true"}
    >
      Tharros
    </span>
  );
}

/**
 * Edge-to-edge wordmark for the footer. Drawn as SVG text with `textLength` so
 * it fills the width exactly at any viewport instead of being guessed with a
 * vw font size and clipped when the guess is wrong.
 */
export function WordmarkFit({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 148"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="THARROS"
      className={`w-full ${className}`}
    >
      <text
        x="0"
        y="147"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fontSize="200"
        fontWeight="800"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)" }}
      >
        THARROS
      </text>
    </svg>
  );
}
