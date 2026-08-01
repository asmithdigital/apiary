/* =============================================================================
   PARTIAL: layout-chrome — GrayBand (the title banner at the top of every
   page), TabStrip, Section, and ContentsRail (the "on this page" secondary
   menu). ContentsRail has no content file of its own on purpose — it's
   built from whatever real section headings exist on the current page.
============================================================================= */
function GrayBand({ title, description, extra }) {
  return (
    <div className="apy-gray-band">
      <div className="apy-gray-band-inner">
        <div className="apy-gray-band-title-row">
          <h1>{title}</h1>
          {extra}
        </div>
        {description && <p className="apy-gray-band-desc">{description}</p>}
      </div>
    </div>
  );
}

function TabStrip({ tabs, active, onChange }) {
  return (
    <div className="apy-tabstrip">
      <div className="apy-tabstrip-inner">
        {tabs.map((t) => (
          <button key={t} onClick={() => onChange(t)} className={"apy-tab" + (active === t ? " active" : "")}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 32 }}>
      {title && <h2 style={{ fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 10 }}>{title}</h2>}
      {children}
    </section>
  );
}

function ContentsRail({ items }) {
  if (!items || !items.length) return null;
  return (
    <div className="apy-contents-rail">
      <div className="apy-contents-rail-title">On this page</div>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className="apy-contents-rail-link">{it.label}</a>
      ))}
    </div>
  );
}
