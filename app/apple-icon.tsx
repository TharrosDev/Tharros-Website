import { ImageResponse } from "next/og";
import { INK_HEX, PAPER_HEX } from "@/lib/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 120,
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
