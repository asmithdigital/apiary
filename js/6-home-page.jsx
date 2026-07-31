function HomePage({ navigate }) {
  const flaggedCount = useMemo(() => 0, []); // real count is per-component now (in specs.json), not summed eagerly
  return (
    <div>
      <section style={{ position: "relative", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", background: "#FFFEF9", padding: "0 40px" }}>
        <DotPattern />
        <header style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: "#fff", borderBottom: `1px solid ${LINE}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mark size={20} /><span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em", fontFamily: FONT }}>APIARY</span>
          </div>
          <button onClick={() => navigate({ kind: "getstarted", ref: "what-is-apiary" })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: ACCENT }}>Open docs →</button>
        </header>
        <div style={{ position: "relative", zIndex: 5, paddingTop: 60, maxWidth: 980 }}>
          <div style={{ marginBottom: 28, lineHeight: 0.86 }}>
            <div style={{ fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: FONT_DISPLAY, color: INK }}>API</div>
            <div style={{ fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: FONT_DISPLAY, color: ACCENT, marginLeft: "clamp(20px, 5vw, 72px)" }}>ARY</div>
          </div>
          <p style={{ fontSize: 18, color: BODY, lineHeight: 1.6, maxWidth: 440, marginBottom: 40 }}>
            RAA's real design system, captured off live code and real documentation — every file here can be edited on GitHub and it updates live.
          </p>
          <button className="apy-btn" onClick={() => navigate({ kind: "getstarted", ref: "what-is-apiary" })} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "14px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Get started →
          </button>
        </div>
      </section>
      <section style={{ padding: "56px 40px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: FONT_DISPLAY, marginBottom: 20 }}>Explore</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {NAV.componentGroups.map((g) => {
            const count = NAV.components.filter((c) => c.groupKey === g.key).length;
            const first = NAV.components.find((c) => c.groupKey === g.key);
            return (
              <button key={g.key} onClick={() => first && navigate({ kind: "component", ref: first })} style={{ textAlign: "left", border: `1px solid ${LINE}`, borderRadius: 8, padding: 18, background: "#fff", cursor: "pointer" }}>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_DISPLAY, marginBottom: 6 }}>{g.label}</div>
                <div style={{ fontSize: 12, color: FAINT, fontFamily: FONT_MONO }}>{count} components</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
