const ICON_LOOKUP = {
  star: LucideIcons.Star, "dollar-sign": LucideIcons.DollarSign, times: LucideIcons.XIcon,
  check: LucideIcons.Check, plus: LucideIcons.Plus, minus: LucideIcons.Minus,
  "angle-left": LucideIcons.ChevronLeft, "angle-right": LucideIcons.ChevronRight,
  "angle-down": LucideIcons.ChevronDown, "calendar-alt": LucideIcons.CalendarIcon,
  "question-circle": LucideIcons.HelpCircle, pencil: LucideIcons.Pencil, trash: LucideIcons.Trash2,
  "car-crash": LucideIcons.Car, route: LucideIcons.Route, "mobile-alt": LucideIcons.Smartphone,
  bed: LucideIcons.Bed, plane: LucideIcons.Plane, "info-circle": LucideIcons.Info,
  "check-circle": LucideIcons.CheckCircle2, "exclamation-triangle": LucideIcons.AlertTriangle,
  "exclamation-circle": LucideIcons.XCircle, lightbulb: LucideIcons.Lightbulb,
  "spinner-third": LucideIcons.Loader2, bars: LucideIcons.MenuIcon, "ellipsis-h": LucideIcons.MoreHorizontal,
  "web-chat-speech-bubbles": LucideIcons.MessageCircle, "mobile-phone": LucideIcons.Phone,
  "external-link-alt": LucideIcons.ExternalLink,
};

function ColourData({ data }) {
  return (
    <div>
      {data.COLOUR_RAMPS.map((ramp) => (
        <div key={ramp.id} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em", color: SLATE[700] }}>{ramp.label}</div>
          {ramp.note && <div style={{ fontSize: 12, color: AMBER[600], marginBottom: 8 }}>⚠ {ramp.note}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: 8 }}>
            {ramp.steps.map((s, i) => (
              <div key={i} style={{ border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                <div style={{ height: 56, background: s.hex }} />
                <div style={{ padding: "6px 8px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.step}</div>
                  <div style={{ fontSize: 10, color: FAINT, fontFamily: FONT_MONO }}>{s.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacingData({ data }) {
  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", padding: "8px 14px", background: BAND, fontSize: 11, fontWeight: 700, color: FAINT, textTransform: "uppercase" }}>
        <span>Pixel value</span><span>Token name</span><span>Description</span>
      </div>
      {data.SPACING_SCALE.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", padding: "10px 14px", borderTop: `1px solid ${LINE}`, fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{s.px}</span><span style={{ fontFamily: "monospace", color: FAINT }}>{s.token}</span><span style={{ color: BODY }}>{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function TypographyData({ data }) {
  return (
    <div>
      {data.TYPESCALE.map((w) => (
        <div key={w.weight} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: FAINT, textTransform: "uppercase", marginBottom: 8 }}>{w.weight}</div>
          {w.sizes.map((sz, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: sz.s, fontWeight: w.weight === "Regular" ? 400 : w.weight === "Medium" ? 500 : w.weight === "Bold" ? 700 : 800 }}>Aa</span>
              <span style={{ fontSize: 11, color: FAINT, fontFamily: "monospace" }}>{sz.s}px / {sz.l}px line-height</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ElevationData({ data }) {
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {data.ELEVATION.map((e, i) => (
        <div key={i} style={{ width: 100, height: 80, borderRadius: 8, background: "#fff", boxShadow: e.shadow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: FAINT }}>{e.name}</div>
      ))}
    </div>
  );
}

function IconsData({ data }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
      {data.ICONS_REFERENCED.map((name, i) => {
        const Icon = ICON_LOOKUP[name] || LucideIcons.HelpCircle;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: `1px solid ${LINE}`, borderRadius: 6, padding: 10 }}>
            <Icon size={20} />
            <span style={{ fontSize: 10, color: FAINT, textAlign: "center" }}>{name}</span>
          </div>
        );
      })}
    </div>
  );
}

const FOUNDATION_DATA_RENDERERS = { colour: ColourData, spacing: SpacingData, typography: TypographyData, elevation: ElevationData, icons: IconsData };

function FoundationsPage({ foundationKey, foundationLabel }) {
  const [doc, setDoc] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setDoc(null); setData(null);
    Promise.all([
      fetchMarkdown(`./content/foundations/${foundationKey}/v1.md`),
      fetchJSON(`./content/foundations/${foundationKey}/data.json`),
    ]).then(([d, dt]) => { if (!cancelled) { setDoc(d); setData(dt); } });
    return () => { cancelled = true; };
  }, [foundationKey]);

  if (!doc || !data) return <div style={{ padding: 40 }}><LoadingRow /></div>;
  const DataRenderer = FOUNDATION_DATA_RENDERERS[foundationKey];

  return (
    <div>
      <GrayBand title={foundationLabel} extra={<FoundationTag />} description="Colour, spacing, elevation, and typography carry real captured or documented values; Accessibility and Design Tokens are the team's real narrative pages, not yet backed by live tokens." />
      <div style={{ padding: "28px 40px", maxWidth: CONTENT_MAX, margin: "0 auto" }}>
        <MarkdownBody html={doc.html} />
        {DataRenderer && <div style={{ marginTop: 24 }}><DataRenderer data={data} /></div>}
      </div>
    </div>
  );
}
