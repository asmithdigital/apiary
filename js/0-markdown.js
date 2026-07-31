// A tiny, hand-written frontmatter reader — deliberately not a dependency.
// Splits a markdown file into { meta, body }. meta comes from the
// --- key: "value" --- block at the top; body is everything after it.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    try { value = JSON.parse(value); } catch (e) { /* leave as raw string */ }
    meta[key] = value;
  });
  return { meta, body: raw.slice(match[0].length) };
}

// Fetches and parses one markdown file. `marked` (loaded via CDN in
// index.html as a global) turns the body into real HTML.
async function fetchMarkdown(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const raw = await res.text();
  const { meta, body } = parseFrontmatter(raw);
  const html = window.marked ? window.marked.parse(body) : body;
  return { meta, html, raw: body };
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}
