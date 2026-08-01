// Stage 1 of the editing UI — no backend yet, by design. An edit updates
// this in-memory map, which fetchMarkdown checks before hitting the network.
// A page reload clears it and goes back to the real file on GitHub. Stage 2
// (a real Save) would replace this map with an actual GitHub API commit.
const SESSION_OVERRIDES = {};
function saveMarkdownOverride(url, rawBody, meta) {
  const fm = Object.entries(meta || {}).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n");
  SESSION_OVERRIDES[url] = `---\n${fm}\n---\n\n${rawBody}`;
}
window.saveMarkdownOverride = saveMarkdownOverride;
window.hasSessionEdit = (url) => Object.prototype.hasOwnProperty.call(SESSION_OVERRIDES, url);

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
// index.html as a global) turns the body into real HTML. Before that, the
// body is compiled as a real Handlebars template — frontmatter becomes the
// variable context, so `{{> do-dont}}` in a content file actually receives
// that file's own `do`/`dont` arrays, with the styling living only in
// partials/templates/do-dont.hbs, not copy-pasted into every content file.
let partialsRegistered = false;
async function registerContentPartials() {
  if (partialsRegistered) return;
  const names = ["do-dont", "callout"];
  await Promise.all(names.map(async (name) => {
    const res = await fetch(`./partials/templates/${name}.hbs`);
    const source = await res.text();
    window.Handlebars.registerPartial(name, source);
  }));
  partialsRegistered = true;
}

async function fetchMarkdown(url) {
  await registerContentPartials();
  let raw;
  if (Object.prototype.hasOwnProperty.call(SESSION_OVERRIDES, url)) {
    raw = SESSION_OVERRIDES[url];
  } else {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    raw = await res.text();
  }
  const { meta, body } = parseFrontmatter(raw);
  let compiled = body;
  try {
    compiled = window.Handlebars.compile(body)(meta);
  } catch (e) {
    console.warn(`Handlebars compile failed for ${url}, showing raw markdown:`, e.message);
  }
  const html = window.marked ? window.marked.parse(compiled) : compiled;
  return { meta, html, raw: body };
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}
