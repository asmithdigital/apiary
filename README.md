# APIary

RAA's real design system reference, built as an actual CMS: log into GitHub,
edit a markdown or JSON file, commit — the live site reflects it within a
minute. No build step, no npm install, no "also update it somewhere else."

## The rule this repo follows

- **A written paragraph of guidance, a Do/Don't, an accessibility note, a
  Get Started page?** That's a `.md` file in `content/`. Edit it like a
  document.
- **A hex code, a pixel value, a token name, a list of real captured
  values?** That's a small `.json` file next to it. It's a table, not prose
  — markdown isn't the right shape for it.
- **The menu structure — sidebar groups, families, foundations, Get Started
  items?** All one file: `content/nav.json`. Add an item there and it shows
  up everywhere it needs to, automatically.
- **Rendering logic — how a page lays out, what a tab does?** That's the
  `.jsx` files in `js/`. You shouldn't need to touch these for a content
  change.

## File structure

```
index.html                    — loads everything, in order. Rarely needs editing.
js/0-bootstrap.mjs             — loads React/ReactDOM/lucide-react/marked from CDN
js/0-markdown.js               — the tiny hand-written frontmatter reader
js/1-identity.jsx              — colours/fonts + the live component-preview engine
js/2-markdown-view.jsx         — renders fetched markdown, the version picker
js/3-detail-page.jsx           — a single component's page (and grouped families)
js/4-foundations-page.jsx      — Colour/Spacing/Typography/etc pages
js/5-get-started-page.jsx      — the Get Started pages
js/6-home-page.jsx             — the landing page
js/7-sidebar-topbar.jsx        — navigation, driven entirely by nav.json
js/8-app.jsx                   — routing (real URLs, e.g. #/component/button) + boot

content/nav.json               — THE single menu source of truth
content/manifest.json          — which real version files exist, per item
content/R.json                 — real RAA brand values (logo colours etc)
content/components/<id>/
  specs.json                  — real captured values (tabular — stays JSON)
  v1.md, v2.md, ...            — real documentation (versioned — markdown)
content/foundations/<key>/
  data.json                   — real tabular data (colour ramps, spacing scale, etc)
  v1.md                       — real narrative content
content/get-started/<key>.md   — each Get Started page
```

## Editing content (the actual daily workflow)

1. On GitHub, open `content/components/button/v1.md`.
2. Click the pencil icon (Edit this file).
3. Change a paragraph, a Do/Don't item, whatever.
4. Commit directly to `main`.
5. Wait about a minute, refresh the live site. Done.

No code touched, nothing to build, nothing to update in two places.

## Adding a new version of a component's documentation

1. Duplicate `content/components/<id>/v1.md` as `v2.md`, edit it.
2. Open `content/manifest.json`, find that component's array, add `"v2"`.
3. Commit both files together. The site now defaults to `v2` and offers a
   dropdown back to `v1`.

## Adding a brand-new menu item

Edit `content/nav.json` — add the entry to the relevant array
(`getStartedItems`, `foundationKeys` + `foundationLabels`, etc.), then create
the matching content file it points to (e.g. `content/get-started/new-key.md`).
That's genuinely it — the sidebar, search, and routing all read from this one
file.

## Running locally

`fetch()` can't read local files over `file://`, so serve the folder:

```bash
cd apiary-cms
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deploying

Push to GitHub, then Settings → Pages → Deploy from a branch → `main` → `/`.
