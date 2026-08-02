/* =============================================================================
   DraftStore — the session-only "pretend database" for newly-created pages.
   Real existing components/foundations/get-started pages still come from
   real markdown+JSON files in content/ (untouched by this). This store only
   holds pages created THIS session via "+ New page" — title, description,
   status, version, tabs, and the ordered list of content blocks in each tab.

   This is deliberately shaped the way a real database table would be:
   one flat object keyed by page id, each page a plain JSON-serialisable
   record. When Stage 2 adds a real database, this file's job becomes
   "fetch this same shape from the API" instead of holding it in memory —
   nothing that reads from DraftStore elsewhere needs to change.

   In-memory only, on purpose: refresh the page and it's gone, exactly like
   Stage 1's markdown edits. That's consistent, not a shortcut.
============================================================================= */
window.DraftStore = (function () {
  let pages = {};
  let listeners = [];

  function notify() { listeners.forEach((fn) => fn()); }
  function subscribe(fn) { listeners.push(fn); return () => { listeners = listeners.filter((f) => f !== fn); }; }

  function defaultTabsFor(type) {
    if (type === "component" || type === "pattern") {
      return [
        { id: "examples", label: "Examples", blocks: [] },
        { id: "usage", label: "Usage", blocks: [] },
        { id: "specs", label: "Specs", blocks: [] },
        { id: "changelog", label: "Changelog", blocks: [] },
      ];
    }
    return [{ id: "content", label: "Content", blocks: [] }];
  }

  function createPage({ id, type, title, description, status, groupKey }) {
    if (pages[id]) return pages[id]; // never silently clobber
    pages[id] = {
      id, type, title,
      description: description || "",
      status: status || "new",
      groupKey: groupKey || "actions",
      version: "v1",
      versions: ["v1"],
      createdAt: new Date().toISOString(),
      tabs: defaultTabsFor(type),
    };
    notify();
    return pages[id];
  }

  function getPage(id) { return pages[id] || null; }
  function isDraft(id) { return !!pages[id]; }

  function updatePageMeta(id, patch) {
    const p = pages[id]; if (!p) return;
    Object.assign(p, patch);
    notify();
  }

  function addTab(pageId, label) {
    const p = pages[pageId]; if (!p) return null;
    const tabId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || ("tab" + p.tabs.length);
    const tab = { id: tabId, label, blocks: [] };
    p.tabs.push(tab);
    notify();
    return tab;
  }

  function addBlock(pageId, tabId, block) {
    const p = pages[pageId]; if (!p) return null;
    const tab = p.tabs.find((t) => t.id === tabId); if (!tab) return null;
    const newBlock = { id: "b" + Math.random().toString(36).slice(2, 9), ...block };
    tab.blocks.push(newBlock);
    notify();
    return newBlock;
  }

  function updateBlock(pageId, tabId, blockId, patch) {
    const p = pages[pageId]; if (!p) return;
    const tab = p.tabs.find((t) => t.id === tabId); if (!tab) return;
    const b = tab.blocks.find((b) => b.id === blockId); if (!b) return;
    Object.assign(b, patch);
    notify();
  }

  function removeBlock(pageId, tabId, blockId) {
    const p = pages[pageId]; if (!p) return;
    const tab = p.tabs.find((t) => t.id === tabId); if (!tab) return;
    tab.blocks = tab.blocks.filter((b) => b.id !== blockId);
    notify();
  }

  function moveBlock(pageId, tabId, blockId, dir) {
    const p = pages[pageId]; if (!p) return;
    const tab = p.tabs.find((t) => t.id === tabId); if (!tab) return;
    const i = tab.blocks.findIndex((b) => b.id === blockId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= tab.blocks.length) return;
    [tab.blocks[i], tab.blocks[j]] = [tab.blocks[j], tab.blocks[i]];
    notify();
  }

  function bumpVersion(pageId) {
    const p = pages[pageId]; if (!p) return null;
    const n = parseInt(p.version.replace(/\D/g, ""), 10) || 1;
    const next = "v" + (n + 1);
    p.version = next;
    p.versions.push(next);
    notify();
    return next;
  }

  // The "what a database row would look like" export — this is the JSON
  // shape shown in the Data Layer panel, and the same shape Stage 2's
  // Worker/KV (or a real database) would store and serve.
  function exportJSON() { return JSON.parse(JSON.stringify(pages)); }

  function all() { return pages; }

  return {
    createPage, getPage, isDraft, updatePageMeta,
    addTab, addBlock, updateBlock, removeBlock, moveBlock, bumpVersion,
    exportJSON, all, subscribe,
  };
})();
