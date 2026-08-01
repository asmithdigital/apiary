function HomePage({ navigate }) {
  const [site, setSite] = useState(null);
  useEffect(() => { fetchMarkdown("./content/site.md").then((d) => setSite(d.meta)); }, []);
  if (!site) return <div style={{ padding: 60 }}><LoadingRow /></div>;

  return (
    <div>
      <section style={{ position: "relative", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", background: "#FFFEF9", padding: "0 40px" }}>
        <DotPattern />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          <Header onNavigate={navigate} />
        </div>
        <div style={{ position: "relative", zIndex: 5, paddingTop: "var(--topbar-height)", maxWidth: 980 }}>
          <div style={{ marginBottom: 28, lineHeight: 0.86 }}>
            <div style={{ fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>API</div>
            <div style={{ fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "var(--font-display)", color: "var(--color-accent)", marginLeft: "clamp(20px, 5vw, 72px)" }}>ARY</div>
          </div>
          <p style={{ fontSize: 20, color: "var(--color-body)", lineHeight: 1.6, maxWidth: 440, marginBottom: 40 }}>
            {site.heroTagline}
          </p>
          <button className="apy-btn-primary" onClick={() => navigate({ kind: "getstarted", ref: "what-is-apiary" })}>
            {site.heroCtaLabel}
          </button>
        </div>
      </section>
      <section style={{ padding: "56px 40px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 20 }}>{site.exploreHeading}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {NAV.componentGroups.map((g) => {
            const count = NAV.components.filter((c) => c.groupKey === g.key).length;
            const first = NAV.components.find((c) => c.groupKey === g.key);
            return (
              <button key={g.key} onClick={() => first && navigate({ kind: "component", ref: first })} style={{ textAlign: "left", border: "1px solid var(--color-line)", borderRadius: 8, padding: 18, background: "#fff", cursor: "pointer" }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 6 }}>{g.label}</div>
                <div style={{ fontSize: 14, color: "var(--color-faint)", fontFamily: "var(--font-mono)" }}>{count} components</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
