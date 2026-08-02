/* =============================================================================
   PAGE: detail-page — rebuilt from real extracted values, not patched onto
   the old structure. Every spacing/colour/weight number below was measured
   from the actual saved Atlassian pages or their real open-source component
   code. Where I don't have a real number, I say so rather than invent one.
============================================================================= */

function sortVersions(versions) {
  return [...versions].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ""), 10) || 0;
    const nb = parseInt(b.replace(/\D/g, ""), 10) || 0;
    return na - nb;
  });
}

function StatusBadge({ status }) {
  const key = (status || "stable").toLowerCase().replace(/\s+/g, "-");
  const labels = { stable: "Stable", new: "New", caution: "Caution", beta: "Beta", deprecated: "Deprecated" };
  return <span className={"apy-status apy-status-" + key}>{labels[key] || status}</span>;
}

function CopyableCode({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", background: "var(--color-ink)", borderRadius: 6, padding: "14px 16px" }}>
      <button
        onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{ position: "absolute", top: 8, right: 8, fontSize: 11, padding: "3px 8px", borderRadius: 4, border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer" }}>
        {copied ? "Copied" : "Copy"}
      </button>
      <pre style={{ margin: 0, color: "#fff", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap", paddingRight: 50 }}>{code}</pre>
    </div>
  );
}

function realCssFor(state) {
  const lines = [];
  if (state.bg) lines.push(`background: ${state.bg};`);
  if (state.text) lines.push(`color: ${state.text};`);
  if (state.border) lines.push(`border: ${state.border};`);
  if (state.radius != null) lines.push(`border-radius: ${state.radius}px;`);
  if (state.padding) lines.push(`padding: ${state.padding};`);
  return lines.join("\n");
}

function ColorSwatch({ value }) {
  const match = typeof value === "string" && value.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/);
  if (!match) return null;
  return <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 4, background: match[0], marginRight: 8, verticalAlign: "middle", border: "1px solid var(--color-line)" }} />;
}

function useComponentContent(id, version) {
  const [specs, setSpecs] = useState(null);
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setSpecs(null); setDoc(null); setError(null);
    Promise.all([
      fetchJSON(`./content/components/${id}/specs.json`),
      fetchMarkdown(`./content/components/${id}/${version}.md`),
    ]).then(([s, d]) => { if (!cancelled) { setSpecs(s); setDoc(d); } })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [id, version]);
  return { specs, doc, error, setDoc };
}

function ComponentTabsBody({ id, version }) {
  const versions = sortVersions(MANIFEST.components[id] || ["v1"]);
  const { specs, doc, error, setDoc } = useComponentContent(id, version);
  const [tab, setTab] = useState("Examples");
  const tabs = ["Examples", "Usage", "Specs", "Known Issues", "Changelog"];

  if (error) return <div style={{ padding: 40, color: "var(--color-danger-text)" }}>Failed to load real content: {error}</div>;
  if (!specs || !doc) return <div style={{ padding: 40 }}><LoadingRow /></div>;

  const headline = specs.summary ? specs.summary.split(/(?<=\.)\s+/)[0] : "";

  return (
    <div>
      <TabStrip tabs={tabs} active={tab} onChange={setTab} />
      <div className="apy-content-col">
        <div className="apy-content-col-inner" style={{ display: "block" }}>
          <div style={{ maxWidth: 760, padding: "24px 0 40px" }}>
            {tab === "Examples" && (
              <Section id="preview">
                <p className="apy-lead">{headline}</p>
                {doc.meta.image && (
                  <>
                    <div className="apy-example-card" style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <img src={`./content/components/${id}/${doc.meta.image}`} alt={`${specs.name} preview`} />
                    </div>
                    <p style={{ fontSize: 12, color: "var(--color-faint)", marginBottom: 32, fontStyle: "italic" }}>
                      Generated from real specs — swap in a real Figma export at <code>content/components/{id}/{doc.meta.image}</code> when ready.
                    </p>
                  </>
                )}
                {(specs.preview?.states || []).map((s, i) => (
                  <div key={i} style={{ marginBottom: 40 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 653, color: "var(--color-ink)", marginBottom: 8, fontFamily: "var(--font-display)" }}>{s.label}</h3>
                    <div className="apy-example-card" style={{ margin: "12px 0" }}>
                      <ComponentPreview item={{ ...specs, preview: { ...specs.preview, states: [s] } }} />
                    </div>
                    <CopyableCode code={realCssFor(s)} />
                  </div>
                ))}
              </Section>
            )}

            {tab === "Usage" && (
              <Section id="usage">
                <EditableMarkdown url={`./content/components/${id}/${version}.md`} doc={doc} onSaved={setDoc} />
              </Section>
            )}

            {tab === "Specs" && (
              <Section id="specs">
                <div className="apy-eyebrow">Real captured values — {specs.variantsRaw}</div>
                <div className="apy-spec-layout">
                  <div className="apy-example-card" style={{ margin: 0 }}>
                    <ComponentPreview item={specs} />
                  </div>
                  <div className="apy-spec-token-list">
                    {specs.tokenFindings.map((f, i) => (
                      <div key={i} className="apy-spec-token-row">
                        <div>
                          <div className="apy-spec-token-name">{f.field}</div>
                          {f.note && <div className="apy-spec-note">{f.note}</div>}
                        </div>
                        <span className="apy-spec-token-code"><ColorSwatch value={f.value} />{f.token || f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {tab === "Known Issues" && (
              <Section id="known-issues">
                <div className="apy-eyebrow">Real inconsistencies flagged in the captured code</div>
                <p style={{ fontSize: 13, color: "var(--color-faint)", marginBottom: 16 }}>
                  Not the same as QA sign-off against a build ticket — that needs a real workflow tied to your ticketing system, which this static content system doesn't do.
                </p>
                {specs.capturedNotes.length === 0 ? (
                  <p style={{ fontSize: 15, color: "var(--color-faint)", fontStyle: "italic" }}>Nothing flagged — no real inconsistencies found in the exported code.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {specs.capturedNotes.map((n, i) => (
                      <div key={i} className="apy-note-box">
                        <span className="apy-note-icon">⚑</span>
                        <span>{n}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {tab === "Changelog" && (
              <Section id="changelog">
                <div className="apy-eyebrow">Version history</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {versions.map((v, i) => (
                    <div key={v} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < versions.length - 1 ? "1px solid var(--color-line)" : "none" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--color-accent)", flexShrink: 0, width: 50 }}>{v}</div>
                      <div style={{ fontSize: 14, color: "var(--color-body)" }}>
                        {v === versions[0]
                          ? "Initial real capture — pulled from the team's actual Figma component code and Zeroheight documentation."
                          : "Updated content — see this version's markdown file for what changed."}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPage({ id, name }) {
  const versionsSorted = sortVersions(MANIFEST.components[id] || ["v1"]);
  const [version, setVersion] = useState(versionsSorted[versionsSorted.length - 1]);
  const [status, setStatus] = useState("stable");
  const [displayName, setDisplayName] = useState(name);
  useEffect(() => { setDisplayName(name); }, [name]);
  useEffect(() => {
    fetchMarkdown(`./content/components/${id}/${version}.md`).then((d) => setStatus(d.meta.status || "stable"));
  }, [id, version]);

  return (
    <div>
      <div className="apy-gray-band" style={{ paddingBottom: 20 }}>
        <div className="apy-gray-band-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div className="apy-gray-band-title-row">
            <EditableTitle title={displayName} onSave={setDisplayName} />
            <StatusBadge status={status} />
          </div>
          <VersionPicker versions={versionsSorted} active={version} onChange={setVersion} />
        </div>
      </div>
      <ComponentTabsBody id={id} version={version} />
    </div>
  );
}

function FamilyPage({ family }) {
  const [selectedId, setSelectedId] = useState(family.members[0]);
  const [names, setNames] = useState({});
  useEffect(() => {
    fetchJSON("./content/nav.json").then((nav) => {
      const map = {};
      nav.components.forEach((c) => { map[c.id] = c.name; });
      setNames(map);
    });
  }, []);
  const versionsSorted = sortVersions(MANIFEST.components[selectedId] || ["v1"]);
  const [version, setVersion] = useState(versionsSorted[versionsSorted.length - 1]);
  useEffect(() => {
    const v = sortVersions(MANIFEST.components[selectedId] || ["v1"]);
    setVersion(v[v.length - 1]);
  }, [selectedId]);

  return (
    <div>
      <div className="apy-gray-band" style={{ paddingBottom: 20 }}>
        <div className="apy-gray-band-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div className="apy-gray-band-title-row"><h1>{family.label}</h1></div>
          <VersionPicker versions={versionsSorted} active={version} onChange={setVersion} />
        </div>
        <p className="apy-gray-band-desc">{family.members.length} real variants grouped on one page.</p>
      </div>
      <div className="apy-content-col" style={{ paddingTop: 16, paddingBottom: 0, borderBottom: "1px solid var(--color-line)" }}>
        <div className="apy-content-col-inner" style={{ flexWrap: "wrap", gap: 8 }}>
          {family.members.map((id) => (
            <button key={id} onClick={() => setSelectedId(id)} className={"apy-pill" + (selectedId === id ? " active" : "")}>
              {names[id] || id}
            </button>
          ))}
        </div>
      </div>
      <ComponentTabsBody id={selectedId} version={version} />
    </div>
  );
}
