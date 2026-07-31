# APIary

RAA's real design system reference — components, foundations, and Get Started
content captured directly from real Figma/Zeroheight sources, not written
from memory. This is a static site with **no build step**: clone it, edit a
JSON file, push, done.

## How this is structured

```
index.html          — the only HTML file. Loads Babel Standalone + app.js.
app.js               — every React component (Sidebar, DetailPage, FamilyPage,
                        FoundationsPage, GetStartedPage, HomePage, the preview
                        engine, etc). This is real code — logic, not content.
data/*.json          — every real value: component specs, guidelines,
                        foundation content, Get Started pages, colour ramps,
                        spacing scale, families. This is real content, not code.
.nojekyll            — tells GitHub Pages to serve files exactly as they are.
```

**The rule this repo follows:** if it's a label, a real captured value, a
token name, or a paragraph of documentation, it lives in `data/*.json`. If
it's rendering logic — how a page lays out, what a tab strip does, how a
component preview draws itself — it lives in `app.js`. Update a JSON file
and the site updates immediately on next load. No code change needed.

## Editing content

Every file in `data/` is plain JSON — editable directly in the GitHub web UI
(click the file, click the pencil icon, edit, commit) or in any text editor.
The most commonly edited ones:

- `COMPONENTS.json` — real captured specs per component (id, tokenFindings, etc.)
- `GUIDELINES.json` — real Do/Don't, accessibility, content guidance per component
- `GET_STARTED_CONTENT.json` — the Get Started pages (What is APIary, onboarding, etc.)
- `FOUNDATION_NARRATIVE.json` — the written Foundations pages (Colour, Icons, etc.)

Each JSON file corresponds exactly to one data structure `app.js` fetches by
name at startup — the key names in `app.js`'s `DATA_FILES` map match the
filenames here 1:1.

## Running it locally

Because `app.js` fetches JSON with `fetch()`, opening `index.html` directly
as a `file://` URL will fail (browsers block `fetch` against local files for
security). Serve the folder instead:

```bash
cd apiary-app
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Deploying

Push to GitHub, then turn on Pages for this repo (Settings → Pages → Deploy
from a branch → main → /root). GitHub Pages serves static files exactly like
this over https, which is all `fetch()` and the ESM CDN imports need.

## Known simplification

Icons come from `lucide-react`, loaded via `esm.sh` (a CDN that re-serves npm
packages as browser ES modules) rather than an npm install — this keeps the
"no build step" promise. If `esm.sh` availability ever becomes a concern,
vendor `react`, `react-dom`, and `lucide-react` into this repo and change the
three import URLs at the top of `app.js` to relative paths.
