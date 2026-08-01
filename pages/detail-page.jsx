/* =============================================================================
   PAGE: detail-page — a single component's page (Overview/Guidelines/Specs/
   QA Notes), and the family-grouped version for related variants.
============================================================================= */
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

function ComponentTabsBody({ id }) {
  const versions = MANIFEST.components[id] || ["v1"];
  const [version, setVersion] = useState(versions[versions.length - 1]);
  const { specs, doc, error } = useComponentContent(id, version);
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Guidelines", "Specs", "QA Notes"];

  if (error) return <div style={{ padding: 40, color: "var(--color-danger-text)" }}>Failed to load real content: {error}</div>;
  if (!specs || !doc) return <div style={{ padding: 40 }}><LoadingRow /></div>;

  const headline = specs.summary ? specs.summary.split(/(?<=\.)\s+/)[0] : "";

  return (
    <div>
      <div className="apy-content-col" style={{ paddingTop: 16, paddingBottom: 0 }}>
        <div className="apy-content-col-inner" style={{ justifyContent: "flex-end" }}>
          <VersionPicker versions={versions} active={version} onChange={setVersion} />
        </div>
      </div>
      <TabStrip tabs={tabs} active={tab} onChange={setTab} />
      <div className="apy-content-col">
        <div className="apy-content-col-inner">
          <div className="apy-content-main">
            {tab === "Overview" && (
              <Section id="preview" title="Preview">
                <p style={{ fontSize: 16, color: "var(--color-body)", marginBottom: 14 }}>{headline}</p>
                <ComponentPreview item={specs} />
                <p style={{ fontSize: 13, color: "var(--color-faint)", marginTop: 10 }}>Source: {specs.source}</p>
              </Section>
            )}
            {tab === "Guidelines" && (
              <Section id="guidelines" title="Real documentation">
                <MarkdownBody html={doc.html} />
              </Section>
            )}
            {tab === "Specs" && (
              <Section id="specs" title="Real values">
                <div style={{ fontSize: 13, color: "var(--color-faint)", marginBottom: 12 }}>Variants: {specs.variantsRaw}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {specs.tokenFindings.map((f, i) => (
                    <div key={i} className="apy-spec-row">
                      <div>
                        <div className="apy-spec-field">{f.field}</div>
                        {f.value && <div className="apy-spec-value">{f.value}</div>}
                        {f.note && <div style={{ fontSize: 13, color: f.unconfirmed ? "var(--color-warn-text)" : "var(--color-faint)", marginTop: 2 }}>{f.note}</div>}
                      </div>
                      {f.unconfirmed && <span className="apy-spec-unconfirmed">unconfirmed</span>}
                    </div>
                  ))}
                </div>
              </Section>
            )}
            {tab === "QA Notes" && (
              <Section id="usage" title="Flags found in code">
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
  return (
    <div>
      <GrayBand title={name} extra={<RealTag />} />
      <ComponentTabsBody id={id} />
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
  return (
    <div>
      <GrayBand title={family.label} description={`${family.members.length} real variants grouped on one page.`} extra={<RealTag />} />
      <div className="apy-content-col" style={{ paddingTop: 16, paddingBottom: 0, borderBottom: "1px solid var(--color-line)" }}>
        <div className="apy-content-col-inner" style={{ flexWrap: "wrap", gap: 8 }}>
          {family.members.map((id) => (
            <button key={id} onClick={() => setSelectedId(id)} className={"apy-pill" + (selectedId === id ? " active" : "")}>
              {names[id] || id}
            </button>
          ))}
        </div>
      </div>
      <ComponentTabsBody id={selectedId} />
    </div>
  );
}
