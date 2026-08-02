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

// Relative fetches like "./content/x.json" resolve against the CURRENT
// DOCUMENT URL, not against where the app is actually deployed — if
// someone visits the site without a trailing slash (e.g. ".../apiary"
// instead of ".../apiary/"), the browser drops the last path segment and
// "./content/x.json" 404s. Resolving against import.meta.env.BASE_URL
// (Vite's configured deploy base) instead makes every fetch work
// regardless of the URL's trailing slash.
export function resolveUrl(path) {
  const clean = path.replace(/^\.\//, "");
  const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + "/";
  return base + clean;
}

export async function fetchJSON(url) {
  const res = await fetch(resolveUrl(url));
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
