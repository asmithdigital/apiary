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
  const labels = { stable: "Stable", new: "New", updated: "Updated", "in-development": "In development", deprecated: "Deprecated" };
  return <span className={"apy-status apy-status-" + key}>{labels[key] || status}</span>;
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
  return { specs, doc, error };
}

function ComponentTabsBody({ id, version }) {
  const { specs, doc, error } = useComponentContent(id, version);
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Guidelines", "Specs", "QA Notes"];

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
                <div className="apy-example-card">
                  <ComponentPreview item={specs} />
                </div>
                {doc.meta.image && (
                  <div style={{ marginTop: 16 }}>
                    <div className="apy-eyebrow" style={{ marginBottom: 8 }}>Image asset — content/components/{id}/{doc.meta.image}</div>
                    <img src={`./content/components/${id}/${doc.meta.image}`} alt={`${specs.name} preview`} style={{ display: "block", border: "1px solid var(--color-line)", borderRadius: 8 }} />
                    <p style={{ fontSize: 12, color: "var(--color-faint)", marginTop: 6 }}>Auto-generated from real specs, not a Figma export — drop a real SVG export in at this exact path/filename to replace it.</p>
                  </div>
                )}
              </Section>
            )}
            {tab === "Guidelines" && (
              <Section id="guidelines">
                <MarkdownBody html={doc.html} />
              </Section>
            )}
            {tab === "Specs" && (
              <Section id="specs">
                <div className="apy-eyebrow">Real captured values — {specs.variantsRaw}</div>
                <div className="apy-spec-card">
                  <table className="apy-spec-table">
                    <thead><tr><th>Property</th><th>Value</th></tr></thead>
                    <tbody>
                      {specs.tokenFindings.map((f, i) => (
                        <tr key={i}>
                          <td className="apy-spec-property">{f.field}</td>
                          <td>
                            {f.value && <div className="apy-spec-value">{f.value}</div>}
                            {f.note && <div className="apy-spec-note">{f.note}</div>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}
            {tab === "QA Notes" && (
              <Section id="usage">
                <div className="apy-eyebrow">Flags found in the real code</div>
                {specs.capturedNotes.length === 0 ? (
                  <p style={{ fontSize: 15, color: "var(--color-faint)", fontStyle: "italic" }}>Nothing flagged — no real inconsistencies found in the exported code.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {specs.capturedNotes.map((n, i) => <div key={i} className="apy-note-box">{n}</div>)}
                  </div>
                )}
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
  useEffect(() => {
    fetchMarkdown(`./content/components/${id}/${version}.md`).then((d) => setStatus(d.meta.status || "stable"));
  }, [id, version]);

  return (
    <div>
      <div className="apy-gray-band">
        <div className="apy-gray-band-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div className="apy-gray-band-title-row">
            <h1>{name}</h1>
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
