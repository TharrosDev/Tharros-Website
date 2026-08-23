"use client";

import { INK_HEX, PAPER_HEX } from "@/lib/site";

/**
 * Last-resort boundary: catches failures in the root layout itself, so it has
 * to render its own <html> and cannot rely on the design system loading.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          // `dvh`, not `vh`: this page is bottom-aligned, and on a phone `100vh`
          // puts the button behind the browser chrome until the page is
          // scrolled — on the one screen whose only control is that button.
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: INK_HEX,
          color: PAPER_HEX,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "clamp(1.25rem, 4vw, 4rem)",
        }}
      >
        <p style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
          THARROS
        </p>
        <h1
          style={{
            fontSize: "clamp(2.75rem, 8vw, 6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            margin: "1.5rem 0 0",
          }}
        >
          That didn&apos;t work.
        </h1>
        <p style={{ maxWidth: "32ch", opacity: 0.75, marginTop: "1.5rem" }}>
          The site failed to load. Try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "2.5rem",
            alignSelf: "flex-start",
            minHeight: 52,
            padding: "0 2rem",
            border: `1px solid ${PAPER_HEX}`,
            background: PAPER_HEX,
            color: INK_HEX,
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
