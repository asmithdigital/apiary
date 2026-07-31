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

  return (
    <div style={{ width: 250, flexShrink: 0, borderRight: `1px solid ${LINE}`, overflowY: "auto", padding: "14px 0" }}>
      <button onClick={() => navigate({ kind: "home" })} style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 16px", background: page.kind === "home" ? ACCENT_TINT : "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page.kind === "home" ? 700 : 400 }}>Home</button>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => toggle("getStarted")} style={{ display: "flex", alignItems: "center", gap: 5, width: "100%", padding: "7px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: FAINT, textTransform: "uppercase", fontFamily: FONT_MONO }}>
          {openGroups.getStarted ? "▾" : "▸"} Get Started
        </button>
        {openGroups.getStarted && NAV.getStartedItems.map((it) => (
          <button key={it.key} onClick={() => navigate({ kind: "getstarted", ref: it.key })} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 16px 6px 34px", background: page.kind === "getstarted" && page.ref === it.key ? ACCENT_TINT : "none", border: "none", cursor: "pointer", fontSize: 13 }}>
            {it.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => toggle("foundations")} style={{ display: "flex", alignItems: "center", gap: 5, width: "100%", padding: "7px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: FAINT, textTransform: "uppercase", fontFamily: FONT_MONO }}>
          {openGroups.foundations ? "▾" : "▸"} Foundations
        </button>
        {openGroups.foundations && NAV.foundationKeys.map((k) => (
          <button key={k} onClick={() => navigate({ kind: "foundation", ref: k })} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 16px 6px 34px", background: page.kind === "foundation" && page.ref === k ? ACCENT_TINT : "none", border: "none", cursor: "pointer", fontSize: 13 }}>
            {NAV.foundationLabels[k]}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ padding: "7px 16px", fontSize: 11, fontWeight: 700, color: FAINT, fontFamily: FONT_MONO, textTransform: "uppercase" }}>Components</div>
        {NAV.componentGroups.map((g) => {
          const familiesInGroup = NAV.families.filter((f) => familyGroupKey(f) === g.key);
          const memberIds = getFamilyMemberIds();
          const standalone = NAV.components.filter((c) => c.groupKey === g.key && !memberIds.has(c.id));
          return (
            <div key={g.key}>
              <button onClick={() => toggle(g.key)} style={{ display: "flex", alignItems: "center", gap: 5, width: "100%", padding: "5px 16px 5px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: FAINT, textTransform: "uppercase", fontFamily: FONT_MONO }}>
                {openGroups[g.key] ? "▾" : "▸"} {g.label}
              </button>
              {openGroups[g.key] && (
                <>
                  {familiesInGroup.map((f) => (
                    <button key={f.id} onClick={() => navigate({ kind: "family", ref: f })} style={{ display: "flex", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "5px 16px 5px 40px", background: page.kind === "family" && page.ref?.id === f.id ? ACCENT_TINT : "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                      <span>{f.label}</span><span style={{ fontSize: 10, color: FAINT }}>{f.members.length}</span>
                    </button>
                  ))}
                  {standalone.map((c) => (
                    <button key={c.id} onClick={() => navigate({ kind: "component", ref: c })} style={{ display: "flex", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "5px 16px 5px 40px", background: page.kind === "component" && page.ref?.id === c.id ? ACCENT_TINT : "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                      <span>{c.name}</span>
                      {!c.hasGuidelines && <span title="No real documentation yet" style={{ width: 6, height: 6, borderRadius: "50%", background: SLATE[300], flexShrink: 0 }} />}
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

function TopBar({ onNavigate }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return NAV.components.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);
  return (
    <div style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: 20, borderBottom: `1px solid ${LINE}`, background: "#fff" }}>
      <button onClick={() => onNavigate({ kind: "home" })} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
        <Mark /><span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em" }}>APIary</span>
      </button>
      <div style={{ marginLeft: "auto", position: "relative", width: 260 }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search components"
          style={{ width: "100%", background: BAND, border: `1px solid ${LINE}`, borderRadius: 4, padding: "8px 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        {results.length > 0 && (
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 40 }}>
            {results.map((r) => (
              <button key={r.id} onClick={() => { setQuery(""); onNavigate({ kind: "component", ref: r }); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", background: "none", border: "none", cursor: "pointer" }}>
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
