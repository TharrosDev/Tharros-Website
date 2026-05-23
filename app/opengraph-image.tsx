import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt =
  "Tharros — Modern Websites & AI Agents for Ottawa Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Cobalt hex approximations from the design token oklch(50% 0.20 260) / oklch(78% 0.17 260)
const COBALT = "#2f62e0";
const COBALT_LIGHT = "#7a9ee8";
const BG = "#1b1f2d";
const INK = "#f2f0eb";
const MUTED = "#6b7280";

export default async function OGImage() {
  const fontData = await readFile(
    join(process.cwd(), "app/fonts/Geist-Black.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: BG,
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left cobalt accent rail */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 5,
            height: "100%",
            background: COBALT,
          }}
        />

        {/* Main content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px 60px 60px 92px",
            width: 720,
            height: "100%",
          }}
        >
          {/* Eyebrow: Ti mark + THARROS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 44,
            }}
          >
            {/* Ti mark icon — reproduced from tharros-logo.svg */}
            <svg
              width={30}
              height={34}
              viewBox="0 0 28 30"
              fill="none"
            >
              <rect x="2" y="2" width="24" height="4" fill={COBALT} />
              <path d="M16 6L10 24H5L11 6H16Z" fill={COBALT} />
              <path d="M22 6L16 24H11L17 6H22Z" fill={COBALT} />
              <circle cx="18.5" cy="15" r="2.5" fill={BG} />
            </svg>
            <span
              style={{
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: "0.18em",
                color: COBALT,
              }}
            >
              THARROS
            </span>
          </div>

          {/* Hairline rule */}
          <div
            style={{
              width: 600,
              height: 1,
              background: "rgba(255,255,255,0.1)",
              marginBottom: 52,
            }}
          />

          {/* Display headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: 82,
                fontWeight: 900,
                color: INK,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
              }}
            >
              Modern
            </span>
            <span
              style={{
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: 82,
                fontWeight: 900,
                color: INK,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
              }}
            >
              Websites &
            </span>
            <span
              style={{
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: 82,
                fontWeight: 900,
                color: COBALT_LIGHT,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
              }}
            >
              AI Agents.
            </span>
          </div>

          {/* Sub-label */}
          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 20,
              fontWeight: 900,
              color: MUTED,
              letterSpacing: "0.01em",
            }}
          >
            for Ottawa small businesses
          </span>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {/* Slogan pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "7px 14px",
                border: `1px solid rgba(47,98,224,0.35)`,
                background: "rgba(47,98,224,0.08)",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: COBALT_LIGHT,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Keep it Local, Keep it Canadian.
              </span>
            </div>

            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#3d4558",
                letterSpacing: "0.08em",
              }}
            >
              Ottawa, ON
            </span>
          </div>
        </div>

        {/* Right decorative area — large faint Ti mark; top=(630-580)/2=25 */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 25,
            display: "flex",
          }}
        >
          <svg
            width={520}
            height={580}
            viewBox="0 0 28 30"
            fill="none"
            style={{ opacity: 0.05 }}
          >
            <rect x="2" y="2" width="24" height="4" fill={INK} />
            <path d="M16 6L10 24H5L11 6H16Z" fill={INK} />
            <path d="M22 6L16 24H11L17 6H22Z" fill={INK} />
            <circle cx="18.5" cy="15" r="2.5" fill={BG} />
          </svg>
        </div>

        {/* tharros.ca bottom-right */}
        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: 60,
            display: "flex",
            fontFamily: "monospace",
            fontSize: 13,
            color: "#2e3448",
            letterSpacing: "0.08em",
          }}
        >
          tharros.ca
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          weight: 900,
          style: "normal",
        },
      ],
    }
  );
}
