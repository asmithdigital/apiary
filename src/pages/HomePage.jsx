import { useState, useEffect } from "react";
import { Zap, PenLine, AlertCircle, Compass, Layers, Image as ImageIcon, LayoutGrid, Map } from "lucide-react";
import { store } from "../lib/store.js";
import { fetchMarkdown } from "../lib/content.js";
import { CATEGORY_STYLE } from "../lib/categoryStyle.js";
import { Header } from "../components/Header.jsx";
import { LoadingRow } from "../components/MarkdownView.jsx";

const ICONS = { Zap, PenLine, AlertCircle, Compass, Layers, ImageIcon, LayoutGrid, Map };

function CategoryCard({ group, count, onClick }) {
  const style = CATEGORY_STYLE[group.key] || { icon: "LayoutGrid", bg: "var(--color-band)", fg: "var(--color-accent)" };
  const Icon = ICONS[style.icon] || ICONS.LayoutGrid;
  return (
    <button onClick={onClick} className="apy-category-card">
      <div className="apy-category-icon-badge" style={{ background: style.bg }}>
        <Icon size={20} color={style.fg} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 653, fontFamily: "var(--font-display)", marginBottom: 4, color: "var(--color-ink)" }}>{group.label}</div>
      <div style={{ fontSize: 13, color: "var(--color-faint)" }}>{count} components</div>
    </button>
  );
}

export function HomePage({ navigate }) {
  const NAV = store.NAV;
  const [site, setSite] = useState(null);
  useEffect(() => {
    fetchMarkdown("./content/site.md").then((d) => setSite(d.meta));
  }, []);
  if (!site)
    return (
      <div style={{ padding: 60 }}>
        <LoadingRow />
      </div>
    );

  return (
    <div>
      <Header onNavigate={navigate} />
      <section style={{ position: "relative", padding: "96px 64px 80px", maxWidth: 1100, margin: "0 auto", overflow: "hidden" }}>
        <div className="apy-hero-accent-shape" style={{ width: 420, height: 420, background: "var(--color-accent)", top: -180, right: -120 }} />
        <div className="apy-hero-accent-shape" style={{ width: 300, height: 300, background: "#F59E0B", top: 120, left: -140 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 112px)", fontWeight: 700, lineHeight: 1.03, letterSpacing: "-0.02em", color: "var(--color-ink)", margin: "0 0 32px", fontFamily: "var(--font-display)" }}>
            {site.heroHeadingLine1}
            <br />
            <span style={{ color: "var(--color-accent)" }}>{site.heroHeadingLine2}</span>
          </h1>
          <p style={{ fontSize: 20, color: "var(--color-body)", lineHeight: 1.6, maxWidth: 480, marginBottom: 40 }}>{site.heroTagline}</p>
          <button className="apy-btn-primary apy-btn-hero" onClick={() => navigate({ kind: "getstarted", ref: "what-is-apiary" })}>
            {site.heroCtaLabel}
          </button>
        </div>
      </section>

      <section style={{ padding: "0 64px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 68, fontWeight: 700, lineHeight: "72px", letterSpacing: "-0.02em", fontFamily: "var(--font-display)", marginBottom: 32, color: "var(--color-ink)" }}>{site.exploreHeading}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {NAV.componentGroups.map((g) => {
            const count = NAV.components.filter((c) => c.groupKey === g.key).length;
            const first = NAV.components.find((c) => c.groupKey === g.key);
            return <CategoryCard key={g.key} group={g} count={count} onClick={() => first && navigate({ kind: "component", ref: first })} />;
          })}
        </div>
      </section>
    </div>
  );
}
