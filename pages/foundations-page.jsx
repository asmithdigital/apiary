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
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-ink)" }}>{ramp.label}</div>
          {ramp.note && <div style={{ fontSize: 14, color: "var(--color-warn-text)", marginBottom: 8 }}>⚠ {ramp.note}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: 8 }}>
            {ramp.steps.map((s, i) => (
              <div key={i} style={{ border: `1px solid var(--color-line)`, borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                <div style={{ height: 56, background: s.hex }} />
                <div style={{ padding: "6px 8px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.step}</div>
                  <div style={{ fontSize: 12, color: "var(--color-faint)", fontFamily: "var(--font-mono)" }}>{s.hex}</div>
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
    <div style={{ border: `1px solid var(--color-line)`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", padding: "8px 14px", background: "var(--color-band)", fontSize: 13, fontWeight: 700, color: "var(--color-faint)", textTransform: "uppercase" }}>
        <span>Pixel value</span><span>Token name</span><span>Description</span>
      </div>
      {data.SPACING_SCALE.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", padding: "10px 14px", borderTop: `1px solid var(--color-line)`, fontSize: 15 }}>
          <span style={{ fontWeight: 600 }}>{s.px}</span><span style={{ fontFamily: "monospace", color: "var(--color-faint)" }}>{s.token}</span><span style={{ color: "var(--color-body)" }}>{s.desc}</span>
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
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-faint)", textTransform: "uppercase", marginBottom: 8 }}>{w.weight}</div>
          {w.sizes.map((sz, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: sz.s, fontWeight: w.weight === "Regular" ? 400 : w.weight === "Medium" ? 500 : w.weight === "Bold" ? 700 : 800 }}>Aa</span>
              <span style={{ fontSize: 13, color: "var(--color-faint)", fontFamily: "monospace" }}>{sz.s}px / {sz.l}px line-height</span>
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
        <div key={i} style={{ width: 100, height: 80, borderRadius: 8, background: "#fff", boxShadow: e.shadow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--color-faint)" }}>{e.name}</div>
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
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: `1px solid var(--color-line)`, borderRadius: 6, padding: 10 }}>
            <Icon size={20} />
            <span style={{ fontSize: 12, color: "var(--color-faint)", textAlign: "center" }}>{name}</span>
          </div>
        );
      })}
    </div>
  );
}

function TokensPage() {
  const [tokens, setTokens] = useState(null);
  useEffect(() => { fetchJSON("./content/tokens.json").then(setTokens); }, []);
  if (!tokens) return <div style={{ padding: 40 }}><LoadingRow /></div>;
  return (
    <div>
      {tokens._meta?.note && (
        <div style={{ borderLeft: "3px solid var(--color-warn-border)", background: "var(--color-warn-bg)", padding: "12px 16px", fontSize: 14, color: "var(--color-body)", lineHeight: 1.6, marginBottom: 24, borderRadius: "0 8px 8px 0" }}>
          <strong style={{ color: "var(--color-warn-text)" }}>PROVISIONAL — </strong>{tokens._meta.note}
        </div>
      )}
      {Object.entries(tokens).filter(([k]) => k !== "_meta").map(([category, entries]) => (
        <div key={category} style={{ marginBottom: 28 }}>
          <div className="apy-eyebrow">{category}</div>
          <div className="apy-spec-card">
            <table className="apy-spec-table">
              <thead><tr><th>Token</th><th>Value</th><th>Confirmed?</th></tr></thead>
              <tbody>
                {Object.entries(entries).map(([name, t]) => (
                  <tr key={name}>
                    <td className="apy-spec-property">{name}</td>
                    <td>
                      <span className="apy-spec-value">{t.value}</span>
                      {/^#|rgba?\(/.test(t.value) && <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: t.value, marginLeft: 8, verticalAlign: "middle", border: "1px solid var(--color-line)" }} />}
                    </td>
                    <td style={{ fontSize: 13, color: t.confirmed ? "var(--color-success-text)" : "var(--color-warn-text)" }}>{t.confirmed ? "Yes — real" : "Provisional"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

const FOUNDATION_DATA_RENDERERS = { colour: ColourData, spacing: SpacingData, typography: TypographyData, elevation: ElevationData, icons: IconsData };

function FoundationsPage({ foundationKey, foundationLabel }) {
  const [doc, setDoc] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(foundationLabel);
  useEffect(() => { setDisplayLabel(foundationLabel); }, [foundationLabel]);
  useEffect(() => {
    let cancelled = false;
    setDoc(null); setData(null); setError(null);
    Promise.all([
      fetchMarkdown(`./content/foundations/${foundationKey}/v1.md`),
      fetchJSON(`./content/foundations/${foundationKey}/data.json`).catch(() => ({})),
    ]).then(([d, dt]) => { if (!cancelled) { setDoc(d); setData(dt); } })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [foundationKey]);

  if (error) return <div style={{ padding: 40, color: "var(--color-danger-text)" }}>Failed to load this foundation: {error}</div>;
  if (!doc || !data) return <div style={{ padding: 40 }}><LoadingRow /></div>;
  const DataRenderer = FOUNDATION_DATA_RENDERERS[foundationKey];

  return (
    <div>
      <GrayBand title={displayLabel} extra={<FoundationTag />} description={foundationKey === "design-tokens" ? "The real source of truth — edit content/tokens.json and every value here (and eventually every component spec) updates." : "Colour, spacing, elevation, and typography carry real captured or documented values."} onTitleSave={setDisplayLabel} />
      <div className="apy-content-col" style={{ paddingTop: 28, paddingBottom: 28 }}>
        <div className="apy-content-col-inner" style={{ gap: 40 }}>
          <div style={{ flex: 1, maxWidth: 700 }}>
            {foundationKey === "design-tokens" ? <TokensPage /> : <>
            <EditableMarkdown url={`./content/foundations/${foundationKey}/v1.md`} doc={doc} onSaved={setDoc} />
            {DataRenderer && <div style={{ marginTop: 24 }}><DataRenderer data={data} /></div>}
            </>}
          </div>
          <div style={{ width: 240, flexShrink: 0 }}>
            <div className="apy-caption-card">
              <div className="apy-eyebrow" style={{ marginBottom: 10 }}>On this page</div>
              <PageOutline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
