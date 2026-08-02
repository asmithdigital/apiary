# Apiary — real design-system reference for RAA

This is now a real Vite + React + SCSS project instead of the old no-build,
Babel-in-browser setup. Content stays exactly the same "GitHub-as-CMS"
model — every markdown/JSON file under `public/content/` is still real,
plain-text, and editable directly on GitHub with no build step needed for
content changes. Only **code** changes (JS/JSX/SCSS) need a build now.

## Running it locally

```bash
npm install       # once, or whenever package.json changes
npm run dev        # starts a local dev server with hot reload
```

Open the URL it prints (usually `http://localhost:5173`). Edit any file
under `src/` and the browser updates instantly — no manual refresh, no
Babel-in-browser compile step.

## Building for deployment

```bash
npm run build       # outputs the real static site to dist/
npm run preview      # serves dist/ locally so you can check the built version
```

`dist/` is what actually gets deployed to GitHub Pages. The existing
GitHub Actions / manual-zip workflow should now build this into `dist/`
and publish that, rather than publishing the repo root directly. If you
want, ask for a GitHub Action that runs `npm run build` and publishes
`dist/` automatically on every push — that's a quick follow-up.

## Where things live

```
src/
  main.jsx              — entry point, loads real data then mounts React
  App.jsx                — routing (hash-based, same as before)
  lib/
    store.js             — real NAV/MANIFEST/R data, loaded once at boot
    content.js           — fetchMarkdown/fetchJSON/save, Handlebars + marked
    config.js            — Stage 2 Worker URL (same placeholder as before)
    categoryStyle.js      — shared category colour/icon map
  components/             — reusable chrome (was partials/*.jsx)
    Header.jsx, Sidebar.jsx, LayoutChrome.jsx, MarkdownView.jsx,
    Editable.jsx, PreviewEngine.jsx
  pages/                  — one file per page type (was pages/*.jsx)
    HomePage.jsx, DetailPage.jsx, FoundationsPage.jsx, GetStartedPage.jsx
  styles/                 — real SCSS, not plain CSS
    _variables.scss       — check this first: every colour/font/spacing value
    _base.scss, _layout.scss, _sidebar.scss, _components.scss, _prose.scss
    main.scss             — imports all the above, this is what main.jsx loads

public/
  content/                — UNCHANGED. Every real markdown/JSON file the
                            site shows. Still edit these directly, still
                            no build step needed for content-only changes.
  partials/templates/     — do-dont.hbs, callout.hbs (real Handlebars partials)

worker/                   — Stage 2 Cloudflare Worker, unchanged, not deployed yet
```

## Why SCSS instead of plain CSS

Each `.scss` file under `src/styles/` now supports real Sass features —
variables (`$sidebar-width`), nesting (`.apy-tab { &.active { ... } }`),
and `@media` inside a selector — instead of flat CSS. `_variables.scss`
defines both:
- **SCSS `$variables`** for build-time values only SCSS itself needs
  (breakpoints, spacing math)
- **CSS custom properties** (`--color-ink` etc.) that stay because
  inline JS styles (`style={{ color: "var(--color-ink)" }}`) read them
  at runtime — SCSS variables don't exist in the browser, so this isn't
  redundant, it's two different things with two different jobs.

## Matching a reference site's look without copying its code

If you're comparing this against another site's real markup in DevTools:
match the **visual facts** — font sizes, weights, colors, spacing, layout
structure — freely; those aren't copyrightable. Don't copy their literal
class names, IDs, or file structure. This codebase uses its own semantic
class names (`.apy-tab`, `.apy-gray-band`, etc.) on purpose — pasting a
value from a real inspected element into the matching Apiary class/rule
is exactly the intended workflow.

## The person you're handing this to

Non-technical-but-capable, runs terminal commands exactly as given. Same
safety habits as before still apply: check `git status` before committing,
not after.
