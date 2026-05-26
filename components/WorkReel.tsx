import type { ReactElement } from "react";
import styles from "./WorkReel.module.css";

// Two-row, counter-scrolling reel of stylised browser mockups. Pure-CSS
// marquee (no JS animation) so it SSRs cleanly and respects reduced motion.
// Recoloured to the Redline triad: each card is either LIGHT or DARK, accent
// is always red. Palettes are hex (not the OKLCH tokens) so the `${ink}30`
// alpha-append trick inside the mocks keeps working.

// Maps local CSS-module classes to their hashed names; unknown names (global
// utility classes like `page-frame`, `type-lead`) pass through untouched.
const cx = (...names: Array<string | false | null | undefined>) =>
  names.filter(Boolean).map((n) => styles[n as string] ?? n).join(" ");

type Palette = { bg: string; accent: string; ink: string };

const LIGHT: Palette = { bg: "#fbf9f8", accent: "#c5372a", ink: "#1d1a18" };
const DARK: Palette = { bg: "#1b1715", accent: "#f5604b", ink: "#f4f1ef" };

type Kind =
  | "agent"
  | "commerce"
  | "map"
  | "video"
  | "brand"
  | "case-study"
  | "calendar"
  | "gallery"
  | "analytics"
  | "editorial"
  | "newsletter"
  | "archive";

interface Project {
  title: string;
  url: string;
  sector: string;
  scope: string;
  kind: Kind;
  palette: Palette;
}

const TOP: Project[] = [
  { title: "Rideau Dental",        url: "rideaudental.ca",      sector: "Dental clinic",    scope: "Site + booking agent",   kind: "agent",      palette: DARK },
  { title: "Bronwyn Candles",      url: "bronwyncandles.ca",    sector: "Candle studio",    scope: "Shop + brand",           kind: "commerce",   palette: LIGHT },
  { title: "Capital Plumbing",     url: "capitalplumbing.ca",   sector: "Plumbing & heat",  scope: "Site + service map",     kind: "map",        palette: LIGHT },
  { title: "Forge Fitness",        url: "forgefit.ca",          sector: "Gym & studio",     scope: "Site + class reels",     kind: "video",      palette: DARK },
  { title: "Maple Barbers",        url: "maplebarbers.ca",      sector: "Barbershop",       scope: "Identity + site",        kind: "brand",      palette: LIGHT },
  { title: "Hillside Builders",    url: "hillsidebuilders.ca",  sector: "Contractor",       scope: "Site + project gallery", kind: "case-study", palette: DARK },
];

const BOT: Project[] = [
  { title: "Glow Skin Studio",     url: "glowskinstudio.ca",    sector: "Esthetics",        scope: "Site + online booking",  kind: "calendar",   palette: LIGHT },
  { title: "Northside Tattoo",     url: "northsidetattoo.ca",   sector: "Tattoo studio",    scope: "Site + flash gallery",   kind: "gallery",    palette: DARK },
  { title: "Glebe Auto",           url: "glebeauto.ca",         sector: "Auto repair",      scope: "Site + reviews",         kind: "analytics",  palette: LIGHT },
  { title: "Maverick Coffee",      url: "maverickcoffee.ca",    sector: "Coffee roaster",   scope: "Site + story",           kind: "editorial",  palette: DARK },
  { title: "Westboro Table",       url: "westborotable.ca",     sector: "Restaurant",       scope: "Site + reservations",    kind: "newsletter", palette: LIGHT },
  { title: "Greenfield Scapes",    url: "greenfieldscapes.ca",  sector: "Landscaping",      scope: "Site + project log",     kind: "archive",    palette: LIGHT },
];

// ── Mock variants ───────────────────────────────────────────────────────────
function MockAgent({ accent, ink }: Palette) {
  const rows = [
    { id: "01", task: "ask.hours",       out: "answered · 9–5", state: "ok" },
    { id: "02", task: "check.insurance", out: "answered",       state: "ok" },
    { id: "03", task: "book.cleaning",   out: "booking …",      state: "live" },
    { id: "04", task: "send.reminder",   out: "queued",         state: "wait" },
    { id: "05", task: "notify.desk",     out: "queued",         state: "wait" },
  ];
  return (
    <div className={cx("m-ag")}>
      <div className={cx("m-ag-head")}>
        <span style={{ color: ink, fontWeight: 600, fontSize: "1.05em" }}>Rideau Dental</span>
        <span className={cx("m-ag-live")} style={{ background: accent, color: "#fff" }}>● LIVE · booking</span>
      </div>
      <div className={cx("m-ag-sub")} style={{ color: ink, opacity: 0.55 }}>after-hours question — new patient</div>
      <div className={cx("m-ag-rows")}>
        {rows.map((r) => (
          <div key={r.id} className={cx("m-ag-row")} style={{
            color: ink,
            background: `${ink}06`,
            borderLeft: `2px solid ${r.state === "live" ? accent : r.state === "ok" ? ink : `${ink}30`}`,
          }}>
            <span style={{ opacity: 0.45 }}>{r.id}</span>
            <span style={{ flex: 1 }}>{r.task}</span>
            <span style={{ color: r.state === "live" ? accent : `${ink}66` }}>{r.out}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockCommerce({ accent, ink, bg }: Palette) {
  return (
    <div className={cx("m-cm")}>
      <div className={cx("m-cm-img")} style={{ background: `linear-gradient(135deg, ${accent} 0%, ${ink}30 60%, ${accent}80 100%)` }}>
        <span className={cx("m-cm-tag")} style={{ background: ink, color: bg }}>NEW · WINTER</span>
      </div>
      <div className={cx("m-cm-info")}>
        <div className={cx("m-cm-head")}>
          <span style={{ color: ink, fontWeight: 600, fontSize: 17 }}>Cedar &amp; Smoke</span>
          <span style={{ color: ink, fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>$28</span>
        </div>
        <div style={{ color: ink, opacity: 0.55, fontSize: 10, lineHeight: 1.4 }}>
          Hand-poured soy candle, made in Ottawa.<br />
          One pour — forty hours of calm.
        </div>
        <div className={cx("m-cm-vars")}>
          <span style={{ background: ink }} />
          <span style={{ background: accent, outline: `1.5px solid ${ink}`, outlineOffset: 1 }} />
          <span style={{ background: `${ink}30` }} />
          <span style={{ background: `${ink}66` }} />
        </div>
        <div className={cx("m-cm-cta")} style={{ background: ink, color: bg }}>Add to cart — Cedar</div>
      </div>
    </div>
  );
}

function MockMap({ accent, ink, bg }: Palette) {
  const pins = [
    { x: 22, y: 30, hot: false },
    { x: 38, y: 58, hot: true },
    { x: 56, y: 24, hot: false },
    { x: 70, y: 70, hot: false },
    { x: 82, y: 42, hot: false },
    { x: 48, y: 80, hot: false },
  ];
  return (
    <div className={cx("m-mp")} style={{ background: bg, color: ink }}>
      <svg className={cx("m-mp-bg")} viewBox="0 0 400 240" preserveAspectRatio="none">
        <defs>
          <pattern id="mapgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={ink} strokeOpacity="0.08" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#mapgrid)" />
        <path d="M 0 90 Q 100 60 200 110 T 400 100" stroke={ink} strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
        <path d="M 0 150 Q 140 200 280 160 T 400 180" stroke={ink} strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
        <path d="M 80 0 Q 90 80 60 160 T 100 240" stroke={ink} strokeOpacity="0.12" strokeWidth="1" fill="none" />
        <path d="M 260 0 Q 280 100 240 240" stroke={ink} strokeOpacity="0.12" strokeWidth="1" fill="none" />
      </svg>
      <div className={cx("m-mp-overlay")} style={{ background: bg, border: `1px solid ${ink}22` }}>
        <div className={cx("m-mp-head")}>
          <span style={{ color: ink, fontWeight: 600, fontSize: "1.05em" }}>Capital Plumbing</span>
          <span style={{ color: ink, opacity: 0.55, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>OTTAWA · 24/7</span>
        </div>
        <div className={cx("m-mp-list")}>
          <div style={{ color: accent }}>● Kanata · same-day</div>
          <div style={{ color: ink, opacity: 0.55 }}>○ Nepean &amp; Barrhaven</div>
          <div style={{ color: ink, opacity: 0.55 }}>○ Orleans &amp; Gatineau</div>
        </div>
      </div>
      <div className={cx("m-mp-pins")}>
        {pins.map((p, i) => (
          <span key={i}
            className={cx("m-mp-pin", p.hot && "is-hot")}
            style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.hot ? accent : ink, ["--ring" as string]: accent }}
          />
        ))}
      </div>
    </div>
  );
}

function MockVideo({ accent, ink, bg }: Palette) {
  return (
    <div className={cx("m-vd")}>
      <div className={cx("m-vd-poster")} style={{ background: `linear-gradient(135deg, ${ink} 0%, ${ink} 60%, ${accent} 200%)` }}>
        <div className={cx("m-vd-play")} style={{ borderLeftColor: bg }} />
        <div className={cx("m-vd-tc")} style={{ color: bg, opacity: 0.85 }}>
          <span>● TOUR</span>
          <span>01:12 / 02:40</span>
        </div>
      </div>
      <div className={cx("m-vd-meta")}>
        <span style={{ color: ink, fontWeight: 600, fontSize: "1.05em" }}>Forge Fitness</span>
        <span style={{ color: ink, opacity: 0.55, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>WALKTHROUGH · 2026</span>
      </div>
      <div className={cx("m-vd-scrub")} style={{ background: `${ink}15` }}>
        <span style={{ background: accent, width: "38%" }} />
      </div>
    </div>
  );
}

function MockBrand({ accent, ink, bg }: Palette) {
  return (
    <div className={cx("m-br")}>
      <div className={cx("m-br-meta")} style={{ color: ink, opacity: 0.55 }}>
        <span>IDENTITY · 2026</span><span>↗ 6 pages</span>
      </div>
      <div className={cx("m-br-lockup")}>
        <div className={cx("m-br-mark")} style={{ background: accent, color: bg }}>M</div>
        <div className={cx("m-br-name")} style={{ color: ink }}>Maple<span style={{ color: accent }}>.</span></div>
      </div>
      <div className={cx("m-br-tag")} style={{ color: ink, opacity: 0.7 }}>Sharp, every time.</div>
      <div className={cx("m-br-swatches")}>
        <span style={{ background: ink }} />
        <span style={{ background: accent }} />
        <span style={{ background: `${ink}22`, color: ink, fontFamily: "var(--font-geist-mono)", fontSize: 8 }}>#1D</span>
      </div>
    </div>
  );
}

function MockCaseStudy({ accent, ink, bg }: Palette) {
  return (
    <div className={cx("m-cs")} style={{ background: bg, color: ink }}>
      <div className={cx("m-cs-img")} style={{
        background: `radial-gradient(ellipse at 30% 40%, ${ink}40 0%, transparent 60%), linear-gradient(135deg, ${ink} 0%, ${accent}50 100%)`,
      }}>
        <div className={cx("m-cs-meta")} style={{ color: bg, opacity: 0.8, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>
          <span>PROJECT 012 · 2026</span><span>HILLSIDE BUILDERS</span>
        </div>
        <div className={cx("m-cs-h")} style={{ color: bg }}>
          A home<br />
          on the <em style={{ color: accent }}>ridge.</em>
        </div>
        <div className={cx("m-cs-tags")}>
          <span style={{ borderColor: `${bg}55`, color: bg }}>Renovation</span>
          <span style={{ borderColor: `${bg}55`, color: bg }}>Build</span>
          <span style={{ borderColor: `${bg}55`, color: bg }}>Local</span>
        </div>
        <div className={cx("m-cs-link")} style={{ color: accent }}>see the build →</div>
      </div>
    </div>
  );
}

function MockCalendar({ accent, ink, bg }: Palette) {
  const slots = [
    { col: 0, row: 1, len: 2, label: "Facial",         tint: accent },
    { col: 1, row: 0, len: 1, label: "Consult",        tint: ink, light: true },
    { col: 1, row: 3, len: 3, label: "Glow · booking", tint: accent },
    { col: 2, row: 2, len: 2, label: "Brow lam",       tint: ink },
    { col: 3, row: 1, len: 1, label: "Peel",           tint: ink, light: true },
    { col: 3, row: 4, len: 2, label: "Lash lift",      tint: accent },
    { col: 4, row: 0, len: 2, label: "Walk-in",        tint: ink },
  ];
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = ["09", "10", "11", "12", "13", "14"];
  return (
    <div className={cx("m-cl")}>
      <div className={cx("m-cl-head")}>
        <span style={{ color: ink, fontWeight: 600, fontSize: "1.05em" }}>Glow Skin Studio</span>
        <span style={{ color: ink, opacity: 0.55, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>THIS WEEK · OCT</span>
      </div>
      <div className={cx("m-cl-grid")}>
        <div className={cx("m-cl-hours")}>
          {hours.map((h) => <span key={h} style={{ color: ink, opacity: 0.45 }}>{h}</span>)}
        </div>
        <div className={cx("m-cl-days")}>
          {days.map((d) => (
            <div key={d} className={cx("m-cl-col")}>
              <div className={cx("m-cl-day")} style={{ color: ink, opacity: 0.6 }}>{d}</div>
              <div className={cx("m-cl-cells")}>
                {hours.map((_, r) => <span key={r} style={{ borderColor: `${ink}10` }} />)}
              </div>
            </div>
          ))}
          {slots.map((s, i) => (
            <div key={i}
              className={cx("m-cl-slot")}
              style={{
                left: `calc(${(s.col / 5) * 100}% + 4px)`,
                top: `calc(${(s.row / 6) * 100}% + 22px)`,
                width: `calc(${(1 / 5) * 100}% - 8px)`,
                height: `calc(${(s.len / 6) * 100}% - 4px)`,
                background: s.light ? `${s.tint}18` : s.tint,
                color: s.light ? ink : bg,
                borderLeft: `2px solid ${s.tint}`,
              }}
            >{s.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockGallery({ accent, ink, bg }: Palette) {
  const marks = ["✦", "✺", "❋", "✶", "❂", "✷", "❈"];
  return (
    <div className={cx("m-gl")}>
      <div className={cx("m-gl-head")}>
        <span style={{ color: ink, fontWeight: 600, fontSize: "1.05em" }}>Northside Tattoo</span>
        <span style={{ color: ink, opacity: 0.5, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>FLASH · 60 designs</span>
      </div>
      <div className={cx("m-gl-grid")}>
        {marks.map((l, i) => (
          <div key={i} className={cx("m-gl-cell")} style={{
            background: i === 2 ? accent : i === 5 ? ink : `${ink}10`,
            color: i === 2 ? bg : i === 5 ? bg : ink,
          }}>{l}</div>
        ))}
      </div>
      <div className={cx("m-gl-foot")} style={{ color: ink, opacity: 0.55 }}>
        <span>WALK-INS WELCOME</span><span>↳ book a slot</span>
      </div>
    </div>
  );
}

function MockAnalytics({ accent, ink }: Palette) {
  const bars = [42, 58, 51, 70, 64, 82, 76, 92];
  return (
    <div className={cx("m-an")}>
      <div className={cx("m-an-head")}>
        <span style={{ color: ink, fontWeight: 600, fontSize: "1.05em" }}>Glebe Auto</span>
        <span style={{ color: ink, opacity: 0.55, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>SINCE LAUNCH</span>
      </div>
      <div className={cx("m-an-stat")} style={{ color: ink }}>
        318<span style={{ color: ink, opacity: 0.55, fontFamily: "var(--font-geist-mono)", fontSize: ".32em", marginLeft: 6 }}>BOOKINGS</span>
      </div>
      <div className={cx("m-an-delta")} style={{ color: accent, fontFamily: "var(--font-geist-mono)", fontSize: 10 }}>↑ 38% booked online</div>
      <div className={cx("m-an-bars")}>
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%`, background: i === bars.length - 1 ? accent : `${ink}55` }} />
        ))}
      </div>
    </div>
  );
}

function MockEditorial({ accent, ink }: Palette) {
  return (
    <div className={cx("m-ed")}>
      <div className={cx("m-ed-nav")} style={{ color: ink }}>
        <span style={{ fontWeight: 600, fontSize: "1.05em" }}>Maverick Coffee</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: ".08em", opacity: 0.7 }}>EST. 2026</span>
      </div>
      <div className={cx("m-ed-h")} style={{ color: ink }}>
        Roasted in<br />the <em style={{ color: accent }}>Glebe.</em>
      </div>
      <div className={cx("m-ed-deck")} style={{ color: ink, opacity: 0.65 }}>
        Small-batch beans, roasted weekly and shipped across Ottawa.
      </div>
      <div className={cx("m-ed-rule")} style={{ background: ink, opacity: 0.5 }} />
      <div className={cx("m-ed-grid")}>
        <span style={{ background: accent }} />
        <span style={{ background: ink, opacity: 0.25 }} />
        <span style={{ background: ink, opacity: 0.55 }} />
      </div>
    </div>
  );
}

function MockNewsletter({ accent, ink, bg }: Palette) {
  const rows = [
    { t: "Friday tasting menu", d: "FRI" },
    { t: "Sunday brunch is back", d: "SUN" },
    { t: "Patio now open", d: "WED" },
  ];
  return (
    <div className={cx("m-nl")}>
      <div className={cx("m-nl-meta")} style={{ color: ink, opacity: 0.55 }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: ".08em" }}>WESTBORO TABLE</span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>RESERVATIONS</span>
      </div>
      <div className={cx("m-nl-h")} style={{ color: ink }}>
        Booked by <em style={{ color: accent }}>2,400</em><br />locals.
      </div>
      <div className={cx("m-nl-form")}>
        <span className={cx("m-nl-input")} style={{ borderColor: `${ink}30`, color: ink, opacity: 0.55 }}>you@email.com</span>
        <span className={cx("m-nl-btn")} style={{ background: ink, color: bg }}>Reserve →</span>
      </div>
      <div className={cx("m-nl-list")}>
        {rows.map((r, i) => (
          <div key={i} className={cx("m-nl-row")} style={{ color: ink, borderColor: `${ink}15` }}>
            <span style={{ color: ink, opacity: 0.5, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>{String(i + 1).padStart(2, "0")}</span>
            <span>{r.t}</span>
            <span style={{ marginLeft: "auto", color: ink, opacity: 0.4, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>{r.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockArchive({ accent, ink }: Palette) {
  const rows = [
    { n: "06", t: "Backyard rebuild — Kanata", y: "2026" },
    { n: "05", t: "Stone patio — Nepean", y: "2026" },
    { n: "04", t: "Garden design — Glebe", y: "2025" },
    { n: "03", t: "Retaining wall — Orleans", y: "2025" },
    { n: "02", t: "Full landscape — Barrhaven", y: "2025" },
  ];
  return (
    <div className={cx("m-ar")}>
      <div className={cx("m-ar-head")}>
        <span style={{ color: ink, fontWeight: 600, fontSize: "1.05em" }}>Greenfield Scapes</span>
        <span style={{ color: ink, opacity: 0.55, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>RECENT WORK</span>
      </div>
      <div className={cx("m-ar-rows")}>
        {rows.map((r) => (
          <div key={r.n} className={cx("m-ar-row")} style={{ color: ink, borderColor: `${ink}18` }}>
            <span style={{ color: accent, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>{r.n}</span>
            <span style={{ flex: 1 }}>{r.t}</span>
            <span style={{ opacity: 0.5, fontFamily: "var(--font-geist-mono)", fontSize: 9 }}>{r.y}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCKS: Record<Kind, (p: Palette) => ReactElement> = {
  agent: MockAgent,
  commerce: MockCommerce,
  map: MockMap,
  video: MockVideo,
  brand: MockBrand,
  "case-study": MockCaseStudy,
  calendar: MockCalendar,
  gallery: MockGallery,
  analytics: MockAnalytics,
  editorial: MockEditorial,
  newsletter: MockNewsletter,
  archive: MockArchive,
};

function BrowserMock({ url, kind, palette }: Project) {
  const Mock = MOCKS[kind];
  return (
    <div className={cx("bw")}>
      <div className={cx("bw-chrome")}>
        <span className={cx("bw-dots")}><i /><i /><i /></span>
        <span className={cx("bw-url")}><span className={cx("bw-lock")}>⌁</span>{url}</span>
        <span className={cx("bw-tabs")}><i /><i /><i /></span>
      </div>
      <div className={cx("bw-body")} style={{ background: palette.bg, color: palette.ink }}>
        <Mock {...palette} />
      </div>
    </div>
  );
}

function ReelRow({ projects, size, direction }: { projects: Project[]; size: "lg" | "sm"; direction: "left" | "right" }) {
  const items = [...projects, ...projects];
  const duration = size === "lg" ? 88 : 72;
  return (
    <div className={cx("reel-row", `reel-row-${size}`)}>
      <div className={cx("reel-track", direction === "right" && "reel-track-rev")} style={{ ["--dur" as string]: `${duration}s` }}>
        {items.map((p, i) => (
          <article key={i} className={cx("reel-item")} style={{ ["--tilt" as string]: `${((i % 4) - 1.5) * 0.8}deg` }}>
            <BrowserMock {...p} />
            <div className={cx("reel-cap")}>
              <div className={cx("reel-cap-row")}>
                <span className={cx("cap-idx")}>{String((i % projects.length) + 1).padStart(2, "0")}</span>
                <span className={cx("cap-title")}>{p.title}</span>
                <span className={cx("cap-sep")}>/</span>
                <span className={cx("cap-url")}>{p.url}</span>
              </div>
              <div className={cx("reel-cap-row", "reel-cap-meta")}>
                <span>{p.sector}</span>
                <span>·</span>
                <span>{p.scope}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const CATEGORIES = ["Trades", "Clinics", "Cafés", "Retail", "Studios", "Shops"];

export default function WorkReel() {
  return (
    <section className={cx("work")} aria-label="The kind of sites we build">
      <div className={cx("reel")} role="presentation" aria-hidden="true">
        <ReelRow projects={TOP} size="lg" direction="left" />
        <ReelRow projects={BOT} size="sm" direction="right" />
      </div>

      <div className={cx("page-frame", "work-foot")}>
        <div className={cx("work-foot-row")}>
          <span className={cx("work-foot-label")}>Built for</span>
          <div className={cx("work-cats")}>
            {CATEGORIES.map((c) => (
              <span key={c} className={cx("work-cat")}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
