/* =============================================================================
   PARTIAL: sidebar — the whole left-hand menu. Reads content/nav.json for
   everything it shows (Get Started items, Foundations, Components, Families)
   — add an item there, it shows up here automatically. Edit THIS file only
   to change the menu's structure/behaviour; edit css/sidebar.css to restyle it.
============================================================================= */
function familyGroupKey(family) {
  const first = NAV.components.find((c) => c.id === family.members[0]);
  return first ? first.groupKey : "actions";
}
function getFamilyMemberIds() {
  return new Set(NAV.families.flatMap((f) => f.members));
}

function Sidebar({ page, navigate }) {
  const [openGroups, setOpenGroups] = useState({ getStarted: true, foundations: true, actions: true });
  const toggle = (k) => setOpenGroups((o) => ({ ...o, [k]: !o[k] }));

  const getStartedSections = [];
  NAV.getStartedItems.forEach((it) => {
    const sec = it.section || "About";
    let bucket = getStartedSections.find((s) => s.name === sec);
    if (!bucket) { bucket = { name: sec, items: [] }; getStartedSections.push(bucket); }
    bucket.items.push(it);
  });

  return (
    <div className="apy-sidebar">
      <button onClick={() => navigate({ kind: "home" })} className={"apy-nav-home" + (page.kind === "home" ? " active" : "")}>Home</button>

      <div className="apy-nav-section">
        <button onClick={() => toggle("getStarted")} className="apy-nav-section-label">
          {openGroups.getStarted ? "▾" : "▸"} Get Started
        </button>
        {openGroups.getStarted && getStartedSections.map((sec) => (
          <div key={sec.name}>
            <button onClick={() => toggle("gs-" + sec.name)} className="apy-nav-group-label">
              {openGroups["gs-" + sec.name] !== false ? "▾" : "▸"} {sec.name}
            </button>
            {openGroups["gs-" + sec.name] !== false && sec.items.map((it) => (
              <button key={it.key} onClick={() => navigate({ kind: "getstarted", ref: it.key })} className={"apy-nav-leaf" + (page.kind === "getstarted" && page.ref === it.key ? " active" : "")} style={{ paddingLeft: 52 }}>
                <span>{it.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="apy-nav-section">
        <button onClick={() => toggle("foundations")} className="apy-nav-section-label">
          {openGroups.foundations ? "▾" : "▸"} Foundations
        </button>
        {openGroups.foundations && NAV.foundationKeys.map((k) => (
          <button key={k} onClick={() => navigate({ kind: "foundation", ref: k })} className={"apy-nav-item" + (page.kind === "foundation" && page.ref === k ? " active" : "")}>
            {NAV.foundationLabels[k]}
          </button>
        ))}
      </div>

      <div className="apy-nav-section">
        <div className="apy-components-heading">Components</div>
        {NAV.componentGroups.map((g) => {
          const familiesInGroup = NAV.families.filter((f) => familyGroupKey(f) === g.key);
          const memberIds = getFamilyMemberIds();
          const standalone = NAV.components.filter((c) => c.groupKey === g.key && !memberIds.has(c.id));
          return (
            <div key={g.key}>
              <button onClick={() => toggle(g.key)} className="apy-nav-group-label">
                {openGroups[g.key] ? "▾" : "▸"} {g.label}
              </button>
              {openGroups[g.key] && (
                <>
                  {familiesInGroup.map((f) => (
                    <button key={f.id} onClick={() => navigate({ kind: "family", ref: f })} className={"apy-nav-leaf" + (page.kind === "family" && page.ref?.id === f.id ? " active" : "")}>
                      <span>{f.label}</span><span className="apy-nav-leaf-count">{f.members.length}</span>
                    </button>
                  ))}
                  {standalone.map((c) => (
                    <button key={c.id} onClick={() => navigate({ kind: "component", ref: c })} className={"apy-nav-leaf" + (page.kind === "component" && page.ref?.id === c.id ? " active" : "")}>
                      <span>{c.name}</span>
                      {!c.hasGuidelines && <span title="No real documentation yet" className="apy-nav-leaf-nodoc" />}
                    </button>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
