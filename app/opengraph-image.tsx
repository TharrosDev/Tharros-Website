import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Design token hex approximations
const COBALT = "#2f62e0";
const COBALT_LIGHT = "#7a9ee8";
const BG_DARK = "#1b1f2d";
const BG_LIGHT = "#f5f3ee";
const INK = "#1c2030";
const INK_ON_DARK = "#f2f0eb";
const MUTED_DARK = "#6b7280";
const MUTED_LIGHT = "#8a8f9e";

export function generateImageMetadata() {
  return [
    {
      id: "hero",
      alt: "Tharros — Modern Websites & AI Agents for Ottawa Businesses",
    },
    {
      id: "packages",
      alt: "Tharros — The Refresh, The On-Call, The Integrate: three packages for Ottawa small businesses",
    },
    {
      id: "slogan",
      alt: "Keep it Local, Keep it Canadian. — Tharros, Ottawa's website and AI agent studio",
    },
  ];
}

async function loadFont(): Promise<ArrayBuffer> {
  const buf = await readFile(join(process.cwd(), "app/fonts/Geist-Black.ttf"));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

const fonts = (data: ArrayBuffer) => [
  { name: "Geist", data, weight: 900 as const, style: "normal" as const },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function TiMark({ fill, hole }: { fill: string; hole: string }) {
  return (
    <svg width={30} height={34} viewBox="0 0 28 30" fill="none">
      <rect x="2" y="2" width="24" height="4" fill={fill} />
      <path d="M16 6L10 24H5L11 6H16Z" fill={fill} />
      <path d="M22 6L16 24H11L17 6H22Z" fill={fill} />
      <circle cx="18.5" cy="15" r="2.5" fill={hole} />
    </svg>
  );
}

function AccentRail({ color }: { color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 5,
        height: "100%",
        background: color,
      }}
    />
  );
}

function SloganPill({
  textColor,
  borderColor,
  bgColor,
}: {
  textColor: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "7px 14px",
        border: `1px solid ${borderColor}`,
        background: bgColor,
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: 700,
          color: textColor,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Keep it Local, Keep it Canadian.
      </span>
    </div>
  );
}

// ─── Variant A: Hero ──────────────────────────────────────────────────────────
// Dark graphite · bold "Modern Websites & AI Agents." headline

function renderHero(fontData: ArrayBuffer) {
  return new ImageResponse(
    (
      <div
        style={{
          background: BG_DARK,
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AccentRail color={COBALT} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px 60px 60px 92px",
            width: 720,
            height: "100%",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 44,
            }}
          >
            <TiMark fill={COBALT} hole={BG_DARK} />
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

          {/* Hairline */}
          <div
            style={{
              width: 600,
              height: 1,
              background: "rgba(255,255,255,0.1)",
              marginBottom: 52,
            }}
          />

          {/* Headline */}
          <div
            style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}
          >
            {(["Modern", "Websites &", "AI Agents."] as const).map(
              (line, i) => (
                <span
                  key={line}
                  style={{
                    fontFamily: '"Geist", system-ui, sans-serif',
                    fontSize: 82,
                    fontWeight: 900,
                    color: i === 2 ? COBALT_LIGHT : INK_ON_DARK,
                    lineHeight: 1.0,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {line}
                </span>
              )
            )}
          </div>

          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 20,
              fontWeight: 900,
              color: MUTED_DARK,
            }}
          >
            for Ottawa small businesses
          </span>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <SloganPill
              textColor={COBALT_LIGHT}
              borderColor="rgba(47,98,224,0.35)"
              bgColor="rgba(47,98,224,0.08)"
            />
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

        {/* Faint Ti mark watermark; top=(630-580)/2=25 */}
        <div
          style={{ position: "absolute", right: -40, top: 25, display: "flex" }}
        >
          <svg
            width={520}
            height={580}
            viewBox="0 0 28 30"
            fill="none"
            style={{ opacity: 0.05 }}
          >
            <rect x="2" y="2" width="24" height="4" fill={INK_ON_DARK} />
            <path d="M16 6L10 24H5L11 6H16Z" fill={INK_ON_DARK} />
            <path d="M22 6L16 24H11L17 6H22Z" fill={INK_ON_DARK} />
            <circle cx="18.5" cy="15" r="2.5" fill={BG_DARK} />
          </svg>
        </div>

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
    { ...size, fonts: fonts(fontData) }
  );
}

// ─── Variant B: Packages ──────────────────────────────────────────────────────
// Light bone-warm surface · three packages listed side-by-side

function renderPackages(fontData: ArrayBuffer) {
  const packages = [
    {
      num: "01",
      name: "The Refresh",
      desc: "Modern website. Per-call support.",
    },
    {
      num: "02",
      name: "The On-Call",
      desc: "Website + monthly retainer.",
    },
    {
      num: "03",
      name: "The Integrate",
      desc: "Website + AI agent + retainer.",
    },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          background: BG_LIGHT,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "60px 80px 60px 92px",
          overflow: "hidden",
        }}
      >
        <AccentRail color={COBALT} />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 40,
          }}
        >
          <TiMark fill={INK} hole={BG_LIGHT} />
          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.18em",
              color: INK,
            }}
          >
            THARROS
          </span>
        </div>

        {/* Hairline */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(28,32,48,0.12)",
            marginBottom: 48,
          }}
        />

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 52,
          }}
        >
          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 58,
              fontWeight: 900,
              color: INK,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
            }}
          >
            Three packages.
          </span>
          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 58,
              fontWeight: 900,
              color: COBALT,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
            }}
          >
            One local team.
          </span>
        </div>

        {/* Package list */}
        <div
          style={{
            display: "flex",
            gap: 0,
            flex: 1,
          }}
        >
          {packages.map((pkg, i) => (
            <div
              key={pkg.num}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                borderLeft: `1px solid rgba(28,32,48,0.12)`,
                paddingLeft: i === 0 ? 0 : 36,
                marginLeft: i === 0 ? 0 : 0,
                paddingRight: 32,
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: COBALT,
                  letterSpacing: "0.12em",
                  marginBottom: 10,
                }}
              >
                § {pkg.num}
              </span>
              <span
                style={{
                  fontFamily: '"Geist", system-ui, sans-serif',
                  fontSize: 24,
                  fontWeight: 900,
                  color: INK,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  marginBottom: 10,
                }}
              >
                {pkg.name}
              </span>
              <span
                style={{
                  fontFamily: '"Geist", system-ui, sans-serif',
                  fontSize: 16,
                  fontWeight: 900,
                  color: MUTED_LIGHT,
                  lineHeight: 1.4,
                }}
              >
                {pkg.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 44,
            paddingTop: 24,
            borderTop: "1px solid rgba(28,32,48,0.1)",
          }}
        >
          <SloganPill
            textColor={COBALT}
            borderColor="rgba(47,98,224,0.25)"
            bgColor="rgba(47,98,224,0.06)"
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#b0b4c0",
              letterSpacing: "0.08em",
            }}
          >
            tharros.ca
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: fonts(fontData) }
  );
}

// ─── Variant C: Slogan ────────────────────────────────────────────────────────
// Dark surface · "Keep it Local. / Keep it Canadian." as the hero text

function renderSlogan(fontData: ArrayBuffer) {
  return new ImageResponse(
    (
      <div
        style={{
          background: BG_DARK,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "60px 80px 60px 92px",
          overflow: "hidden",
        }}
      >
        <AccentRail color={COBALT} />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 44,
          }}
        >
          <TiMark fill={COBALT} hole={BG_DARK} />
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

        {/* Hero slogan */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 96,
              fontWeight: 900,
              color: INK_ON_DARK,
              lineHeight: 1.0,
              letterSpacing: "-0.045em",
            }}
          >
            Keep it Local.
          </span>
          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: 96,
              fontWeight: 900,
              color: COBALT_LIGHT,
              lineHeight: 1.0,
              letterSpacing: "-0.045em",
            }}
          >
            Keep it Canadian.
          </span>

          {/* Sub-rule + descriptor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 36,
            }}
          >
            <div
              style={{ width: 40, height: 1, background: COBALT }}
            />
            <span
              style={{
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: 20,
                fontWeight: 900,
                color: MUTED_DARK,
                letterSpacing: "-0.01em",
              }}
            >
              Ottawa&apos;s website and AI agent studio
            </span>
          </div>
        </div>

        {/* Concentric ring schematic — top-right, partially clipped */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            display: "flex",
          }}
        >
          <svg width={500} height={500} viewBox="0 0 500 500" fill="none">
            <circle cx="400" cy="100" r="80" stroke={COBALT} strokeWidth="1" opacity="0.08" />
            <circle cx="400" cy="100" r="140" stroke={COBALT} strokeWidth="1" opacity="0.06" />
            <circle cx="400" cy="100" r="210" stroke={COBALT} strokeWidth="1" opacity="0.04" />
            <circle cx="400" cy="100" r="290" stroke={COBALT} strokeWidth="1" opacity="0.03" />
            <circle cx="400" cy="100" r="6" fill={COBALT} opacity="0.3" />
            <circle cx="480" cy="100" r="3" fill={COBALT} opacity="0.2" />
            <circle cx="400" cy="180" r="3" fill={COBALT} opacity="0.2" />
            <line x1="400" y1="100" x2="480" y2="100" stroke={COBALT} strokeWidth="1" opacity="0.15" />
            <line x1="400" y1="100" x2="400" y2="180" stroke={COBALT} strokeWidth="1" opacity="0.15" />
          </svg>
        </div>

        {/* tharros.ca */}
        <div
          style={{
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
    { ...size, fonts: fonts(fontData) }
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default async function OGImage({ id }: { id: string }) {
  const fontData = await loadFont();
  if (id === "packages") return renderPackages(fontData);
  if (id === "slogan") return renderSlogan(fontData);
  return renderHero(fontData);
}
