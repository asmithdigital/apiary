/* =============================================================================
   COMPONENT: Sidebar — the whole left-hand menu. Reads content/nav.json for
   everything it shows (Get Started items, Foundations, Components, Families)
   — add an item there, it shows up here automatically. Edit THIS file only
   to change the menu's structure/behaviour; edit styles/_sidebar.scss to
   restyle it.
============================================================================= */
import { useState } from "react";
import {
  Zap, PenLine, AlertCircle, Compass, Layers, Image as ImageIcon, LayoutGrid, Map,
} from "lucide-react";
import { store } from "../lib/store.js";
import { saveMarkdownOverride } from "../lib/content.js";
import { CATEGORY_STYLE } from "../lib/categoryStyle.js";

const ICONS = { Zap, PenLine, AlertCircle, Compass, Layers, ImageIcon, LayoutGrid, Map };

function familyGroupKey(family) {
  const first = store.NAV.components.find((c) => c.id === family.members[0]);
  return first ? first.groupKey : "actions";
}
function getFamilyMemberIds() {
  return new Set(store.NAV.families.flatMap((f) => f.members));
}

export function Sidebar({ page, navigate }) {
  const NAV = store.NAV;
  const [openGroups, setOpenGroups] = useState({ getStarted: true, foundations: true, actions: true });
  const toggle = (k) => setOpenGroups((o) => ({ ...o, [k]: !o[k] }));

  // Stage 1 "add a page" — mutates the shared NAV object directly (it's
  // plain data, not React state) and seeds a blank session-only content
  // override so the new page has something to show. navigate() right after
  // forces the whole tree (including this sidebar) to re-render and pick it
  // up. No backend yet — this only lasts for the current session.
  function addGetStartedPage() {
    const label = window.prompt("New Get Started page title:");
    if (!label) return;
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    NAV.getStartedItems.push({ key, label, section: "About" });
    NAV.getStartedLabels[key] = label;
    saveMarkdownOverride(`./content/get-started/${key}.md`, "_New page — click Edit above to add real content._", { name: label, status: "pending" });
    navigate({ kind: "getstarted", ref: key });
  }

  const getStartedSections = [];
  NAV.getStartedItems.forEach((it) => {
    const sec = it.section || "About";
    let bucket = getStartedSections.find((s) => s.name === sec);
    if (!bucket) {
      bucket = { name: sec, items: [] };
      getStartedSections.push(bucket);
    }
    bucket.items.push(it);
  });

  return (
    <div className="apy-sidebar">
      <button onClick={() => navigate({ kind: "home" })} className={"apy-nav-home" + (page.kind === "home" ? " active" : "")}>
        Home
      </button>

      <div className="apy-nav-section">
        <div className="apy-nav-section-label-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => toggle("getStarted")} className="apy-nav-section-label" style={{ flex: 1 }}>
            {openGroups.getStarted ? "▾" : "▸"} Get Started
          </button>
          <button className="apy-sidebar-add-btn" title="Add a new Get Started page" onClick={addGetStartedPage}>
            +
          </button>
        </div>
        {openGroups.getStarted &&
          getStartedSections.map((sec) => (
            <div key={sec.name}>
              <button onClick={() => toggle("gs-" + sec.name)} className="apy-nav-group-label">
                {openGroups["gs-" + sec.name] !== false ? "▾" : "▸"} {sec.name}
              </button>
              {openGroups["gs-" + sec.name] !== false &&
                sec.items.map((it) => (
                  <button
                    key={it.key}
                    onClick={() => navigate({ kind: "getstarted", ref: it.key })}
                    className={"apy-nav-leaf" + (page.kind === "getstarted" && page.ref === it.key ? " active" : "")}
                    style={{ paddingLeft: 52 }}
                  >
                    <span>{it.label}</span>
                  </button>
                ))}
            </div>
          ))}
      </div>

      <div className="apy-nav-section">
        <div className="apy-nav-section-label-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => toggle("foundations")} className="apy-nav-section-label" style={{ flex: 1 }}>
            {openGroups.foundations ? "▾" : "▸"} Foundations
          </button>
          <button
            className="apy-sidebar-add-btn"
            title="Add a new Foundation page"
            onClick={() => {
              const label = window.prompt("New Foundation page title:");
              if (!label) return;
              const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              NAV.foundationKeys.push(key);
              NAV.foundationLabels[key] = label;
              saveMarkdownOverride(`./content/foundations/${key}/v1.md`, "_New foundation — click Edit above to add real content._", { name: label, status: "pending" });
              navigate({ kind: "foundation", ref: key });
            }}
          >
            +
          </button>
        </div>
        {openGroups.foundations &&
          NAV.foundationKeys.map((k) => (
            <button key={k} onClick={() => navigate({ kind: "foundation", ref: k })} className={"apy-nav-item" + (page.kind === "foundation" && page.ref === k ? " active" : "")}>
              {NAV.foundationLabels[k]}
            </button>
          ))}
      </div>

      <div className="apy-nav-section">
        <div className="apy-components-heading">Components</div>
        {NAV.componentGroups.map((g) => {
          const familiesInGroup = NAV.families.filter((f) => familyGroupKey(f) === g.key);
          const memberIds = getFamilyMemberIds();
          const standalone = NAV.components.filter((c) => c.groupKey === g.key && !memberIds.has(c.id));
          return (
            <div key={g.key}>
              <button onClick={() => toggle(g.key)} className="apy-nav-group-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {openGroups[g.key] ? "▾" : "▸"}
                {(() => {
                  const style = CATEGORY_STYLE[g.key];
                  if (!style) return null;
                  const Icon = ICONS[style.icon] || ICONS.LayoutGrid;
                  return <Icon size={12} color={style.fg} />;
                })()}
                {g.label}
              </button>
              {openGroups[g.key] && (
                <>
                  {familiesInGroup.map((f) => (
                    <button key={f.id} onClick={() => navigate({ kind: "family", ref: f })} className={"apy-nav-leaf" + (page.kind === "family" && page.ref?.id === f.id ? " active" : "")}>
                      <span>{f.label}</span>
                      <span className="apy-nav-leaf-count">{f.members.length}</span>
                    </button>
                  ))}
                  {standalone.map((c) => (
                    <button key={c.id} onClick={() => navigate({ kind: "component", ref: c })} className={"apy-nav-leaf" + (page.kind === "component" && page.ref?.id === c.id ? " active" : "")}>
                      <span>{c.name}</span>
                      {!c.hasGuidelines && <span title="No real documentation yet" className="apy-nav-leaf-nodoc" />}
                    </button>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
