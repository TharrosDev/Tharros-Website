import type { ReactElement } from "react";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import styles from "./WorkReel.module.css";

// Two-row, counter-scrolling reel of high-fidelity browser mockups + legend
// strip. The mockups stand in for the kinds of small-business sites Tharros
// builds — restaurants, clinics, trades, studios — not a tech/agency portfolio.
// Pure-CSS marquee → renders as a server component.

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
  { title: "Restaurant",   url: "restaurant.ca",   kind: "menu",       year: "2025", sector: "Restaurant",     scope: "Web · Menu · Reservations",    palette: ["#1a1410", "#e07a3e", "#f4e8d6"] },
  { title: "Real Estate",  url: "realestate.ca",   kind: "realestate", year: "2025", sector: "Real estate",    scope: "Web · Listings · Booking",     palette: ["#11221c", "#4caf7d", "#eef3ef"] },
  { title: "Contractor",   url: "contractor.ca",   kind: "trades",     year: "2024", sector: "Contractor",     scope: "Web · Quote form · Gallery",   palette: ["#16181c", "#f0a32e", "#f1efe9"] },
  { title: "Salon",        url: "salon.ca",        kind: "salon",      year: "2025", sector: "Hair & beauty",  scope: "Web · Services · Booking",     palette: ["#faf0f2", "#c2557a", "#1f1418"] },
  { title: "Dental",       url: "dental.ca",       kind: "booking",    year: "2025", sector: "Dental clinic",  scope: "Web · Online booking · Agent", palette: ["#f2f7f8", "#1f8a8a", "#0e1518"] },
  { title: "Café",         url: "cafe.ca",         kind: "cafe",       year: "2025", sector: "Café",           scope: "Web · Menu · Pickup orders",   palette: ["#211712", "#c98a4b", "#f1e3d2"] },
  { title: "Fitness",      url: "fitness.ca",      kind: "fitness",    year: "2025", sector: "Fitness studio", scope: "Web · Schedule · Memberships", palette: ["#eef1ea", "#6b8f5e", "#1c241a"] },
  { title: "Boutique",     url: "boutique.ca",     kind: "commerce",   year: "2024", sector: "Retail",         scope: "Web · Shop · Checkout",        palette: ["#efe6d2", "#1a1a1a", "#7a3a55"] },
  { title: "Law",          url: "law.ca",          kind: "legal",      year: "2024", sector: "Law firm",       scope: "Web · Intake · Agent",         palette: ["#0f1622", "#b89a5e", "#eef0f4"] },
  { title: "Auto Repair",  url: "autorepair.ca",   kind: "auto",       year: "2025", sector: "Auto repair",    scope: "Web · Booking · Quotes",       palette: ["#101418", "#e23a2e", "#eef0f2"] },
  { title: "Tours",        url: "tours.ca",        kind: "map",        year: "2024", sector: "Tours & travel", scope: "Web · Map · Bookings",         palette: ["#f1ece1", "#1f2a44", "#c2492e"] },
  { title: "Florist",      url: "florist.ca",      kind: "brand",      year: "2024", sector: "Florist",        scope: "Brand · Web · Shop",           palette: ["#efece3", "#1a1a1a", "#b8231a"] },
  { title: "Clinic",       url: "clinic.ca",       kind: "calendar",   year: "2024", sector: "Wellness clinic",scope: "Web · Scheduling · Agent",     palette: ["#f3f1ea", "#1f2a44", "#e8b34a"] },
  { title: "Photography",  url: "photography.ca",  kind: "video",      year: "2024", sector: "Photography",    scope: "Web · Portfolio · Booking",    palette: ["#0c0c0e", "#ff8a4a", "#f4ede3"] },
  { title: "Community",    url: "community.ca",    kind: "newsletter", year: "2024", sector: "Member society", scope: "Web · Members · Newsletter",   palette: ["#faf7ee", "#1a1a1a", "#e23a2e"] },
];

type MockProps = { title: string; bg: string; accent: string; ink: string };

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

function MockRealEstate({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-re")} style={{ background: bg, color: ink }}>
      <div className={cx("m-re-photo")} style={{
        background: `
          radial-gradient(ellipse at 70% 20%, ${accent}55 0%, transparent 55%),
          linear-gradient(160deg, ${ink} 0%, ${accent}40 130%)
        `,
      }}>
        <div className={cx("m-re-top")}>
          <span style={{ color: bg, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
          <span className={cx("m-re-tag")} style={{ background: accent, color: ink }}>FOR SALE</span>
        </div>
        <div className={cx("m-re-price")} style={{ color: bg }}>$749,000</div>
      </div>
      <div className={cx("m-re-info")}>
        <div style={{ color: ink, fontSize: 13 }}>128 Maple Street</div>
        <div style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 10 }}>3 bed · 2 bath · 1,840 sqft</div>
        <div className={cx("m-re-cta")} style={{ background: accent, color: bg }}>Book a viewing →</div>
      </div>
    </div>
  );
}

function MockCafe({ title, accent, ink, bg }: MockProps) {
  return (
    <div className={cx("m-cf")}>
      <div className={cx("m-cf-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: accent, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".1em" }}>● OPEN · 7–4</span>
      </div>
      <div className={cx("m-cf-h")} style={{ color: ink }}>
        Coffee, <em style={{ color: accent }}>roasted</em><br />in-house.
      </div>
      <div className={cx("m-cf-stamps")}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ background: i < 4 ? accent : "transparent", borderColor: accent, color: bg }}>
            {i < 4 ? "●" : ""}
          </span>
        ))}
      </div>
      <div className={cx("m-cf-cta")} style={{ background: ink, color: bg }}>Order pickup →</div>
    </div>
  );
}

function MockAuto({ title, accent, ink, bg }: MockProps) {
  const chips = ["Brake check", "Tire swap", "Diagnostics", "Alignment"];
  return (
    <div className={cx("m-au")}>
      <div className={cx("m-au-head")}>
        <span style={{ color: ink, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05em" }}>{title}</span>
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>MON–SAT · 8–6</span>
      </div>
      <div className={cx("m-au-quote")}>
        <span className={cx("m-au-num")} style={{ color: accent }}>$59</span>
        <span style={{ color: ink, opacity: .6, fontFamily: "var(--mono)", fontSize: 10 }}>oil change · from</span>
      </div>
      <div className={cx("m-au-chips")}>
        {chips.map((c) => (
          <span key={c} style={{ borderColor: `${ink}22`, color: ink }}>{c}</span>
        ))}
      </div>
      <div className={cx("m-au-cta")} style={{ background: accent, color: bg }}>Book a service →</div>
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
        <span style={{ color: ink, opacity: .55, fontFamily: "var(--mono)", fontSize: 9 }}>PORTFOLIO · 04:32</span>
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
        <span>IDENTITY · 2024</span><span>↗ 8 pages</span>
      </div>
      <div className={cx("m-br-lockup")}>
        <div className={cx("m-br-mark")} style={{ background: accent, color: bg }}>{title.charAt(0).toUpperCase()}</div>
        <div className={cx("m-br-name")} style={{ color: ink }}>{title}<span style={{ color: accent }}>.</span></div>
      </div>
      <div className={cx("m-br-tag")} style={{ color: ink, opacity: .7 }}>Local, and proud of it.</div>
      <div className={cx("m-br-swatches")}>
        <span style={{ background: ink }} />
        <span style={{ background: accent }} />
        <span style={{ background: `${ink}22`, color: ink, fontFamily: "var(--mono)", fontSize: 8 }}>#F3</span>
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
          <span style={{ color: ink, fontFamily: "var(--mono)", fontSize: 12 }}>$ 240</span>
        </div>
        <div style={{ color: ink, opacity: .55, fontSize: 10, lineHeight: 1.4 }}>
          Boiled-wool coat. Tailored close. <br />
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
          <div style={{ color: accent }}>● Old town · 32 stops</div>
          <div style={{ color: ink, opacity: .55 }}>○ Harbour · 18 stops</div>
          <div style={{ color: ink, opacity: .55 }}>○ Hills · 24 stops</div>
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
        Read by <em style={{ color: accent }}>3,200</em><br />neighbours.
      </div>
      <div className={cx("m-nl-form")}>
        <span className={cx("m-nl-input")} style={{ borderColor: `${ink}30`, color: ink, opacity: .55 }}>you@email.com</span>
        <span className={cx("m-nl-btn")} style={{ background: ink, color: bg }}>Subscribe →</span>
      </div>
      <div className={cx("m-nl-list")}>
        {["This month at the hall", "Welcoming new members", "Notes from the board"].map((t, i) => (
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
    { col: 0, row: 1, len: 2, label: "Consultation", tint: accent },
    { col: 1, row: 0, len: 1, label: "Check-in",     tint: ink, light: true },
    { col: 1, row: 3, len: 3, label: "New client",   tint: accent },
    { col: 2, row: 2, len: 2, label: "Follow-up",    tint: ink },
    { col: 3, row: 1, len: 1, label: "Walk-in",      tint: ink, light: true },
    { col: 3, row: 4, len: 2, label: "Assessment",   tint: accent },
    { col: 4, row: 0, len: 2, label: "Review",       tint: ink },
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

const MOCKS: Record<string, (p: MockProps) => ReactElement> = {
  menu: MockMenu,
  booking: MockBooking,
  trades: MockTrades,
  fitness: MockFitness,
  legal: MockLegal,
  salon: MockSalon,
  realestate: MockRealEstate,
  cafe: MockCafe,
  auto: MockAuto,
  video: MockVideo,
  brand: MockBrand,
  commerce: MockCommerce,
  map: MockMap,
  newsletter: MockNewsletter,
  calendar: MockCalendar,
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
  const top = [PROJECTS[0], PROJECTS[2], PROJECTS[4], PROJECTS[6], PROJECTS[8], PROJECTS[10], PROJECTS[12], PROJECTS[14]];
  const bot = [PROJECTS[1], PROJECTS[3], PROJECTS[5], PROJECTS[7], PROJECTS[9], PROJECTS[11], PROJECTS[13]];

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
          A moving sample of the range we build — storefronts, booking pages,
          and live agent consoles for local businesses.
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
