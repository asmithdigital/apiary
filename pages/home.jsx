function HomePage({ navigate }) {
  const [site, setSite] = useState(null);
  useEffect(() => { fetchMarkdown("./content/site.md").then((d) => setSite(d.meta)); }, []);
  if (!site) return <div style={{ padding: 60 }}><LoadingRow /></div>;

  return (
    <div>
      <Header onNavigate={navigate} />
      {/* Real extracted values: atlassian.design's actual hero H1 is 112px,
          weight 700, 116px line-height, purely typographic — no illustration
          at all. That restraint is deliberate, not a placeholder. */}
      <section style={{ padding: "96px 64px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(48px, 8vw, 112px)", fontWeight: 700, lineHeight: 1.03, letterSpacing: "-0.02em", color: "var(--color-ink)", margin: "0 0 32px", fontFamily: "var(--font-display)" }}>
          {site.heroHeadingLine1}<br />{site.heroHeadingLine2}
        </h1>
        <p style={{ fontSize: 20, color: "var(--color-body)", lineHeight: 1.6, maxWidth: 480, marginBottom: 40 }}>
          {site.heroTagline}
        </p>
        <button className="apy-btn-primary" onClick={() => navigate({ kind: "getstarted", ref: "what-is-apiary" })}>
          {site.heroCtaLabel}
        </button>
      </section>

      <section style={{ padding: "0 64px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 653, fontFamily: "var(--font-display)", marginBottom: 24, color: "var(--color-ink)" }}>{site.exploreHeading}</h2>
        {/* Real extracted grid pattern from atlassian.design/components:
            --ds-grid-min-width: 280px, auto-fill columns. */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {NAV.componentGroups.map((g) => {
            const count = NAV.components.filter((c) => c.groupKey === g.key).length;
            const first = NAV.components.find((c) => c.groupKey === g.key);
            return (
              <button key={g.key} onClick={() => first && navigate({ kind: "component", ref: first })} style={{ textAlign: "left", border: "1px solid var(--color-line)", borderRadius: 8, padding: 20, background: "#fff", cursor: "pointer" }}>
                <div style={{ fontSize: 16, fontWeight: 653, fontFamily: "var(--font-display)", marginBottom: 4, color: "var(--color-ink)" }}>{g.label}</div>
                <div style={{ fontSize: 13, color: "var(--color-faint)" }}>{count} components</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
