# Apiary

RAA's real design system reference. Every visible piece of text is a real
markdown or JSON file; every reusable piece of UI is its own small file;
every style is a real CSS class; every design value has a real token. No
build step — edit on GitHub, it's live within a minute.

## Where to find things

**Change a colour, font, or spacing value anywhere on the site?** `css/theme.css`.
**Restyle the menu?** `css/sidebar.css`. **Buttons/tabs/tags/tables?** `css/components.css`.
**How rendered content looks?** `css/prose.css`.

**Change the Do/Don't box layout itself — for every component, everywhere,
in one place?** `partials/templates/do-dont.hbs`. This is the actual answer
to "the Do/Don't box shouldn't have its style baked into every content
file" — it doesn't anymore. A content file just writes `{{> do-dont}}` and
provides its own `do:`/`dont:` arrays in its frontmatter; the box's HTML and
styling live in this one template file, shared by all 68 components.

**Change a component's real documentation?** `content/components/<id>/v1.md`.
**Add a menu item?** `content/nav.json` only.
**Change a design token's value?** `content/tokens.json` — this is the real
source of truth for colours and spacing. It's currently provisional (built
from values already confirmed real elsewhere in this repo, but the token
*names* are inferred, not from a real Figma Variables export yet) — replace
it wholesale once you have the real export, nothing else needs to change.

## Real Handlebars templating

`js/0-markdown.js` compiles each markdown file's body as a real Handlebars
template before parsing it as markdown, using that file's own frontmatter as
the variable context. That's what makes `{{> do-dont}}` actually work with
each component's own real do/dont data.

Two partials exist so far, both in `partials/templates/`:
- `do-dont.hbs` — takes `do`/`dont` arrays from frontmatter.
- `callout.hbs` — a block partial for warning/success notes:
  `{{#> callout type="warn" title="..."}}your text{{/callout}}`.

Add a new partial the same way: drop a `.hbs` file in `partials/templates/`,
register its name in `js/0-markdown.js`'s `registerContentPartials()`, then
use `{{> your-partial}}` in any content file.

## Real image assets per component

Every component now has a real `preview.svg` file, generated from its
actual captured spec values (colour, radius, padding) — not a screenshot,
not invented, but not a real Figma export either. It's referenced from the
Overview tab exactly like a normal image.

**To replace one with a real Figma export**: export the real SVG from
Figma, name it `preview.svg`, and drop it into
`content/components/<id>/preview.svg`, overwriting the generated one. No
code change needed — the page already points at that exact path.

## The future workflow this is built for

Designer works in Figma → exports the real component frame's data via
Figma Make (or describes it to Claude) → Claude writes the real
`specs.json` + `v1.md` content from that → designer/dev uploads it to
GitHub (web UI or terminal) → the real SVG export replaces the
auto-generated placeholder. Token updates follow the same loop: Figma
Variables export → Claude updates `content/tokens.json` → every page that
references a token updates automatically.

## Full file structure

```
index.html
css/            theme.css, base.css, layout.css, sidebar.css, components.css, prose.css
partials/
  header.jsx, sidebar.jsx, layout-chrome.jsx, markdown-view.jsx, preview-engine.jsx
  templates/
    do-dont.hbs   — the Do/Dont box template. Edit this to change all of them.
    callout.hbs   — the warning/success note template.
pages/
  home.jsx, detail-page.jsx, foundations-page.jsx, get-started-page.jsx, app.jsx
js/
  0-bootstrap.mjs   — loads React/ReactDOM/lucide-react/marked/Handlebars from CDN.
  0-markdown.js     — frontmatter reader + Handlebars compile + markdown parse.
content/
  site.md, nav.json, manifest.json, R.json, tokens.json
  components/<id>/  specs.json, v1.md, preview.svg
  foundations/<key>/  data.json, v1.md
  get-started/<key>.md
```

## Running locally

```bash
cd apiary-v2
python3 -m http.server 8000
```

## Deploying

Push to GitHub → Settings → Pages → Deploy from a branch → `main` → `/`.

## Stage 2 — real persistence (the database)

This is real infrastructure, not just files — I couldn't test this myself
the way I tested everything else in this repo (no access to your real
Cloudflare/GitHub accounts), so treat first setup as "we debug it together,"
not "this is guaranteed to work first try."

### What you're setting up

- **Cloudflare KV** — the actual database. One value per content file.
- **A Cloudflare Worker** (`worker/`) — the only thing that touches secrets.
  Reads check KV, fall back to the real file on GitHub. Writes go to KV
  *and* commit back to GitHub, so the `.md` file in this repo stays a real,
  accurate copy — not a separate thing that drifts out of sync.
- **A GitHub OAuth App** — so each person logs in as themselves.
- **A GitHub Action** (`.github/workflows/sync-content.yml`) — if someone
  edits a `.md` file directly on GitHub instead of through the app, this
  pushes that edit into the database too.

### Setup, in order

**1. Install Wrangler (Cloudflare's CLI) and log in**
```bash
npm install -g wrangler
wrangler login
```
This opens a browser to authorize Wrangler against your Cloudflare account.

**2. Create the KV namespace (the database itself)**
```bash
cd worker
wrangler kv namespace create apiary-content
```
This prints an `id`. Copy it into `worker/wrangler.toml`, replacing
`REPLACE_WITH_REAL_KV_NAMESPACE_ID`.

**3. Create the GitHub OAuth App**
On GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
- Homepage URL: `https://asmithdigital.github.io/apiary`
- Authorization callback URL: leave a placeholder for now, you'll update it
  in step 5 once you know your real Worker URL.
Save it, then copy the **Client ID**, and generate + copy a **Client secret**.

**4. Set the real secrets** (never go in `wrangler.toml`, never get committed)
```bash
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put SYNC_SECRET
```
For `SYNC_SECRET`, just make up any long random string — it's only used to
let the GitHub Action talk to the Worker.

**5. Deploy the Worker**
```bash
wrangler deploy
```
This prints your real Worker URL, e.g. `https://apiary-content-api.yourname.workers.dev`.

- Update `worker/wrangler.toml`'s `OAUTH_CALLBACK_URL` with
  `<that URL>/auth/callback`, then `wrangler deploy` again.
- Go back to the GitHub OAuth App settings and update the Authorization
  callback URL to match.
- Update `js/config.js` in this repo with that same real Worker URL.

**6. Set the GitHub Action's secrets**
On GitHub: this repo → Settings → Secrets and variables → Actions:
- `WORKER_URL` — your real Worker URL
- `SYNC_SECRET` — the exact same string you set in step 4

**7. Add your team as collaborators**
This repo → Settings → Collaborators → Add people. They need a GitHub
account and to be added here to get write access — that's what the Worker
checks before letting a save go through.

**8. Push this repo, then test it for real**
Commit and push everything (including the now-correct `wrangler.toml` and
`js/config.js`), then open the live site, click **Sign in with GitHub** in
the top bar, approve it, and try editing something real.
