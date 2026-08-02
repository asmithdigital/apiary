import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import App from "./App.jsx";
import { loadStore } from "./lib/store.js";

async function boot() {
  const root = document.getElementById("root");
  root.innerHTML = '<div style="font-family:Inter,sans-serif;padding:60px;color:#64748B">Loading real data…</div>';
  try {
    await loadStore();
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    root.innerHTML = `<div style="font-family:Inter,sans-serif;padding:60px;color:#DC2626">Failed to load real data: ${err.message}. Check /content/ files exist and this is served over http(s), not file://.</div>`;
  }
}

boot();
