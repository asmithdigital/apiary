import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base is the real subpath this site is served from on GitHub Pages
// (asmithdigital.github.io/apiary/). This must be an absolute path, not
// "./" — resolveUrl() in src/lib/store.js reads import.meta.env.BASE_URL
// at runtime to build absolute fetch URLs for content files, so this
// value has to actually be "/apiary/" for that to work. If the repo is
// ever renamed, or served from a custom domain at the root instead of a
// subpath, update this to match (root domain = "/").
export default defineConfig({
  base: "/apiary/",
  plugins: [react()],
});
