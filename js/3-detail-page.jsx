// Fetches everything for one component: real specs (JSON) + real
// documentation (markdown, versioned). Edit either file in the repo and
// this reflects it on next load — no code change needed.
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

function ComponentTabsBody({ id, name }) {
  const versions = MANIFEST.components[id] || ["v1"];
  const [version, setVersion] = useState(versions[versions.length - 1]);
  const { specs, doc, error } = useComponentContent(id, version);
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Guidelines", "Specs", "QA Notes"];

  if (error) return <div style={{ padding: 40, color: "#DC2626" }}>Failed to load real content: {error}</div>;
  if (!specs || !doc) return <div style={{ padding: 40 }}><LoadingRow /></div>;

  const headline = specs.summary ? specs.summary.split(/(?<=\.)\s+/)[0] : "";

  return (
    <div>
      <div style={{ padding: "16px 40px 0" }}>
        <div style={{ maxWidth: CONTENT_MAX, margin: "0 auto", display: "flex", justifyContent: "flex-end" }}>
          <VersionPicker versions={versions} active={version} onChange={setVersion} />
        </div>
      </div>
      <TabStrip tabs={tabs} active={tab} onChange={setTab} />
      <div style={{ padding: "0 40px" }}>
        <div style={{ display: "flex", maxWidth: CONTENT_MAX, margin: "0 auto" }}>
          <div style={{ flex: 1, padding: "28px 0", maxWidth: 720 }}>
            {tab === "Overview" && (
              <Section id="preview" title="Preview">
                <p style={{ fontSize: 14, color: BODY, marginBottom: 14 }}>{headline}</p>
                <ComponentPreview item={specs} />
                <p style={{ fontSize: 12, color: FAINT, marginTop: 10 }}>Source: {specs.source}</p>
              </Section>
            )}
            {tab === "Guidelines" && (
              <Section id="guidelines" title="Real documentation">
                <MarkdownBody html={doc.html} />
              </Section>
            )}
            {tab === "Specs" && (
              <Section id="specs" title="Real values">
                <div style={{ fontSize: 12, color: FAINT, marginBottom: 12 }}>Variants: {specs.variantsRaw}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {specs.tokenFindings.map((f, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, border: `1px solid ${LINE}`, borderRadius: 6, padding: "8px 12px" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.field}</div>
                        {f.value && <div style={{ fontSize: 12, color: BODY, fontFamily: "monospace", marginTop: 2 }}>{f.value}</div>}
                        {f.note && <div style={{ fontSize: 12, color: f.unconfirmed ? AMBER[600] : FAINT, marginTop: 2 }}>{f.note}</div>}
                      </div>
                      {f.unconfirmed && <span style={{ fontSize: 11, fontWeight: 600, color: AMBER[600], background: AMBER[50], padding: "2px 7px", borderRadius: 3, height: "fit-content", whiteSpace: "nowrap" }}>unconfirmed</span>}
                    </div>
                  ))}
                </div>
              </Section>
            )}
            {tab === "QA Notes" && (
              <Section id="usage" title="Flags found in code">
                {specs.capturedNotes.length === 0 ? (
                  <p style={{ fontSize: 13, color: FAINT, fontStyle: "italic" }}>Nothing flagged — no real inconsistencies found in the exported code.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {specs.capturedNotes.map((n, i) => (
                      <div key={i} style={{ borderLeft: `3px solid ${ACCENT}`, background: ACCENT_TINT, padding: "10px 14px", fontSize: 13, lineHeight: 1.6 }}>{n}</div>
                    ))}
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
      <ComponentTabsBody id={id} name={name} />
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
      <div style={{ padding: "16px 40px 0", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: "flex", gap: 8, maxWidth: CONTENT_MAX, margin: "0 auto", flexWrap: "wrap" }}>
          {family.members.map((id) => (
            <button key={id} onClick={() => setSelectedId(id)} style={{ background: selectedId === id ? ACCENT : "none", color: selectedId === id ? "#fff" : BODY, border: `1px solid ${selectedId === id ? ACCENT : LINE}`, borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}>
              {names[id] || id}
            </button>
          ))}
        </div>
      </div>
      <ComponentTabsBody id={selectedId} name={names[selectedId] || selectedId} />
    </div>
  );
}
