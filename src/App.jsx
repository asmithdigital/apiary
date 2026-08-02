import { useState, useEffect } from "react";
import { store } from "./lib/store.js";
import { Header } from "./components/Header.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { GetStartedPage } from "./pages/GetStartedPage.jsx";
import { FoundationsPage } from "./pages/FoundationsPage.jsx";
import { DetailPage, FamilyPage } from "./pages/DetailPage.jsx";

function parseHash() {
  const NAV = store.NAV;
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

export default function App() {
  const [page, setPage] = useState(() => parseHash());
  const navigate = (target) => {
    const next = ["foundation", "component", "getstarted", "family"].includes(target.kind) ? target : { kind: target.kind };
    setPage(next);
    window.location.hash = encodeHash(next);
    window.scrollTo?.(0, 0);
  };
  useEffect(() => {
    const onHashChange = () => setPage(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (page.kind === "home") {
    return (
      <div className="apy-home-wrap">
        <HomePage navigate={navigate} />
      </div>
    );
  }
  return (
    <div className="apy-app-shell">
      <Header onNavigate={navigate} />
      <div className="apy-body-row">
        <Sidebar page={page} navigate={navigate} />
        <div className="apy-content-scroll">
          {page.kind === "getstarted" && <GetStartedPage pageKey={page.ref} pageLabel={store.NAV.getStartedLabels[page.ref]} navigate={navigate} />}
          {page.kind === "foundation" && <FoundationsPage foundationKey={page.ref} foundationLabel={store.NAV.foundationLabels[page.ref]} />}
          {page.kind === "component" && <DetailPage id={page.ref.id} name={page.ref.name} />}
          {page.kind === "family" && <FamilyPage family={page.ref} />}
        </div>
      </div>
    </div>
  );
}
