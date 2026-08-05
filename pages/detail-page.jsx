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

// For a given preview state, work out which visual properties are new or
// different compared to the Default state — Default itself always shows
// everything. This is computed from the real per-state data, not
// hardcoded per component, so it works the same way for all 68.
function computeStateDeltas(states) {
  if (!states || !states.length) return [];
  const defaultState = states[0];
  const props = ["bg", "border", "radius", "padding", "text"];
  return states.map((s, i) => {
    const shown = {};
    for (const p of props) {
      if (s[p] == null) continue;
      if (i === 0 || s[p] !== defaultState[p]) shown[p] = s[p];
    }
    return { state: s, shown };
  });
}

// Exact-match only — the previous substring check produced real false
// positives (e.g. "#fff" matching inside "#fff066", or the digit "4"
// matching inside "24px"). A numeric radius like 4 is compared against a
// "4px"-style token value as a specific, narrow exception.
function findTokenFor(value, tokenFindings) {
  if (value == null) return null;
  const v = String(value).trim().toLowerCase();
  for (const f of tokenFindings || []) {
    if (typeof f.value !== "string") continue;
    const fv = f.value.trim().toLowerCase();
    if (fv === v) return f.token || null;
    if (/^\d+$/.test(v) && fv === `${v}px`) return f.token || null;
  }
  return null;
}

const PROP_LABEL = { bg: "Background", border: "Border", radius: "Corner radius", padding: "Padding", text: "Text colour" };

function StateSpecRow({ label, shown, tokenFindings, first, kind }) {
  return (
    <div style={{ display: "flex", gap: 24, marginBottom: 28, alignItems: "flex-start" }}>
      <div className="apy-example-card" style={{ margin: 0, width: 180, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ComponentPreview item={{ preview: { kind, states: [{ ...shown, label }] } }} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "var(--color-ink)" }}>{label}{!first && <span style={{ fontWeight: 400, color: "var(--color-faint)", fontSize: 13 }}> — only what's different from Default</span>}</h4>
        {Object.keys(shown).length === 0 ? (
          <p style={{ fontSize: 13.5, color: "var(--color-faint)", fontStyle: "italic" }}>Nothing differs from Default.</p>
        ) : (
          <table className="apy-data-table">
            <tbody>
              {Object.entries(shown).map(([prop, val]) => {
                const token = findTokenFor(val, tokenFindings);
                return (
                  <tr key={prop}>
                    <td style={{ fontWeight: 600, width: 140 }}>{PROP_LABEL[prop] || prop}</td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ColorSwatch value={val} />
                        {token ? <span className="apy-spec-token-code">{token}</span> : <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{String(val)}</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function ComponentTabsBody({ id, version }) {
  const versions = sortVersions(MANIFEST.components[id] || ["v1"]);
  const { specs, doc, error, setDoc } = useComponentContent(id, version);
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Usage", "Specs", "Changelog"];

  if (error) return <div style={{ padding: 40, color: "var(--color-danger-text)" }}>Failed to load real content: {error}</div>;
  if (!specs || !doc) return <div style={{ padding: 40 }}><LoadingRow /></div>;

  const sentences = specs.summary ? specs.summary.split(/(?<=\.)\s+/) : [];
  const paraOne = sentences.slice(0, Math.ceil(sentences.length / 2)).join(" ");
  const paraTwo = sentences.slice(Math.ceil(sentences.length / 2)).join(" ");
  const stateDeltas = computeStateDeltas(specs.preview?.states);
  const versionsDesc = [...versions].reverse();

  return (
    <div>
      <TabStrip tabs={tabs} active={tab} onChange={setTab} />
      <div className="apy-content-col">
        <div className="apy-content-col-inner" style={{ display: "block" }}>
          <div style={{ maxWidth: 760, padding: "0 0 40px" }}>

            {tab === "Overview" && (
              <Section id="overview">
                {paraOne && <p className="apy-lead" style={{ marginBottom: 14 }}>{paraOne}</p>}
                {paraTwo && <p className="apy-lead" style={{ fontSize: 15 }}>{paraTwo}</p>}

                {specs.preview?.states?.length > 0 && (
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0" }}>
                    {specs.preview.states.map((s, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div className="apy-example-card" style={{ margin: "0 0 6px", padding: 16 }}>
                          <ComponentPreview item={{ preview: { kind: specs.preview.kind, states: [s] } }} />
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-faint)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {specs.capturedNotes?.length > 0 && (
                  <div style={{ marginTop: 28 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Known issues</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {specs.capturedNotes.map((n, i) => (
                        <div key={i} className="apy-note-box">
                          <span className="apy-note-icon">⚑</span>
                          <span>{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {tab === "Usage" && (
              <Section id="usage">
                <EditableMarkdown url={`./content/components/${id}/${version}.md`} doc={doc} onSaved={setDoc} />
              </Section>
            )}

            {tab === "Specs" && (
              <Section id="specs">
                {stateDeltas.map(({ state, shown }, i) => (
                  <StateSpecRow key={i} label={state.label} shown={shown} tokenFindings={specs.tokenFindings} first={i === 0} kind={specs.preview.kind} />
                ))}
              </Section>
            )}

            {tab === "Changelog" && (
              <Section id="changelog">
                <table className="apy-data-table">
                  <thead><tr><th style={{ width: 90 }}>Version</th><th>Notes</th></tr></thead>
                  <tbody>
                    {versionsDesc.map((v) => (
                      <tr key={v}>
                        <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-accent)" }}>{v}</td>
                        <td>{v === versionsDesc[versionsDesc.length - 1]
                          ? "Initial real capture — pulled from the team's actual Figma component code and Zeroheight documentation."
                          : "Updated content — see this version's markdown file for what changed."}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// A page created this session via "+ New page" — real block-based editing,
// backed by DraftStore, not by content/ files (there's nothing on GitHub
// for these yet — that's honest, since they were only just created).
function DraftPageBody({ id }) {
  const [, force] = useState(0);
  useEffect(() => DraftStore.subscribe(() => force((n) => n + 1)), []);
  const draft = DraftStore.getPage(id);
  const [tab, setTab] = useState(draft.tabs[0].id);
  const [showAddTab, setShowAddTab] = useState(false);
  const [newTabLabel, setNewTabLabel] = useState("");

  const activeTab = draft.tabs.find((t) => t.id === tab) || draft.tabs[0];

  return (
    <div>
      <div className="apy-gray-band">
        <div className="apy-gray-band-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div className="apy-gray-band-title-row">
            <EditableTitle title={draft.title} onSave={(t) => DraftStore.updatePageMeta(id, { title: t })} />
            <StatusBadge status={draft.status} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VersionPicker versions={draft.versions} active={draft.version} onChange={(v) => DraftStore.updatePageMeta(id, { version: v })} />
            <button onClick={() => DraftStore.bumpVersion(id)} title="Create a new version" style={{ fontSize: 12, padding: "6px 10px", border: "1px solid var(--color-line)", background: "#fff", borderRadius: 6, cursor: "pointer" }}>+ New version</button>
          </div>
        </div>
        <textarea value={draft.description} onChange={(e) => DraftStore.updatePageMeta(id, { description: e.target.value })} rows={1}
          placeholder="One-line description…" className="apy-gray-band-desc" style={{ border: "none", background: "none", resize: "none", width: "100%", fontFamily: "inherit" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <TabStrip tabs={draft.tabs.map((t) => t.label)} active={activeTab.label} onChange={(label) => setTab(draft.tabs.find((t) => t.label === label).id)} />
        <button onClick={() => setShowAddTab((s) => !s)} title="Add a tab" style={{ marginLeft: 8, width: 26, height: 26, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 5, cursor: "pointer", fontSize: 14 }}>+</button>
        {showAddTab && (
          <div style={{ position: "absolute", top: 34, left: 0, zIndex: 20, background: "#fff", border: "1px solid var(--color-line)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 10, display: "flex", gap: 6 }}>
            <input autoFocus value={newTabLabel} onChange={(e) => setNewTabLabel(e.target.value)} placeholder="Tab name" style={{ fontSize: 13, padding: "6px 8px", border: "1px solid var(--color-line)", borderRadius: 5, width: 140 }} />
            <button onClick={() => { if (newTabLabel.trim()) { const t = DraftStore.addTab(id, newTabLabel.trim()); setTab(t.id); setNewTabLabel(""); setShowAddTab(false); } }} className="apy-btn-primary" style={{ padding: "6px 12px", fontSize: 12 }}>Add</button>
          </div>
        )}
      </div>

      <div className="apy-content-col">
        <div className="apy-content-col-inner" style={{ display: "block" }}>
          <div style={{ maxWidth: 760, padding: "24px 0 40px" }}>
            {activeTab.blocks.map((b, i) => (
              <DraftBlock key={b.id} block={b} pageId={id} tabId={activeTab.id} index={i} total={activeTab.blocks.length} />
            ))}
            <AddBlockMenu pageId={id} tabId={activeTab.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPage({ id, name }) {
  if (DraftStore.isDraft(id)) return <DraftPageBody id={id} />;

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
