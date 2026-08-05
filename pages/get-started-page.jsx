/* =============================================================================
   PAGE: get-started-page — fixes the real bug (missing error handling meant
   a failed fetch hung forever, looking like a blank screen), adds a
   two-column layout so it's not a flat wall of text, and real prev/next
   pagination driven by nav.json's own item order — no hardcoded page list.
============================================================================= */
function GetStartedPage({ pageKey, pageLabel, navigate }) {
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(pageLabel);
  useEffect(() => { setDisplayLabel(pageLabel); }, [pageLabel]);
  useEffect(() => {
    let cancelled = false;
    setDoc(null); setError(null);
    fetchMarkdown(`./content/get-started/${pageKey}.md`)
      .then((d) => { if (!cancelled) setDoc(d); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [pageKey]);

  if (error) return <div style={{ padding: 40, color: "var(--color-danger-text)" }}>Failed to load this page: {error}</div>;
  if (!doc) return <div style={{ padding: 40 }}><LoadingRow /></div>;
  const isPending = doc.meta.status === "pending";

  const items = NAV.getStartedItems;
  const idx = items.findIndex((it) => it.key === pageKey);
  const prev = idx > 0 ? items[idx - 1] : null;
  const next = idx >= 0 && idx < items.length - 1 ? items[idx + 1] : null;

  return (
    <div>
      <GrayBand title={displayLabel} description={isPending ? "Structure is here, real content isn't yet." : undefined} onTitleSave={setDisplayLabel} />
      <div className="apy-content-col" style={{ paddingTop: 28, paddingBottom: 28 }}>
        <div className="apy-content-col-inner" style={{ gap: 40 }}>
          <div style={{ flex: 1, maxWidth: 700 }}>
            <EditableMarkdown url={`./content/get-started/${pageKey}.md`} doc={doc} onSaved={setDoc} />

            {(prev || next) && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--color-line)" }}>
                <div>
                  {prev && (
                    <button onClick={() => navigate({ kind: "getstarted", ref: prev.key })} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
                      <div style={{ fontSize: 12, color: "var(--color-faint)", marginBottom: 4 }}>← Previous</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-accent)" }}>{prev.label}</div>
                    </button>
                  )}
                </div>
                <div>
                  {next && (
                    <button onClick={() => navigate({ kind: "getstarted", ref: next.key })} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "right", padding: 0 }}>
                      <div style={{ fontSize: 12, color: "var(--color-faint)", marginBottom: 4 }}>Next →</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-accent)" }}>{next.label}</div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 20 }}>
              <PageOutline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Builds a real "on this page" list from whatever ## headings actually
// exist in the rendered content — no separate content file needed for this,
// same principle as the main ContentsRail. Assigns each heading a real id
// so the links are genuine anchors, not decorative text.
function PageOutline() {
  const [headings, setHeadings] = useState([]);
  useEffect(() => {
    const els = document.querySelectorAll(".apy-prose h2");
    const list = Array.from(els).map((el, i) => {
      const slug = el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `section-${i}`;
      el.id = slug;
      return { id: slug, label: el.textContent };
    });
    setHeadings(list);
  });
  if (!headings.length) return null;
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            style={{ fontSize: 13.5, color: "var(--color-accent)", textDecoration: "underline" }}>
            {h.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
