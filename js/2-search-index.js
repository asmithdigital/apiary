/* =============================================================================
   SearchIndex — a real, full-content search index built entirely in the
   browser, from the same real files everything else on this site reads.

   Why client-side instead of a pre-built index file: this whole project is
   deliberately "no build step" — edit a real markdown or JSON file on
   GitHub and the live site picks it up on next load, nothing to
   regenerate. A pre-built search-index.json would silently go stale the
   moment someone edited a file on GitHub without also re-running a build.
   Building the index fresh, in the browser, from the live files each time
   it's needed means it can never be out of sync with what's actually in
   the repo — the cost is a handful of small fetches the first time
   someone actually searches, not on every page load.
============================================================================= */
window.SearchIndex = (function () {
  let cache = null;
  let building = null;

  async function build() {
    if (cache) return cache;
    if (building) return building;

    building = (async () => {
      const entries = [];

      // Components — real summary text, not just the name.
      await Promise.all(NAV.components.map(async (c) => {
        try {
          const specs = await fetchJSON(`./content/components/${c.id}/specs.json`);
          entries.push({
            type: "Component", id: c.id, title: c.name,
            snippet: specs.summary || "",
            route: { kind: "component", ref: c },
          });
        } catch { entries.push({ type: "Component", id: c.id, title: c.name, snippet: "", route: { kind: "component", ref: c } }); }
      }));

      // Foundations — real page body text.
      await Promise.all(NAV.foundationKeys.map(async (key) => {
        try {
          const doc = await fetchMarkdown(`./content/foundations/${key}/v1.md`);
          entries.push({
            type: "Foundation", id: key, title: NAV.foundationLabels[key] || key,
            snippet: (doc.raw || "").replace(/[#*_`]/g, "").slice(0, 160),
            route: { kind: "foundation", ref: key },
          });
        } catch { entries.push({ type: "Foundation", id: key, title: NAV.foundationLabels[key] || key, snippet: "", route: { kind: "foundation", ref: key } }); }
      }));

      // Get Started pages — real page body text, plus their section label
      // (e.g. "About") so a search for the section name surfaces its pages.
      await Promise.all(NAV.getStartedItems.map(async (item) => {
        try {
          const doc = await fetchMarkdown(`./content/get-started/${item.key}.md`);
          entries.push({
            type: "Get started", id: item.key, title: item.label,
            snippet: `${item.section || ""} — ${(doc.raw || "").replace(/[#*_`]/g, "").slice(0, 140)}`,
            route: { kind: "getstarted", ref: item.key },
          });
        } catch { entries.push({ type: "Get started", id: item.key, title: item.label, snippet: item.section || "", route: { kind: "getstarted", ref: item.key } }); }
      }));

      cache = entries;
      return entries;
    })();

    return building;
  }

  async function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const index = await build();
    return index
      .map((e) => {
        const inTitle = e.title.toLowerCase().includes(q);
        const inSnippet = e.snippet.toLowerCase().includes(q);
        if (!inTitle && !inSnippet) return null;
        return { ...e, score: inTitle ? 2 : 1 };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }

  return { build, search };
})();
