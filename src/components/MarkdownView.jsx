/* =============================================================================
   COMPONENT: MarkdownView — renders a fetched real markdown file (already
   parsed into HTML by lib/content.js) with the styling from
   styles/_prose.scss, and the version dropdown for switching between real
   content versions.
============================================================================= */
export function MarkdownBody({ html }) {
  return <div className="apy-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function VersionPicker({ versions, active, onChange }) {
  if (!versions || versions.length === 0) return null;
  return (
    <select value={active} onChange={(e) => onChange(e.target.value)} className="apy-version-picker">
      {versions.map((v) => (
        <option key={v} value={v}>
          {v === versions[versions.length - 1] ? `${v} (latest)` : v}
        </option>
      ))}
    </select>
  );
}

export function LoadingRow() {
  return <p style={{ fontSize: 15, color: "var(--color-faint)", fontStyle: "italic" }}>Loading…</p>;
}
