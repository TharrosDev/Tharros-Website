import type { ReactElement } from "react";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import styles from "./WorkReel.module.css";

// Faithful port of the supplied landing-page reel (elements.jsx WorkSection):
// a two-row, counter-scrolling reel of high-fidelity browser mockups + legend
// strip. Mock content, layouts, and palettes are reproduced exactly; only the
// editorial header, the tweaks panel, captions, and mono mode are dropped, and
// hover-pause is off. Pure-CSS marquee → renders as a server component.

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--reel-serif",
  display: "swap",
});

// Maps local CSS-module class names to their hashed equivalents.
const cx = (...names: Array<string | false | null | undefined>) =>
  names.filter(Boolean).map((n) => styles[n as string] ?? n).join(" ");

type Project = {
  title: string;
  url: string;
  kind: string;
  year: string;
  sector: string;
  scope: string;
  palette: [string, string, string];
};

const PROJECTS: Project[] = [
  { title: "Northwind",      url: "northwind.com",     kind: "editorial",  year: "2024", sector: "Publishing",     scope: "Brand · Web · 4 agents",      palette: ["#15110c", "#d6593f", "#f0e6d4"] },
  { title: "Sundial",        url: "sundial.agents",    kind: "agent",      year: "2024", sector: "Logistics",      scope: "Agents · Ops console",         palette: ["#fff8ee", "#e23a2e", "#0e0e10"] },
  { title: "Helio Type",     url: "helio.type",        kind: "gallery",    year: "2023", sector: "Foundry",        scope: "E-comm · Specimen system",     palette: ["#f3eee2", "#0e0e10", "#e23a2e"] },
  { title: "Loop",           url: "loop.studio",       kind: "video",      year: "2024", sector: "Film",           scope: "Web · CMS · Reels engine",     palette: ["#0c0c0e", "#ff8a4a", "#f4ede3"] },
  { title: "Polaris Labs",   url: "polaris.so",        kind: "product",    year: "2025", sector: "Developer",      scope: "Marketing · Docs · Agents",    palette: ["#f4ede3", "#0e0e10", "#e23a2e"] },
  { title: "Meridian",       url: "meridian.dev",      kind: "docs",       year: "2024", sector: "Infrastructure", scope: "Docs · Reference engine",      palette: ["#0e1115", "#c8f04a", "#f3f3f1"] },
  { title: "Granite",        url: "granite.co",        kind: "brand",      year: "2023", sector: "Real estate",    scope: "Identity · Web · Index",       palette: ["#efece3", "#1a1a1a", "#b8231a"] },
  { title: "Honeycomb & Co", url: "honeycomb.co",      kind: "analytics",  year: "2024", sector: "Fintech",        scope: "Web · KPI surfaces",           palette: ["#eef2f6", "#1f3a8a", "#0e0e10"] },
  { title: "Atlas Press",    url: "atlas.press",       kind: "archive",    year: "2022", sector: "Editorial",      scope: "Archive · Brand · Web",        palette: ["#13130f", "#e23a2e", "#f3eee2"] },
  { title: "Foundry",        url: "foundry.studio",    kind: "manifesto",  year: "2025", sector: "Studio",         scope: "Identity · Web · Agents",      palette: ["#f4ede3", "#e23a2e", "#0e0e10"] },
  { title: "Pareto FM",      url: "pareto.fm",         kind: "podcast",    year: "2024", sector: "Media",          scope: "Web · CMS · Episode engine",   palette: ["#0d1a2b", "#e8b34a", "#f3eee2"] },
  { title: "Ostro",          url: "status.ostro.io",   kind: "status",     year: "2024", sector: "Cloud infra",    scope: "Status page · Probes · Brand", palette: ["#0a1110", "#3eef9a", "#f3eee2"] },
  { title: "Verso",          url: "verso.shop",        kind: "commerce",   year: "2023", sector: "Apparel",        scope: "Commerce · Brand · Web",       palette: ["#efe6d2", "#1a1a1a", "#7a3a55"] },
  { title: "Marrow",         url: "marrow.dev",        kind: "terminal",   year: "2025", sector: "Open source",    scope: "CLI · Docs · Marketing",       palette: ["#08080a", "#73f59f", "#e8b34a"] },
  { title: "Tessera",        url: "tessera.places",    kind: "map",        year: "2024", sector: "Travel",         scope: "Web · Map · Index",            palette: ["#f1ece1", "#1f2a44", "#c2492e"] },
  { title: "Margins",        url: "margins.letter",    kind: "newsletter", year: "2024", sector: "Independent",    scope: "Newsletter · Brand",           palette: ["#faf7ee", "#1a1a1a", "#e23a2e"] },
  { title: "Pivot",          url: "pivot.cal",         kind: "calendar",   year: "2023", sector: "Productivity",   scope: "Web · App · Agents",           palette: ["#f3f1ea", "#1f2a44", "#e8b34a"] },
  { title: "Quarry",         url: "quarry.studio",     kind: "case-study", year: "2023", sector: "Architecture",   scope: "Case study · Brand · Web",     palette: ["#2a2825", "#d6c8a8", "#e23a2e"] },
  { title: "Bella Cucina",   url: "bellacucina.ca",    kind: "menu",       year: "2025", sector: "Restaurant",     scope: "Web · Menu · Reservations",    palette: ["#1a1410", "#e07a3e", "#f4e8d6"] },
  { title: "Rideau Dental",  url: "rideaudental.ca",   kind: "booking",    year: "2025", sector: "Dental clinic",  scope: "Web · Online booking · Agent", palette: ["#f2f7f8", "#1f8a8a", "#0e1518"] },
  { title: "Maple Ridge",    url: "mapleridge.build",  kind: "trades",     year: "2024", sector: "Contractor",     scope: "Web · Quote form · Gallery",   palette: ["#16181c", "#f0a32e", "#f1efe9"] },
  { title: "Glebe Yoga",     url: "glebeyoga.ca",      kind: "fitness",    year: "2025", sector: "Wellness studio", scope: "Web · Schedule · Memberships", palette: ["#eef1ea", "#6b8f5e", "#1c241a"] },
  { title: "Carleton Law",   url: "carletonlaw.ca",    kind: "legal",      year: "2024", sector: "Law firm",       scope: "Web · Intake · Agent",         palette: ["#0f1622", "#b89a5e", "#eef0f4"] },
  { title: "Bloom Salon",    url: "bloomsalon.ca",     kind: "salon",      year: "2025", sector: "Hair & beauty",  scope: "Web · Services · Booking",     palette: ["#faf0f2", "#c2557a", "#1f1418"] },
];

type MockProps = { title: string; bg: string; accent: string; ink: string };

function MockEditorial({ title, accent, ink }: MockProps) {
  return (
    <div className={cx("m-ed")}>
      <div className={cx("m-ed-nav")} style={{ color: ink }}>
        <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", opacity: .7 }}>ISSUE 14 · WINTER</span>
      </div>
      <div className={cx("m-ed-h")} style={{ color: ink }}>
        The <em style={{ color: accent }}>quieter</em><br />web, vol. ii.
      </div>
      <div className={cx("m-ed-deck")} style={{ color: ink, opacity: .65 }}>
        A field report on sites that listen, route, and reply — without breaking the page.
      </div>
      <div className={cx("m-ed-rule")} style={{ background: ink, opacity: .5 }} />
      <div className={cx("m-ed-grid")}>
        <span style={{ background: accent }} />
        <span style={{ background: ink, opacity: .25 }} />
        <span style={{ background: ink, opacity: .55 }} />
      </div>
    </div>
  );
}

function MockProduct({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-pd")}>
      <div className={cx("m-pd-top")}>
        <span className={cx("m-pd-logo")} style={{ color: ink }}>● {title}</span>
        <span className={cx("m-pd-pill")} style={{ background: accent, color: bg }}>v3 · launched</span>
      </div>
      <div className={cx("m-pd-h")} style={{ color: ink }}>
        Software that <em style={{ color: accent }}>pays</em> for itself.
      </div>
      <div className={cx("m-pd-sub")} style={{ color: ink, opacity: .55 }}>
        $0 to start. $19 when the agents start closing.
      </div>
      <div className={cx("m-pd-cta")}>
        <span style={{ background: ink, color: bg }}>Start free →</span>
        <span style={{ border: `1px solid ${ink}44`, color: ink }}>Book a demo</span>
      </div>
      <div className={cx("m-pd-logos")} style={{ color: ink, opacity: .35 }}>
        <span>NORTHWIND</span><span>HELIO</span><span>SUNDIAL</span><span>POLARIS</span>
      </div>
    </div>
  );
}

function MockGallery({ title, accent, ink, bg }: MockProps) {
  const letters = ["A", "G", "ē", "Q", "&", "r", "Œ"];
  return (
    <div className={cx("m-gl")}>
      <div className={cx("m-gl-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .5, fontFamily: "var(--mono)", fontSize: 9 }}>14 FAMILIES · 92 STYLES</span>
      </div>
      <div className={cx("m-gl-grid")}>
        {letters.map((l, i) => (
          <div key={i} className={cx("m-gl-cell")} style={{
            background: i === 2 ? accent : i === 5 ? ink : `${ink}10`,
            color: i === 2 ? bg : i === 5 ? bg : ink,
            fontFamily: "var(--serif)",
            fontStyle: i % 2 ? "italic" : "normal",
          }}>{l}</div>
        ))}
      </div>
      <div className={cx("m-gl-foot")} style={{ color: ink, opacity: .55 }}>
        <span>HELIO DISPLAY</span><span>↳ buy / try</span>
      </div>
    </div>
  );
}

function MockDocs({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-dx")}>
      <div className={cx("m-dx-side")}>
        <div style={{ color: accent, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em" }}>{title.toUpperCase()}</div>
        {["/getting-started", "/runtime", "/agents", "/deploy", "/cli"].map((p, i) => (
          <div key={p} style={{ color: i === 2 ? accent : `${ink}99`, opacity: i === 2 ? 1 : 0.6 }}>{p}</div>
        ))}
      </div>
      <div className={cx("m-dx-main")}>
        <div className={cx("m-dx-crumb")} style={{ color: ink, opacity: .5 }}>runtime / agents</div>
        <div className={cx("m-dx-h")} style={{ color: ink }}>Defining an <em style={{ color: accent }}>operator</em>.</div>
        <div className={cx("m-dx-code")} style={{ background: `${ink}`, color: bg, border: `1px solid ${accent}33` }}>
          <div><span style={{ color: accent }}>const</span> agent = defineAgent(&#123;</div>
          <div>{"  "}name: <span style={{ color: accent }}>{'"router"'}</span>,</div>
          <div>{"  "}on: <span style={{ color: accent }}>{'"lead.qualified"'}</span>,</div>
          <div>{"  "}run: routeToHuman,</div>
          <div>&#125;);</div>
        </div>
      </div>
    </div>
  );
}

function MockAgent({ title, accent, ink, bg }: MockProps) {
  const rows = [
    { id: "01", task: "lead.qualify",   out: "done · 240 seats", state: "ok" },
    { id: "02", task: "draft.reply",    out: "done · SLA 14m",   state: "ok" },
    { id: "03", task: "route.maya",     out: "running …",        state: "live" },
    { id: "04", task: "log.crm.append", out: "queued",           state: "wait" },
    { id: "05", task: "notify.slack",   out: "queued",           state: "wait" },
  ];
  return (
    <div className={cx("m-ag")}>
      <div className={cx("m-ag-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span className={cx("m-ag-live")} style={{ background: accent, color: bg }}>● LIVE · 5 nodes</span>
      </div>
      <div className={cx("m-ag-sub")} style={{ color: ink, opacity: .55 }}>session #4,182 — pricing inbound, mid-market</div>
      <div className={cx("m-ag-rows")}>
        {rows.map((r) => (
          <div key={r.id} className={cx("m-ag-row")} style={{
            color: ink,
            background: `${ink}06`,
            borderLeft: `2px solid ${r.state === "live" ? accent : r.state === "ok" ? `${ink}` : `${ink}30`}`,
          }}>
            <span style={{ opacity: .45 }}>{r.id}</span>
            <span style={{ flex: 1 }}>{r.task}</span>
            <span style={{ color: r.state === "live" ? accent : `${ink}66` }}>{r.out}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockVideo({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-vd")}>
      <div className={cx("m-vd-poster")} style={{ background: `linear-gradient(135deg, ${ink} 0%, ${ink} 60%, ${accent} 200%)` }}>
        <div className={cx("m-vd-play")} style={{ borderLeftColor: bg }} />
        <div className={cx("m-vd-tc")} style={{ color: bg, opacity: .85 }}>
          <span>● REC</span>
          <span>01:24 / 04:32</span>
        </div>
      </div>
      <div className={cx("m-vd-meta")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>REEL · 04:32 · 2024</span>
      </div>
      <div className={cx("m-vd-scrub")} style={{ background: `${ink}15` }}>
        <span style={{ background: accent, width: "32%" }} />
      </div>
    </div>
  );
}

function MockBrand({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-br")}>
      <div className={cx("m-br-meta")} style={{ color: ink, opacity: .55 }}>
        <span>IDENTITY · 2023</span><span>↗ 8 pages</span>
      </div>
      <div className={cx("m-br-lockup")}>
        <div className={cx("m-br-mark")} style={{ background: accent, color: bg }}>G</div>
        <div className={cx("m-br-name")} style={{ color: ink }}>{title}<span style={{ color: accent }}>.</span></div>
      </div>
      <div className={cx("m-br-tag")} style={{ color: ink, opacity: .7 }}>Buildings, slower.</div>
      <div className={cx("m-br-swatches")}>
        <span style={{ background: ink }} />
        <span style={{ background: accent }} />
        <span style={{ background: `${ink}22`, color: ink, fontFamily: "var(--mono)", fontSize: 8 }}>#F3</span>
      </div>
    </div>
  );
}

function MockAnalytics({ title, accent, ink }: MockProps) {
  const bars = [42, 58, 51, 70, 64, 82, 76, 92];
  return (
    <div className={cx("m-an")}>
      <div className={cx("m-an-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>Q3 · vs Q2</span>
      </div>
      <div className={cx("m-an-stat")} style={{ color: ink }}>
        $2.4<span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: ".5em", marginLeft: 4 }}>M</span>
      </div>
      <div className={cx("m-an-delta")} style={{ color: accent, fontFamily: "var(--mono)", fontSize: 10 }}>↑ 24.6% MoM</div>
      <div className={cx("m-an-bars")}>
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%`, background: i === bars.length - 1 ? accent : `${ink}55` }} />
        ))}
      </div>
    </div>
  );
}

function MockArchive({ title, accent, ink }: MockProps) {
  const rows = [
    { n: "041", t: "Sundial — agents v3",   y: "2024" },
    { n: "038", t: "Helio Type — specimen", y: "2024" },
    { n: "036", t: "Loop — reels engine",   y: "2023" },
    { n: "032", t: "Granite — identity",    y: "2023" },
    { n: "029", t: "Polaris — marketing",   y: "2023" },
  ];
  return (
    <div className={cx("m-ar")}>
      <div className={cx("m-ar-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>041 ENTRIES</span>
      </div>
      <div className={cx("m-ar-rows")}>
        {rows.map((r) => (
          <div key={r.n} className={cx("m-ar-row")} style={{ color: ink, borderColor: `${ink}18` }}>
            <span style={{ color: accent, fontFamily: "var(--mono)", fontSize: 9 }}>{r.n}</span>
            <span style={{ flex: 1 }}>{r.t}</span>
            <span style={{ opacity: .5, fontFamily: "var(--mono)", fontSize: 9 }}>{r.y}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockManifesto({ title, accent, ink }: MockProps) {
  return (
    <div className={cx("m-mf")}>
      <div className={cx("m-mf-meta")} style={{ color: ink, opacity: .5, fontFamily: "var(--mono)", fontSize: 9 }}>
        <span>{title.toUpperCase()}</span><span>§ MANIFESTO</span>
      </div>
      <div className={cx("m-mf-body")} style={{ color: ink }}>
        We build <em style={{ color: accent }}>operators</em>,<br />
        not <em style={{ color: accent }}>landing</em><br />
        pages.
      </div>
      <div className={cx("m-mf-foot")} style={{ color: ink, opacity: .5, fontFamily: "var(--mono)", fontSize: 9 }}>
        <span>— since 2021</span><span>read on →</span>
      </div>
    </div>
  );
}

function MockPodcast({ title, accent, ink, bg }: MockProps) {
  const bars = [22, 38, 56, 30, 64, 80, 48, 36, 70, 50, 88, 42, 60, 28, 76, 44, 58, 34, 66, 24, 52, 72];
  return (
    <div className={cx("m-pc")}>
      <div className={cx("m-pc-head")}>
        <span style={{ color: accent, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".1em" }}>● {title.toUpperCase()}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>EP 042 · 58 MIN</span>
      </div>
      <div className={cx("m-pc-ep")} style={{ color: ink }}>
        On building <em style={{ color: accent }}>quietly,</em> with Maya Chen.
      </div>
      <div className={cx("m-pc-wave")}>
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%`, background: i < 12 ? accent : `${ink}40` }} />
        ))}
      </div>
      <div className={cx("m-pc-ctrl")}>
        <span className={cx("m-pc-play")} style={{ background: accent, color: bg }}>▶</span>
        <span style={{ color: ink, fontFamily: "var(--mono)", fontSize: 10 }}>23:14 / 58:02</span>
        <span style={{ marginLeft: "auto", color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>+ subscribe</span>
      </div>
    </div>
  );
}

function MockStatus({ title, accent, ink, bg }: MockProps) {
  const svcs = [
    { name: "api.ostro.io",  state: "ok" },
    { name: "edge.workers",  state: "ok" },
    { name: "object.store",  state: "ok" },
    { name: "agent.runtime", state: "warn" },
    { name: "dashboard.app", state: "ok" },
  ];
  const days = Array.from({ length: 30 });
  return (
    <div className={cx("m-st")}>
      <div className={cx("m-st-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span className={cx("m-st-pill")} style={{ background: accent, color: bg }}>● ALL SYSTEMS</span>
      </div>
      <div className={cx("m-st-rows")}>
        {svcs.map((s) => (
          <div key={s.name} className={cx("m-st-row")} style={{ color: ink }}>
            <span className={cx("m-st-name")} style={{ color: ink, opacity: .8 }}>{s.name}</span>
            <div className={cx("m-st-grid")}>
              {days.map((_, i) => {
                const isWarn = s.state === "warn" && (i === 22 || i === 23);
                return (
                  <span key={i} style={{ background: isWarn ? "#e8b34a" : accent, opacity: isWarn ? 1 : 0.85 }} />
                );
              })}
            </div>
            <span className={cx("m-st-pct")} style={{ color: s.state === "warn" ? "#e8b34a" : accent }}>
              {s.state === "warn" ? "99.71%" : "100.00%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockCommerce({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-cm")}>
      <div className={cx("m-cm-img")} style={{ background: `linear-gradient(135deg, ${accent} 0%, ${ink}30 60%, ${accent}80 100%)` }}>
        <span className={cx("m-cm-tag")} style={{ background: ink, color: bg }}>NEW · AW25</span>
      </div>
      <div className={cx("m-cm-info")}>
        <div className={cx("m-cm-head")}>
          <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 18 }}>{title}</span>
          <span style={{ color: ink, fontFamily: "var(--mono)", fontSize: 12 }}>€ 240</span>
        </div>
        <div style={{ color: ink, opacity: .55, fontSize: 10, lineHeight: 1.4 }}>
          Boiled-wool coat. Tailored in Florence. <br />
          One season, made to last seven.
        </div>
        <div className={cx("m-cm-vars")}>
          <span style={{ background: ink }} />
          <span style={{ background: accent, outline: `1.5px solid ${ink}`, outlineOffset: 1 }} />
          <span style={{ background: `${ink}30` }} />
          <span style={{ background: `${ink}66` }} />
        </div>
        <div className={cx("m-cm-cta")} style={{ background: ink, color: bg }}>Add to bag — XS</div>
      </div>
    </div>
  );
}

function MockTerminal({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-tm")} style={{ background: bg, color: accent }}>
      <div className={cx("m-tm-head")}>
        <span>{title}@runtime ~ %</span>
        <span style={{ color: ink, opacity: .5 }}>zsh · 132×42</span>
      </div>
      <div className={cx("m-tm-lines")}>
        <div><span style={{ color: ink }}>$</span> marrow init my-agent</div>
        <div style={{ color: ink, opacity: .65 }}>  ✓ scaffolded ./my-agent</div>
        <div style={{ color: ink, opacity: .65 }}>  ✓ installed 14 deps</div>
        <div><span style={{ color: ink }}>$</span> marrow deploy <span style={{ color: ink }}>--region eu</span></div>
        <div style={{ color: ink, opacity: .65 }}>  ↳ uploading bundle <span style={{ color: accent }}>(412 KB)</span></div>
        <div style={{ color: ink, opacity: .65 }}>  ↳ probing endpoints …</div>
        <div style={{ color: accent }}>  ● LIVE  https://my-agent.marrow.dev</div>
        <div><span style={{ color: ink }}>$</span> <span className={cx("m-tm-caret")}>█</span></div>
      </div>
    </div>
  );
}

function MockMap({ title, accent, ink, bg }: MockProps) {
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
        <path d="M 0 90 Q 100 60 200 110 T 400 100"   stroke={ink} strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
        <path d="M 0 150 Q 140 200 280 160 T 400 180" stroke={ink} strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
        <path d="M 80 0 Q 90 80 60 160 T 100 240"     stroke={ink} strokeOpacity="0.12" strokeWidth="1" fill="none" />
        <path d="M 260 0 Q 280 100 240 240"           stroke={ink} strokeOpacity="0.12" strokeWidth="1" fill="none" />
      </svg>
      <div className={cx("m-mp-overlay")}>
        <div className={cx("m-mp-head")}>
          <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
          <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>248 PLACES</span>
        </div>
        <div className={cx("m-mp-list")}>
          <div style={{ color: accent }}>● Hydra · 32 places</div>
          <div style={{ color: ink, opacity: .55 }}>○ Naxos · 18 places</div>
          <div style={{ color: ink, opacity: .55 }}>○ Tinos · 24 places</div>
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

function MockNewsletter({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-nl")}>
      <div className={cx("m-nl-meta")} style={{ color: ink, opacity: .55 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em" }}>{title.toUpperCase()}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9 }}>VOL · 28 / fri</span>
      </div>
      <div className={cx("m-nl-h")} style={{ color: ink }}>
        Read by <em style={{ color: accent }}>24,148</em><br />designers.
      </div>
      <div className={cx("m-nl-form")}>
        <span className={cx("m-nl-input")} style={{ borderColor: `${ink}30`, color: ink, opacity: .55 }}>you@studio.com</span>
        <span className={cx("m-nl-btn")} style={{ background: ink, color: bg }}>Subscribe →</span>
      </div>
      <div className={cx("m-nl-list")}>
        {["The shape of slow software", "Notes on house style", "On working alone, together"].map((t, i) => (
          <div key={i} className={cx("m-nl-row")} style={{ color: ink, borderColor: `${ink}15` }}>
            <span style={{ color: ink, opacity: .5, fontFamily: "var(--mono)", fontSize: 9 }}>{String(28 - i).padStart(2, "0")}</span>
            <span>{t}</span>
            <span style={{ marginLeft: "auto", color: ink, opacity: .4, fontFamily: "var(--mono)", fontSize: 9 }}>{i === 0 ? "FRI" : i === 1 ? "WED" : "MON"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockCalendar({ title, accent, ink, bg }: MockProps) {
  const slots = [
    { col: 0, row: 1, len: 2, label: "Design review",   tint: accent },
    { col: 1, row: 0, len: 1, label: "Standup",         tint: ink, light: true },
    { col: 1, row: 3, len: 3, label: "Tharros · build", tint: accent },
    { col: 2, row: 2, len: 2, label: "Northwind sync",  tint: ink },
    { col: 3, row: 1, len: 1, label: "1:1 · Maya",      tint: ink, light: true },
    { col: 3, row: 4, len: 2, label: "Polaris demo",    tint: accent },
    { col: 4, row: 0, len: 2, label: "Studio review",   tint: ink },
  ];
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = ["09", "10", "11", "12", "13", "14"];
  return (
    <div className={cx("m-cl")}>
      <div className={cx("m-cl-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>W · 28 / OCT</span>
      </div>
      <div className={cx("m-cl-grid")}>
        <div className={cx("m-cl-hours")}>
          {hours.map((h) => <span key={h} style={{ color: ink, opacity: .45 }}>{h}</span>)}
        </div>
        <div className={cx("m-cl-days")}>
          {days.map((d) => (
            <div key={d} className={cx("m-cl-col")}>
              <div className={cx("m-cl-day")} style={{ color: ink, opacity: .6 }}>{d}</div>
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

function MockCaseStudy({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-cs")} style={{ background: bg, color: ink }}>
      <div className={cx("m-cs-img")} style={{
        background: `
          radial-gradient(ellipse at 30% 40%, ${ink}40 0%, transparent 60%),
          linear-gradient(135deg, ${ink} 0%, ${accent}50 100%)
        `,
      }}>
        <div className={cx("m-cs-meta")} style={{ color: bg, opacity: .8, fontFamily: "var(--mono)", fontSize: 9 }}>
          <span>CASE 014 · 2023</span><span>{title.toUpperCase()}</span>
        </div>
        <div className={cx("m-cs-h")} style={{ color: bg }}>
          The house<br />
          on the <em style={{ color: accent }}>cliff.</em>
        </div>
        <div className={cx("m-cs-tags")}>
          <span style={{ borderColor: `${bg}55`, color: bg }}>Architecture</span>
          <span style={{ borderColor: `${bg}55`, color: bg }}>Brand</span>
          <span style={{ borderColor: `${bg}55`, color: bg }}>Web</span>
        </div>
        <div className={cx("m-cs-link")} style={{ color: accent }}>read the case study →</div>
      </div>
    </div>
  );
}

function MockMenu({ title, accent, ink, bg }: MockProps) {
  const dishes = [
    { t: "Wood-fired margherita", p: "18" },
    { t: "Cacio e pepe",          p: "22" },
    { t: "Branzino, lemon",       p: "31" },
    { t: "Tiramisù",              p: "12" },
  ];
  return (
    <div className={cx("m-mn")}>
      <div className={cx("m-mn-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>DINNER · 5–10PM</span>
      </div>
      <div className={cx("m-mn-list")}>
        {dishes.map((d) => (
          <div key={d.t} className={cx("m-mn-row")} style={{ color: ink, borderColor: `${ink}1e` }}>
            <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13 }}>{d.t}</span>
            <span className={cx("m-mn-dots")} style={{ borderColor: `${ink}30` }} />
            <span style={{ color: accent, fontFamily: "var(--mono)", fontSize: 11 }}>{d.p}</span>
          </div>
        ))}
      </div>
      <div className={cx("m-mn-cta")} style={{ background: accent, color: bg }}>Reserve a table →</div>
    </div>
  );
}

function MockBooking({ title, accent, ink, bg }: MockProps) {
  const slots = ["9:00", "10:30", "1:00", "2:30", "4:00", "5:30"];
  const days = [{ d: "MON", n: "12" }, { d: "TUE", n: "13" }, { d: "WED", n: "14" }, { d: "THU", n: "15" }];
  return (
    <div className={cx("m-bk")}>
      <div className={cx("m-bk-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span className={cx("m-bk-pill")} style={{ background: accent, color: bg }}>NEW PATIENTS</span>
      </div>
      <div className={cx("m-bk-sub")} style={{ color: ink, opacity: .6 }}>Book a cleaning in under a minute.</div>
      <div className={cx("m-bk-days")}>
        {days.map((d, i) => (
          <span key={d.d} className={cx("m-bk-day")} style={{
            background: i === 1 ? accent : `${ink}08`,
            color: i === 1 ? bg : ink,
            borderColor: `${ink}14`,
          }}>
            <span style={{ fontSize: 8, opacity: .7 }}>{d.d}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13 }}>{d.n}</span>
          </span>
        ))}
      </div>
      <div className={cx("m-bk-slots")}>
        {slots.map((s, i) => (
          <span key={s} className={cx("m-bk-slot")} style={{
            color: i === 3 ? bg : ink,
            background: i === 3 ? ink : "transparent",
            borderColor: i === 3 ? ink : `${ink}22`,
          }}>{s}</span>
        ))}
      </div>
      <div className={cx("m-bk-cta")} style={{ background: accent, color: bg }}>Confirm — Tue 2:30</div>
    </div>
  );
}

function MockTrades({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-tr")} style={{ background: bg, color: ink }}>
      <div className={cx("m-tr-poster")} style={{ background: `linear-gradient(150deg, ${ink} 0%, ${ink} 45%, ${accent}66 140%)` }}>
        <div className={cx("m-tr-top")}>
          <span style={{ color: bg, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
          <span className={cx("m-tr-badge")} style={{ background: accent, color: ink }}>● LICENSED & INSURED</span>
        </div>
        <div className={cx("m-tr-h")} style={{ color: bg }}>
          Decks, fences &amp;<br /><em style={{ color: accent }}>additions</em> — done right.
        </div>
        <div className={cx("m-tr-meta")} style={{ color: bg, opacity: .75 }}>
          <span>OTTAWA · SINCE 2009</span><span>★ 4.9 · 210 jobs</span>
        </div>
      </div>
      <div className={cx("m-tr-bar")}>
        <span className={cx("m-tr-cta")} style={{ background: accent, color: ink }}>Get a free quote</span>
        <span style={{ color: ink, fontFamily: "var(--mono)", fontSize: 11 }}>(613) 555-0142</span>
      </div>
    </div>
  );
}

function MockFitness({ title, accent, ink, bg }: MockProps) {
  const classes = [
    { t: "Vinyasa Flow",  time: "6:00",  full: false },
    { t: "Power Yoga",    time: "7:30",  full: true },
    { t: "Restorative",   time: "9:00",  full: false },
    { t: "Mat Pilates",   time: "12:00", full: false },
  ];
  return (
    <div className={cx("m-ft")}>
      <div className={cx("m-ft-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>TODAY · THU</span>
      </div>
      <div className={cx("m-ft-list")}>
        {classes.map((c) => (
          <div key={c.t} className={cx("m-ft-row")} style={{ color: ink, background: `${ink}06`, borderLeft: `2px solid ${c.full ? `${ink}30` : accent}` }}>
            <span style={{ color: accent, fontFamily: "var(--mono)", fontSize: 11 }}>{c.time}</span>
            <span style={{ flex: 1, fontSize: 12 }}>{c.t}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 8.5, opacity: c.full ? .5 : 1, color: c.full ? ink : accent }}>
              {c.full ? "WAITLIST" : "BOOK"}
            </span>
          </div>
        ))}
      </div>
      <div className={cx("m-ft-cta")} style={{ background: accent, color: bg }}>Join — 8 classes / mo</div>
    </div>
  );
}

function MockLegal({ title, accent, ink, bg }: MockProps) {
  const areas = ["Real estate", "Wills & estates", "Small business", "Family"];
  return (
    <div className={cx("m-lg")} style={{ background: bg, color: ink }}>
      <div className={cx("m-lg-top")}>
        <span className={cx("m-lg-mark")} style={{ color: accent }}>{title.split(" ")[0].toUpperCase()}</span>
        <span style={{ color: ink, opacity: .5, fontFamily: "var(--mono)", fontSize: 9 }}>EST. 1998</span>
      </div>
      <div className={cx("m-lg-h")} style={{ color: ink }}>
        Counsel you can<br /><em style={{ color: accent }}>actually</em> reach.
      </div>
      <div className={cx("m-lg-areas")}>
        {areas.map((a) => (
          <span key={a} className={cx("m-lg-area")} style={{ borderColor: `${ink}26`, color: ink }}>{a}</span>
        ))}
      </div>
      <div className={cx("m-lg-cta")}>
        <span style={{ background: accent, color: bg }}>Book a consultation</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>free · 20 min</span>
      </div>
    </div>
  );
}

function MockSalon({ title, accent, ink, bg }: MockProps) {
  const services = [
    { t: "Cut & style",   p: "65" },
    { t: "Balayage",      p: "180" },
    { t: "Gloss treat",   p: "45" },
  ];
  return (
    <div className={cx("m-sl")}>
      <div className={cx("m-sl-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.1em" }}>{title}</span>
        <span style={{ color: accent, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".1em" }}>● OPEN TODAY</span>
      </div>
      <div className={cx("m-sl-strip")}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ background: i === 1 ? accent : `${accent}33`, outline: i === 1 ? `1.5px solid ${ink}` : "none", outlineOffset: 1 }} />
        ))}
      </div>
      <div className={cx("m-sl-list")}>
        {services.map((s) => (
          <div key={s.t} className={cx("m-sl-row")} style={{ color: ink, borderColor: `${ink}14` }}>
            <span style={{ fontSize: 12 }}>{s.t}</span>
            <span style={{ marginLeft: "auto", color: ink, opacity: .6, fontFamily: "var(--mono)", fontSize: 11 }}>${s.p}</span>
          </div>
        ))}
      </div>
      <div className={cx("m-sl-cta")} style={{ background: accent, color: bg }}>Book online →</div>
    </div>
  );
}

const MOCKS: Record<string, (p: MockProps) => ReactElement> = {
  editorial: MockEditorial,
  product: MockProduct,
  gallery: MockGallery,
  docs: MockDocs,
  agent: MockAgent,
  video: MockVideo,
  brand: MockBrand,
  analytics: MockAnalytics,
  archive: MockArchive,
  manifesto: MockManifesto,
  podcast: MockPodcast,
  status: MockStatus,
  commerce: MockCommerce,
  terminal: MockTerminal,
  map: MockMap,
  newsletter: MockNewsletter,
  calendar: MockCalendar,
  "case-study": MockCaseStudy,
  menu: MockMenu,
  booking: MockBooking,
  trades: MockTrades,
  fitness: MockFitness,
  legal: MockLegal,
  salon: MockSalon,
};

function BrowserMock({ url, title, kind, palette }: Project) {
  const [bg, accent, ink] = palette;
  const Mock = MOCKS[kind];
  return (
    <div className={cx("bw")}>
      <div className={cx("bw-chrome")}>
        <span className={cx("bw-dots")}><i /><i /><i /></span>
        <span className={cx("bw-url")}><span className={cx("bw-lock")}>⌁</span>{url}</span>
        <span className={cx("bw-tabs")}><i /><i /><i /></span>
      </div>
      <div className={cx("bw-body")} style={{ background: bg, color: ink }}>
        <Mock title={title} bg={bg} accent={accent} ink={ink} />
      </div>
    </div>
  );
}

function ReelRow({ projects, size, direction, speed }: { projects: Project[]; size: "lg" | "sm"; direction: "left" | "right"; speed: number }) {
  const items = [...projects, ...projects];
  const duration = (size === "lg" ? 66 : 54) / speed;
  return (
    <div className={cx("reel-row", `reel-row-${size}`)}>
      <div className={cx("reel-track", direction === "right" && "reel-track-rev")} style={{ ["--dur" as string]: `${duration}s` }}>
        {items.map((p, i) => (
          <article key={i} className={cx("reel-item")} style={{ ["--tilt" as string]: `${((i % 4) - 1.5) * 0.9}deg` }}>
            <BrowserMock {...p} />
          </article>
        ))}
      </div>
    </div>
  );
}

const SPEED = 1;

const CLIENT_TYPES = [
  "Local services",
  "Professional services",
  "Trades & contractors",
  "Member societies",
  "Health & wellness",
  "Retail & hospitality",
];

export default function WorkReel() {
  const top = [PROJECTS[18], PROJECTS[0], PROJECTS[20], PROJECTS[10], PROJECTS[2], PROJECTS[22], PROJECTS[17], PROJECTS[3], PROJECTS[12], PROJECTS[14], PROJECTS[1], PROJECTS[8]];
  const bot = [PROJECTS[19], PROJECTS[5], PROJECTS[21], PROJECTS[13], PROJECTS[7], PROJECTS[23], PROJECTS[15], PROJECTS[6], PROJECTS[11], PROJECTS[16], PROJECTS[4], PROJECTS[9]];

  return (
    <section className={`${styles.work} ${instrumentSerif.variable}`} aria-label="Selected work">
      <header className={`${cx("work-head")} mb-10 md:mb-12`}>
        <div className="flex items-center gap-3 mb-6 md:mb-7">
          <span className="h-[3px] w-7 bg-[color:var(--red)]" aria-hidden="true" />
          <span className="type-meta-strong">Selected work</span>
        </div>
        <h2 className="type-display-2">
          Sites and agents, built to <span className="accent-text">fit.</span>
        </h2>
        <p className="type-lead mt-5 md:mt-6">
          A moving sample of the range we build — editorial sites, storefronts,
          and live agent consoles.
        </p>
      </header>

      <div className={cx("reel")} role="presentation" aria-hidden="true">
        <ReelRow projects={top} size="lg" direction="left" speed={SPEED} />
        <ReelRow projects={bot} size="sm" direction="right" speed={SPEED * 1.2} />
      </div>

      <footer className={cx("work-foot")}>
        <div className={cx("work-foot-row")}>
          <span className={cx("work-foot-label")}>Who we build for</span>
          <div className={cx("work-cats")}>
            {CLIENT_TYPES.map((label) => (
              <span key={label} className={cx("work-cat")}>
                <span className={cx("cat-n")}>/</span>
                <span className={cx("cat-l")}>{label}</span>
              </span>
            ))}
          </div>
          <span className={cx("work-foot-spacer")} />
          <Link href="/brief" className={cx("work-foot-link")}>
            Start a project
            <span className={cx("arrow")}>→</span>
          </Link>
        </div>
      </footer>
    </section>
  );
}
