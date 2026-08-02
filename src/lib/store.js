// Real site-wide data, loaded once at boot (see main.jsx) before anything
// renders. Everything that reads this does so inside a render or effect —
// never at module-eval time — so there's no chance of reading it before
// it's populated. This replaces the old global `NAV`/`MANIFEST`/`R`
// variables from the no-build version; same idea, just not on `window`.
export const store = {
  NAV: null,
  MANIFEST: null,
  R: null,
};

export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

export async function loadStore() {
  const [nav, manifest, r] = await Promise.all([
    fetchJSON("./content/nav.json"),
    fetchJSON("./content/manifest.json"),
    fetchJSON("./content/R.json"),
  ]);
  store.NAV = nav;
  store.MANIFEST = manifest;
  store.R = r;
}
