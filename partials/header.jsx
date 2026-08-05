/* =============================================================================
   PARTIAL: header — the top bar with the logo and search box. Edit this
   file to change the header itself; edit css/sidebar.css (.apy-topbar,
   .apy-search-*) to restyle it.
============================================================================= */
function Header({ onNavigate, onToggleMobileMenu }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    let cancelled = false;
    setLoading(true);
    SearchIndex.search(query).then((r) => { if (!cancelled) { setResults(r); setLoading(false); } });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="apy-topbar">
      <button className="apy-mobile-menu-btn" onClick={onToggleMobileMenu} aria-label="Open menu">☰</button>
      <button onClick={() => onNavigate({ kind: "home" })} className="apy-topbar-logo">
        <Mark /><span>Apiary</span>
      </button>
      <div className="apy-search-wrap">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components, foundations, get started…"
          className="apy-search-input"
        />
        {query.trim() && (
          <div className="apy-search-results">
            {loading && <div className="apy-search-result" style={{ color: "var(--color-faint)" }}>Searching…</div>}
            {!loading && results.length === 0 && <div className="apy-search-result" style={{ color: "var(--color-faint)" }}>No real matches for "{query}".</div>}
            {results.map((r) => (
              <button key={`${r.type}-${r.id}`} onClick={() => { setQuery(""); onNavigate(r.route); }} className="apy-search-result">
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{r.type}</span>
                <div style={{ fontWeight: 600 }}>{r.title}</div>
                {r.snippet && <div style={{ fontSize: 12, color: "var(--color-faint)", marginTop: 2 }}>{r.snippet.slice(0, 90)}…</div>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="apy-topbar-auth-desktop"><AuthButton /></div>
    </div>
  );
}
