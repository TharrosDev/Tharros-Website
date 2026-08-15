import { ImageResponse } from "next/og";

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
          background: "#0a0a0a",
          color: "#fafafa",
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
