import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base is "./" (relative) so the built site can be deployed to GitHub
// Pages at a sub-path (e.g. asmithdigital.github.io/apiary/) without
// needing to know that path at build time.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
