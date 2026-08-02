/* =============================================================================
   Apiary content API — a tiny Cloudflare Worker.

   GET  /content?path=...   → real content: KV first, real GitHub file as fallback
   POST /content             → write: KV + a real GitHub commit (needs a logged-in
                                GitHub token with write access to the repo)
   POST /sync                → internal use only, called by the GitHub Action when
                                someone edits a .md file directly on GitHub
   GET  /auth/start           → begins GitHub OAuth login
   GET  /auth/callback        → finishes it, hands the browser a real token

   This file touches three real secrets (GITHUB_CLIENT_SECRET, SYNC_SECRET, and
   nothing else) — set via `wrangler secret put`, never committed to the repo.
============================================================================= */

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

async function ghFetch(url, token, opts = {}) {
  return fetch(url, {
    ...opts,
    headers: { ...opts.headers, Authorization: `Bearer ${token}`, "User-Agent": "apiary-worker", Accept: "application/vnd.github+json" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Sync-Secret",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    // ---------- READ: KV first, real GitHub file as fallback ----------
    if (url.pathname === "/content" && request.method === "GET") {
      const path = url.searchParams.get("path");
      if (!path) return json({ error: "path required" }, 400, cors);
      const kvValue = await env.CONTENT_KV.get(path);
      if (kvValue !== null) return json({ value: kvValue, source: "kv" }, 200, cors);
      const ghUrl = `https://raw.githubusercontent.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/${env.GITHUB_BRANCH || "main"}/${path}`;
      const ghRes = await fetch(ghUrl);
      if (!ghRes.ok) return json({ error: "not found" }, 404, cors);
      const value = await ghRes.text();
      return json({ value, source: "github" }, 200, cors);
    }

    // ---------- WRITE: real edit from the front-end editor ----------
    if (url.pathname === "/content" && request.method === "POST") {
      const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      if (!token) return json({ error: "not logged in" }, 401, cors);

      const userRes = await ghFetch("https://api.github.com/user", token);
      if (!userRes.ok) return json({ error: "invalid or expired login" }, 401, cors);
      const user = await userRes.json();

      const permRes = await ghFetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/collaborators/${user.login}/permission`, token);
      const perm = permRes.ok ? await permRes.json() : null;
      if (!perm || !["write", "admin"].includes(perm.permission)) {
        return json({ error: `${user.login} doesn't have write access to this repo` }, 403, cors);
      }

      const { path, content, message } = await request.json();
      if (!path || content == null) return json({ error: "path and content required" }, 400, cors);

      await env.CONTENT_KV.put(path, content);

      // Also commit the same content to GitHub — under the real user's own
      // token, so the commit is attributed to the person who actually made it.
      const getRes = await ghFetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}?ref=${env.GITHUB_BRANCH || "main"}`, token);
      const existing = getRes.ok ? await getRes.json() : null;
      const putRes = await ghFetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`, token, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message || `Edit ${path} via Apiary editor (${user.login})`,
          content: btoa(unescape(encodeURIComponent(content))),
          sha: existing ? existing.sha : undefined,
          branch: env.GITHUB_BRANCH || "main",
        }),
      });
      if (!putRes.ok) {
        const detail = await putRes.text();
        // Saved to the database even if the GitHub commit failed — the site
        // still reflects the edit; the repo just won't have caught up yet.
        return json({ ok: true, savedToKV: true, githubCommitFailed: true, detail }, 200, cors);
      }
      return json({ ok: true, savedToKV: true, committedToGithub: true }, 200, cors);
    }

    // ---------- INTERNAL: the GitHub Action calls this on every push ----------
    if (url.pathname === "/sync" && request.method === "POST") {
      if (request.headers.get("X-Sync-Secret") !== env.SYNC_SECRET) return json({ error: "forbidden" }, 403, cors);
      const { path, content } = await request.json();
      if (!path || content == null) return json({ error: "path and content required" }, 400, cors);
      await env.CONTENT_KV.put(path, content);
      return json({ ok: true }, 200, cors);
    }

    // ---------- LOGIN ----------
    if (url.pathname === "/auth/start" && request.method === "GET") {
      const redirect = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=repo&redirect_uri=${encodeURIComponent(env.OAUTH_CALLBACK_URL)}`;
      return Response.redirect(redirect, 302);
    }
    if (url.pathname === "/auth/callback" && request.method === "GET") {
      const code = url.searchParams.get("code");
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
      });
      const data = await tokenRes.json();
      // Hands the token to the browser via a URL fragment — simple and fine
      // for a small internal team tool, not meant for a public product with
      // untrusted users. The app stores it in sessionStorage from there.
      return Response.redirect(`${env.APP_URL}#/auth-success?token=${data.access_token}`, 302);
    }

    return json({ error: "not found" }, 404, cors);
  },
};
