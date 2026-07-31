/* =============================================================================
   APIary's own tool identity (indigo/amber/slate) — separate from RAA's real
   brand, which only ever appears inside real captured data, never as chrome.
============================================================================= */
const FONT = "Inter, -apple-system, 'Segoe UI', sans-serif";
const FONT_DISPLAY = "'Plus Jakarta Sans', Inter, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const INDIGO = { 50: "#EEF2FF", 100: "#E0E7FF", 200: "#C7D2FE", 300: "#A5B4FC", 400: "#818CF8", 500: "#6366F1", 600: "#5B5BD6", 700: "#4F46E5", 800: "#3730A3", 900: "#312E81" };
const AMBER = { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706", 700: "#B45309" };
const SLATE = { 50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1", 400: "#94A3B8", 500: "#64748B", 600: "#475569", 700: "#334155", 800: "#1E293B", 900: "#0F172A" };
const ACCENT = INDIGO[600];
const ACCENT_TINT = INDIGO[50];
const LINE = SLATE[200];
const BAND = SLATE[50];
const FAINT = SLATE[500];
const BODY = SLATE[600];
const INK = SLATE[900];
const CONTENT_MAX = 1080;

// R (real RAA brand values) is populated at boot from content/R.json — it's
// only used here for the logo mark and the "Real capture" tag colour, both
// genuinely real values, not chrome.
let R;

function Mark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1.5 L21.5 6.75 V17.25 L12 22.5 L2.5 17.25 V6.75 Z" fill={R ? R.yellow : "#FFE600"} stroke={R ? R.black : "#000"} strokeWidth="1" />
    </svg>
  );
}

function RealTag() {
  return <span style={{ fontSize: 11, fontWeight: 600, color: R ? R.selected : "#007064", background: "#E6F1F0", padding: "2px 7px", borderRadius: 3, fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>Real capture</span>;
}
function FoundationTag() {
  return <span style={{ fontSize: 11, fontWeight: 600, color: "#4D4D4D", background: "#F1EEE5", padding: "2px 7px", borderRadius: 3, fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>Foundation</span>;
}

function GrayBand({ title, description, extra }) {
  return (
    <div style={{ background: BAND, padding: "36px 40px", borderBottom: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: CONTENT_MAX, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#000", margin: 0, letterSpacing: "-0.01em", fontFamily: FONT_DISPLAY }}>{title}</h1>
          {extra}
        </div>
        {description && <p style={{ fontSize: 15, color: BODY, marginTop: 8, maxWidth: 680, lineHeight: 1.6 }}>{description}</p>}
      </div>
    </div>
  );
}

function TabStrip({ tabs, active, onChange }) {
  return (
    <div style={{ borderBottom: `1px solid ${LINE}`, padding: "0 40px" }}>
      <div style={{ display: "flex", gap: 24, maxWidth: CONTENT_MAX, margin: "0 auto" }}>
        {tabs.map((t) => {
          const isActive = active === t;
          return (
            <button key={t} onClick={() => onChange(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: "13px 2px", fontSize: 14, color: isActive ? "#000" : FAINT, fontWeight: isActive ? 700 : 500, borderBottom: isActive ? "2px solid #000" : "2px solid transparent", marginBottom: -1 }}>
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 32 }}>
      {title && <h2 style={{ fontSize: 19, fontWeight: 700, color: "#000", marginBottom: 10 }}>{title}</h2>}
      {children}
    </section>
  );
}

function ContentsRail({ items, active, onClick }) {
  if (!items || !items.length) return null;
  return (
    <div style={{ width: 190, flexShrink: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontFamily: FONT_MONO }}>On this page</div>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} style={{ display: "block", fontSize: 13, color: FAINT, textDecoration: "none", padding: "4px 0" }}>{it.label}</a>
      ))}
    </div>
  );
}

function DotPattern() {
  return (
    <svg className="absolute inset-0" width="100%" height="100%" style={{ opacity: 0.4, position: "absolute", top: 0, left: 0 }}>
      <defs><pattern id="apy-dots" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#E2E0D8" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#apy-dots)" />
    </svg>
  );
}

/* =============================================================================
   LIVE COMPONENT PREVIEW ENGINE — renders each real captured preview.states
   entry (from specs.json) as an actual styled element, using the real colours
   and values that were captured, not a screenshot.
============================================================================= */
function PreviewFallback({ item }) {
  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 8, padding: 20, fontSize: 13, color: FAINT }}>
      No visual preview recipe yet for "{item.name}" — real values are in the Specs tab.
    </div>
  );
}

function ComponentPreview({ item }) {
  const p = item.preview;
  if (!p || !p.kind) return <PreviewFallback item={item} />;
  const states = p.states || [];
  if (p.kind === "button" || p.kind === "container" || p.kind === "step") {
    return (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {states.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
              background: s.bg || "#fff", color: s.text || "#000",
              border: s.border || (s.bg ? "none" : `1px solid ${LINE}`),
              borderRadius: s.radius ?? 4, padding: s.padding ?? "10px 16px",
              width: s.w, height: s.h, boxShadow: s.shadow,
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
              whiteSpace: "pre-line", textAlign: "center", minWidth: 44,
            }}>
              {s.sample || s.label}
            </div>
            <span style={{ fontSize: 11, color: FAINT }}>{s.label}</span>
          </div>
        ))}
      </div>
    );
  }
  return <PreviewFallback item={item} />;
}
