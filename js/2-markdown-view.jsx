function MarkdownBody({ html }) {
  return (
    <div
      className="apy-prose"
      style={{ fontSize: 14, color: BODY, lineHeight: 1.7 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Lets you jump between real versions of a component/foundation's markdown
// content. Reads the list of what actually exists from manifest.json (fetched
// once at boot) — never guesses at files that might not be there.
function VersionPicker({ versions, active, onChange }) {
  if (!versions || versions.length < 2) return null;
  return (
    <select value={active} onChange={(e) => onChange(e.target.value)} style={{ fontSize: 12, fontFamily: FONT_MONO, border: `1px solid ${LINE}`, borderRadius: 6, padding: "4px 8px", background: "#fff", color: BODY, cursor: "pointer" }}>
      {versions.map((v) => (
        <option key={v} value={v}>{v === versions[versions.length - 1] ? `${v} (latest)` : v}</option>
      ))}
    </select>
  );
}

function LoadingRow() {
  return <p style={{ fontSize: 13, color: FAINT, fontStyle: "italic" }}>Loading…</p>;
}
