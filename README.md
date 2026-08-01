# Apiary

RAA's real design system reference. Every visible piece of text is a real
markdown or JSON file; every reusable piece of UI is its own small file;
every style is a real CSS class. No build step — edit on GitHub, it's live
within a minute.

## Where to find things

**Want to change a colour, font, or spacing value anywhere on the site?**
Open `css/theme.css` — it's a list of variables. Change one, it updates
everywhere that value is used.

**Want to restyle the menu?** `css/sidebar.css`.
**Want to restyle buttons, tabs, tags, tables?** `css/components.css`.
**Want to restyle how real documentation content looks (Do/Don't boxes,
headings, lists)?** `css/prose.css`.

**Want to change what the header does?** `partials/header.jsx`.
**Want to change what the menu shows or how it behaves?** `partials/sidebar.jsx`
— but if you just want to *add an item* to the menu, you don't need this
file at all, see below.

**Want to edit a component's real documentation?**
`content/components/<id>/v1.md` — open it, edit the text, commit.

**Want to add a menu item?** Edit `content/nav.json` only — every menu
(sidebar, search, families, foundations, Get Started) reads from this one
file. You don't need to touch any `.jsx` file to add, rename, or reorder a
menu entry.

## Full file structure

```
index.html                 — loads the CSS files, then every partial and page, in order.

css/
  theme.css                 — every colour/font/spacing variable. Check here first.
  base.css                  — resets, base typography.
  layout.css                — the app shell: sidebar width, topbar, content column.
  sidebar.css                — the menu itself, plus search.
  components.css              — buttons, tags, tabs, pills, spec rows.
  prose.css                  — styling for rendered markdown (Do/Don't boxes, tables).

partials/                  — reusable chrome, used by more than one page.
  header.jsx                 — the top bar: logo + search.
  sidebar.jsx                 — the menu, entirely driven by content/nav.json.
  layout-chrome.jsx           — GrayBand (page title banner), TabStrip, Section,
                                 ContentsRail (the "on this page" secondary menu —
                                 this one has no content file on purpose, it's
                                 built from whatever headings exist on the
                                 current page).
  markdown-view.jsx            — turns fetched markdown into styled HTML, plus
                                 the version dropdown.
  preview-engine.jsx           — the logo mark, the real/foundation tags, and
                                 the engine that draws each component's live
                                 preview from its real specs.json.

pages/                     — one file per page type.
  home.jsx
  detail-page.jsx             — a single component's page, and the
                                 family-grouped version for related variants.
  foundations-page.jsx
  get-started-page.jsx
  app.jsx                     — routing (real URLs like #/component/button) + boot.

js/
  0-bootstrap.mjs             — loads React/ReactDOM/lucide-react/marked from CDN.
  0-markdown.js               — the hand-written frontmatter reader.

content/                   — every real value the site shows. This is what
                              you'll spend most of your time editing.
  site.md                     — hero tagline, button labels, small UI text
                                 that isn't tied to a specific page.
  nav.json                    — THE single menu source of truth.
  manifest.json               — which real version files exist, per item.
  R.json                      — real RAA brand values (logo colours).
  components/<id>/
    specs.json                — real captured values (tabular — stays JSON).
    v1.md, v2.md, ...          — real documentation (versioned — markdown).
  foundations/<key>/
    data.json                 — real tabular data (colour ramps, spacing scale).
    v1.md                     — real narrative content.
  get-started/<key>.md        — each Get Started page.
```

## One honest exception

The "Loading real data…" message that flashes for a second while the site
boots is still hardcoded in `pages/app.jsx`, not in a content file — it
appears *before* any content has loaded, so there's nothing to fetch it
from yet. Everything else is real content.

## Editing content — the daily workflow

1. On GitHub, open the file (e.g. `content/components/button/v1.md`).
2. Click the pencil icon.
3. Edit, commit to `main`.
4. Wait ~1 minute, refresh the live site.

## Adding a menu item

Edit `content/nav.json` only, then create the content file it points to.

## Running locally

```bash
cd apiary-v2
python3 -m http.server 8000
```

`fetch()` can't read `file://` URLs, so it has to be served, not double-clicked.

## Deploying

Push to GitHub → Settings → Pages → Deploy from a branch → `main` → `/`.
