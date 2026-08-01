/* =============================================================================
   PARTIAL: markdown-view — renders a fetched real markdown file (already
   parsed into HTML by 0-markdown.js) with the styling from css/prose.css,
   and the version dropdown for switching between real content versions.
============================================================================= */
function MarkdownBody({ html }) {
  return <div className="apy-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

function VersionPicker({ versions, active, onChange }) {
  if (!versions || versions.length < 2) return null;
  return (
    <select value={active} onChange={(e) => onChange(e.target.value)} className="apy-version-picker">
      {versions.map((v) => (
        <option key={v} value={v}>{v === versions[versions.length - 1] ? `${v} (latest)` : v}</option>
      ))}
    </select>
  );
}

function LoadingRow() {
  return <p style={{ fontSize: 15, color: "var(--color-faint)", fontStyle: "italic" }}>Loading…</p>;
}
