/* =============================================================================
   PARTIAL: preview-engine — the logo mark, the "Real capture"/"Foundation"
   tags, and the engine that renders each component's live preview from its
   real captured specs.json. Find this file if you need to change how a
   component's live preview is drawn.
============================================================================= */
let R; // real RAA brand values, populated at boot from content/R.json

function Mark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1.5 L21.5 6.75 V17.25 L12 22.5 L2.5 17.25 V6.75 Z" fill={R ? R.yellow : "#FFE600"} stroke={R ? R.black : "#000"} strokeWidth="1" />
    </svg>
  );
}

function RealTag() {
  return <span className="apy-tag apy-tag-real">Real capture</span>;
}
function FoundationTag() {
  return <span className="apy-tag apy-tag-foundation">Foundation</span>;
}

function DotPattern() {
  return (
    <svg width="100%" height="100%" style={{ opacity: 0.4, position: "absolute", top: 0, left: 0 }}>
      <defs><pattern id="apy-dots" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#E2E0D8" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#apy-dots)" />
    </svg>
  );
}

function PreviewFallback({ item }) {
  return (
    <div style={{ border: "1px solid var(--color-line)", borderRadius: 8, padding: 20, fontSize: 14, color: "var(--color-faint)" }}>
      No visual preview recipe yet for "{item.name}" — real values are in the Specs tab.
    </div>
  );
}

// Renders one real component's preview.states (from its own specs.json) —
// every colour/border/radius/padding value here comes straight from the
// real captured data, this function just lays them out.
function ComponentPreview({ item }) {
  const p = item.preview;
  if (!p || !p.kind) return <PreviewFallback item={item} />;
  const states = p.states || [];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
      {states.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{
            background: s.bg || "#fff", color: s.text || "#000",
            border: s.border || (s.bg ? "none" : "1px solid var(--color-line)"),
            borderRadius: s.radius ?? 4, padding: s.padding ?? "10px 16px",
            width: s.w, height: s.h, boxShadow: s.shadow,
            fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
            whiteSpace: "pre-line", textAlign: "center", minWidth: 44,
          }}>
            {s.sample || s.label}
          </div>
          <span style={{ fontSize: 13, color: "var(--color-faint)" }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
