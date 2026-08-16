import { ImageResponse } from "next/og";
import { BRAND_LINE } from "@/lib/site";
import { CURRENT_DROP } from "@/lib/catalog/drops";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "THARROS — contemporary streetwear";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#9a9a9a",
          }}
        >
          {CURRENT_DROP.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 168,
            fontWeight: 800,
            letterSpacing: "0.02em",
          }}
        >
          THARROS
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#c8c8c8" }}>
          {BRAND_LINE}
        </div>
      </div>
    ),
    size,
  );
}
