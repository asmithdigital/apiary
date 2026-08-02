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

          <div style={{ width: 240, flexShrink: 0 }}>
            <div className="apy-caption-card">
              <div className="apy-eyebrow" style={{ marginBottom: 10 }}>On this page</div>
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
// same principle as the main ContentsRail.
function PageOutline() {
  const [headings, setHeadings] = useState([]);
  useEffect(() => {
    const collect = () => {
      const els = document.querySelectorAll(".apy-prose h2");
      const next = Array.from(els).map((el) => el.textContent);
      setHeadings((prev) =>
        prev.length === next.length && prev.every((h, i) => h === next[i]) ? prev : next
      );
    };
    collect();
    // Content loads async (markdown fetch) and can be swapped between
    // versions/tabs, so watch for DOM changes instead of polling — this
    // was previously an effect with no dependency array that called
    // setState on every render, which looped forever.
    const observer = new MutationObserver(collect);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);
  if (!headings.length) return <p style={{ fontSize: 13, color: "var(--color-faint)" }}>No sections on this page.</p>;
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {headings.map((h, i) => (
        <li key={i} style={{ fontSize: 13, color: "var(--color-body)" }}>{h}</li>
      ))}
    </ul>
  );
}
