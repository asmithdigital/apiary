// Stage 2 — real persistence. fetchMarkdown/fetchJSON now read through the
// Worker (KV first, the real GitHub file as fallback), and saves go through
// it too. SESSION_OVERRIDES stays as a same-tab instant-preview cache so a
// save shows immediately without waiting on a round trip, but the Worker
// call is what actually persists it for everyone.
const SESSION_OVERRIDES = {};
async function saveMarkdownOverride(url, rawBody, meta) {
  const fm = Object.entries(meta || {}).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n");
  const full = `---\n${fm}\n---\n\n${rawBody}`;
  SESSION_OVERRIDES[url] = full; // instant local preview

  const repoPath = url.replace(/^\.\//, "");
  const token = sessionStorage.getItem("apiary_gh_token");
  if (!token) {
    return { ok: false, error: "Not logged in — this only saved for your current tab. Sign in with GitHub to make it real." };
  }
  try {
    const res = await fetch(`${window.APIARY_API}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ path: repoPath, content: full, message: `Edit ${repoPath} via Apiary editor` }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || `Save failed (${res.status})` };
    return { ok: true, ...data };
  } catch (e) {
    return { ok: false, error: `Network error saving: ${e.message}` };
  }
}
window.saveMarkdownOverride = saveMarkdownOverride;
window.hasSessionEdit = (url) => Object.prototype.hasOwnProperty.call(SESSION_OVERRIDES, url);

// A tiny, hand-written frontmatter reader — deliberately not a dependency.
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
    const repoPath = url.replace(/^\.\//, "");
    const apiUrl = window.APIARY_API && !window.APIARY_API.includes("REPLACE-WITH")
      ? `${window.APIARY_API}/content?path=${encodeURIComponent(repoPath)}`
      : null;
    if (apiUrl) {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Failed to load ${repoPath} from the API: ${res.status}`);
      const data = await res.json();
      raw = data.value;
    } else {
      // No real Worker configured yet (js/config.js still has the
      // placeholder) — fall back to the plain static file, exactly like
      // Stage 1, so the site still works before Stage 2 is wired up.
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      raw = await res.text();
    }
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
