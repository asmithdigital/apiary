/* =============================================================================
   PARTIAL: header — the top bar with the logo and search box. Edit this
   file to change the header itself; edit css/sidebar.css (.apy-topbar,
   .apy-search-*) to restyle it.
============================================================================= */
function Header({ onNavigate }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return NAV.components.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <div className="apy-topbar">
      <button onClick={() => onNavigate({ kind: "home" })} className="apy-topbar-logo">
        <Mark /><span>Apiary</span>
      </button>
      <div className="apy-search-wrap">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components"
          className="apy-search-input"
        />
        {results.length > 0 && (
          <div className="apy-search-results">
            {results.map((r) => (
              <button key={r.id} onClick={() => { setQuery(""); onNavigate({ kind: "component", ref: r }); }} className="apy-search-result">
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
