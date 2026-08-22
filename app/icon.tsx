import { ImageResponse } from "next/og";
import { INK_HEX, PAPER_HEX } from "@/lib/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the T from the wordmark, knocked out of black. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: INK_HEX,
          color: PAPER_HEX,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: "-0.04em",
        }}
      >
        T
      </div>
    ),
    size,
  );
}
