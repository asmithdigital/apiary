// Real colour + icon per category — genuine visual identity, not a copy of
// anyone's proprietary illustration artwork.
const CATEGORY_STYLE = {
  actions: { icon: "Zap", bg: "#EEF2FF", fg: "#4338CA" },
  forms: { icon: "PenLine", bg: "#ECFDF5", fg: "#047857" },
  feedback: { icon: "AlertCircle", bg: "#FFF7ED", fg: "#C2410C" },
  navigation: { icon: "Compass", bg: "#F5F3FF", fg: "#6D28D9" },
  overlays: { icon: "Layers", bg: "#FDF2F8", fg: "#BE185D" },
  content: { icon: "ImageIcon", bg: "#ECFEFF", fg: "#0E7490" },
  cards: { icon: "LayoutGrid", bg: "#EEF2FF", fg: "#4F46E5" },
  journey: { icon: "Map", bg: "#FEF2F2", fg: "#B91C1C" },
};
window.CATEGORY_STYLE = CATEGORY_STYLE;

const ADD_CATEGORY_ICON_OPTIONS = ["Zap","PenLine","AlertCircle","Compass","Layers","ImageIcon","LayoutGrid","Map","Star","Bell","Bookmark","Box"];
function AddCategoryButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("Star");
  const submit = () => {
    if (!label.trim()) return;
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    CATEGORY_STYLE[key] = { icon, bg: "var(--color-band)", fg: "var(--color-accent)" };
    NAV.componentGroups.push({ key, label: label.trim() });
    onAdd();
    setOpen(false); setLabel("");
  };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="apy-category-card" style={{ borderStyle: "dashed", color: "var(--color-faint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        + Add category
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, zIndex: 20, background: "#fff", border: "1px solid var(--color-line)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 14, width: 260 }}>
          <input autoFocus value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Category name" style={{ width: "100%", fontSize: 13, padding: "7px 9px", border: "1px solid var(--color-line)", borderRadius: 5, marginBottom: 8 }} />
          <select value={icon} onChange={(e) => setIcon(e.target.value)} style={{ width: "100%", fontSize: 13, padding: "7px 9px", border: "1px solid var(--color-line)", borderRadius: 5, marginBottom: 10 }}>
            {ADD_CATEGORY_ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <button onClick={submit} className="apy-btn-primary" style={{ width: "100%", padding: "7px 0", fontSize: 13 }}>Add</button>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ group, count, onClick }) {
  const style = CATEGORY_STYLE[group.key] || { icon: "LayoutGrid", bg: "var(--color-band)", fg: "var(--color-accent)" };
  const Icon = LucideIcons[style.icon] || LucideIcons.LayoutGrid;
  return (
    <button onClick={onClick} className="apy-category-card">
      <div className="apy-category-icon-badge" style={{ background: style.bg }}>
        <Icon size={20} color={style.fg} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)", marginBottom: 4, color: "var(--color-body)" }}>{group.label}</div>
      <div style={{ fontSize: 13, color: "var(--color-faint)" }}>{count} components</div>
    </button>
  );
}

function HomePage({ navigate }) {
  const [site, setSite] = useState(null);
  const [, force] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { fetchMarkdown("./content/site.md").then((d) => setSite(d.meta)); }, []);
  if (!site) return <div style={{ padding: 60 }}><LoadingRow /></div>;

  return (
    <div>
      <Header onNavigate={navigate} onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)} />
      <div className={"apy-sidebar-wrap apy-sidebar-wrap-home" + (mobileMenuOpen ? " apy-sidebar-open" : "")}>
        <Sidebar page={{ kind: "home" }} navigate={(t) => { setMobileMenuOpen(false); navigate(t); }} />
        <div className="apy-mobile-auth-row"><AuthButton /></div>
      </div>
      {mobileMenuOpen && <div className="apy-mobile-scrim" onClick={() => setMobileMenuOpen(false)} />}
      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, var(--color-accent-tint), #fff 70%)" }}>
        <div className="apy-hero-accent-shape" style={{ width: 420, height: 420, background: "var(--color-accent)", top: -180, right: -120 }} />
        <div className="apy-hero-accent-shape" style={{ width: 300, height: 300, background: "#F59E0B", top: 120, left: -140 }} />
        <section style={{ position: "relative", zIndex: 1, padding: "96px 64px 80px", maxWidth: 1300, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 112px)", fontWeight: 700, lineHeight: 1.03, letterSpacing: "normal", color: "var(--color-ink)", margin: "0 0 32px", fontFamily: "var(--font-display)" }}>
            {site.heroHeadingLine1}<br /><span style={{ color: "var(--color-accent)" }}>{site.heroHeadingLine2}</span>
          </h1>
          <p style={{ fontSize: 20, color: "var(--color-ink)", lineHeight: 1.6, maxWidth: 480, marginBottom: 40 }}>
            {site.heroTagline}
          </p>
          <button className="apy-btn-primary apy-btn-hero" onClick={() => navigate({ kind: "getstarted", ref: "what-is-apiary" })}>
            {site.heroCtaLabel}
          </button>
        </section>
      </div>

      <section style={{ padding: "0 64px 80px", maxWidth: 1300, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 653, fontFamily: "var(--font-display)", marginBottom: 24, color: "var(--color-ink)" }}>{site.exploreHeading}</h2>
        <div className="apy-explore-grid">
          {NAV.componentGroups.map((g) => {
            const count = NAV.components.filter((c) => c.groupKey === g.key).length;
            const first = NAV.components.find((c) => c.groupKey === g.key);
            return <CategoryCard key={g.key} group={g} count={count} onClick={() => first && navigate({ kind: "component", ref: first })} />;
          })}
          <AddCategoryButton onAdd={() => force((n) => n + 1)} />
        </div>
      </section>
    </div>
  );
}
