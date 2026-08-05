// Populated once by boot() below, before APIary ever renders. Everything
// that reads these does so inside a render or effect — never at the
// top of a file — so there's no chance of reading them before they exist.
let NAV = null;
let MANIFEST = null;

function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [kind, ref] = h.split("/").map(decodeURIComponent);
  if (!kind || kind === "home") return { kind: "home" };
  if (kind === "component") {
    const c = NAV.components.find((c) => c.id === ref);
    return c ? { kind: "component", ref: c } : { kind: "home" };
  }
  if (kind === "family") {
    const f = NAV.families.find((f) => f.id === ref);
    return f ? { kind: "family", ref: f } : { kind: "home" };
  }
  if (kind === "foundation") return { kind: "foundation", ref: ref || NAV.foundationKeys[0] };
  if (kind === "getstarted") return { kind: "getstarted", ref: ref || NAV.getStartedItems[0].key };
  return { kind: "home" };
}
function encodeHash(page) {
  if (page.kind === "component") return `#/component/${encodeURIComponent(page.ref.id)}`;
  if (page.kind === "family") return `#/family/${encodeURIComponent(page.ref.id)}`;
  if (page.kind === "foundation") return `#/foundation/${encodeURIComponent(page.ref)}`;
  if (page.kind === "getstarted") return `#/getstarted/${encodeURIComponent(page.ref)}`;
  return "#/";
}

function APIary() {
  const [page, setPage] = useState(() => parseHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = (target) => {
    const next = ["foundation", "component", "getstarted", "family"].includes(target.kind) ? target : { kind: target.kind };
    setPage(next);
    window.location.hash = encodeHash(next);
    window.scrollTo?.(0, 0);
    setMobileMenuOpen(false);
  };
  useEffect(() => {
    const onHashChange = () => setPage(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (page.kind === "home") {
    return <div className="apy-home-wrap"><HomePage navigate={navigate} /><DataLayerPanel /></div>;
  }
  return (
    <div className="apy-app-shell">
      <Header onNavigate={navigate} onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)} />
      <div className="apy-body-row">
        <div className={"apy-sidebar-wrap" + (mobileMenuOpen ? " apy-sidebar-open" : "")}>
          <Sidebar page={page} navigate={navigate} />
          <div className="apy-mobile-auth-row"><AuthButton /></div>
        </div>
        {mobileMenuOpen && <div className="apy-mobile-scrim" onClick={() => setMobileMenuOpen(false)} />}
        <div className="apy-content-scroll">
          {page.kind === "getstarted" && <GetStartedPage pageKey={page.ref} pageLabel={NAV.getStartedLabels[page.ref]} navigate={navigate} />}
          {page.kind === "foundation" && <FoundationsPage foundationKey={page.ref} foundationLabel={NAV.foundationLabels[page.ref]} />}
          {page.kind === "component" && <DetailPage id={page.ref.id} name={page.ref.name} />}
          {page.kind === "family" && <FamilyPage family={page.ref} />}
        </div>
      </div>
      <DataLayerPanel />
    </div>
  );
}

async function boot() {
  const root = document.getElementById("root");
  root.innerHTML = '<div style="font-family:Inter,sans-serif;padding:60px;color:#64748B">Loading real data…</div>';
  try {
    const [nav, manifest, r] = await Promise.all([
      fetchJSON("./content/nav.json"),
      fetchJSON("./content/manifest.json"),
      fetchJSON("./content/R.json"),
    ]);
    NAV = nav; MANIFEST = manifest; R = r;
    ReactDOM.createRoot(root).render(<APIary />);
  } catch (err) {
    root.innerHTML = `<div style="font-family:Inter,sans-serif;padding:60px;color:#DC2626">Failed to load real data: ${err.message}. Check /content/ files exist and this is served over http(s), not file://.</div>`;
  }
}

if (window.__bootReady) boot();
else window.addEventListener("apiary-boot-ready", boot);
