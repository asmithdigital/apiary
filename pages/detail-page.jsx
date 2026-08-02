/* =============================================================================
   PAGE: detail-page — a single component's page (Overview/Guidelines/Specs/
   QA Notes), and the family-grouped version for related variants.
============================================================================= */

// manifest.json's array order isn't trustworthy for "which version is
// latest" once you pass v9 — plain string sort puts "v10" before "v2".
// This sorts by the actual number in the version name instead.
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

function CaptionedStateGrid({ item }) {
  const states = item.preview?.states || [];
  if (states.length < 2) return null;
  return (
    <div className="apy-caption-grid">
      {states.map((s, i) => (
        <div key={i} className="apy-caption-card">
          <div className="apy-caption-card-example">
            <ComponentPreview item={{ ...item, preview: { ...item.preview, states: [s] } }} />
          </div>
          <div className="apy-caption-card-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
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
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Guidelines", "Specs", "Known Issues", "Changelog"];

  if (error) return <div style={{ padding: 40, color: "var(--color-danger-text)" }}>Failed to load real content: {error}</div>;
  if (!specs || !doc) return <div style={{ padding: 40 }}><LoadingRow /></div>;

  const headline = specs.summary ? specs.summary.split(/(?<=\.)\s+/)[0] : "";

  return (
    <div>
      <TabStrip tabs={tabs} active={tab} onChange={setTab} />
      <div className="apy-content-col">
        <div className="apy-content-col-inner" style={{ display: "block" }}>
          <div style={{ maxWidth: 760, padding: "28px 0" }}>
            {tab === "Overview" && (
              <Section id="preview">
                <div className="apy-eyebrow">Preview</div>
                <p className="apy-lead">{headline}</p>
                <div className="apy-example-card" style={{ display: "flex", justifyContent: "center" }}>
                  {doc.meta.image ? (
                    <img src={`./content/components/${id}/${doc.meta.image}`} alt={`${specs.name} preview`} />
                  ) : (
                    <ComponentPreview item={specs} />
                  )}
                </div>
                {doc.meta.image && (
                  <p style={{ fontSize: 12, color: "var(--color-faint)", marginTop: 10, fontStyle: "italic" }}>
                    Generated from real specs — swap in a real Figma export at <code>content/components/{id}/{doc.meta.image}</code> when ready.
                  </p>
                )}
                {specs.preview?.states?.length > 1 && (
                  <div style={{ marginTop: 28 }}>
                    <div className="apy-eyebrow">Real states</div>
                    <CaptionedStateGrid item={specs} />
                  </div>
                )}
              </Section>
            )}
            {tab === "Guidelines" && (
              <Section id="guidelines">
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
              <Section id="usage">
                <div className="apy-eyebrow">Real inconsistencies flagged in the captured code</div>
                <p style={{ fontSize: 13, color: "var(--color-faint)", marginBottom: 16 }}>
                  Not the same as QA sign-off against a build ticket — that needs a real workflow tied to your ticketing system, which this static content system doesn't do. This is specifically what the real code capture itself flagged as inconsistent.
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
                          ? "Initial real capture — pulled from the team's actual Figma component code and Zeroheight documentation, not written from memory."
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
      <div className="apy-gray-band">
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
      <div className="apy-gray-band">
        <div className="apy-gray-band-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div className="apy-gray-band-title-row">
            <h1>{family.label}</h1>
          </div>
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
