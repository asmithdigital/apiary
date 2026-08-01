/* =============================================================================
   PARTIAL: editable — Stage 1 of the editing interface. Hover any real
   content, click the pencil, edit as plain markdown with a small toolbar,
   Save updates it for this session only (js/0-markdown.js's SESSION_OVERRIDES
   map) — reload the page and it's back to the real file on GitHub. Stage 2
   replaces the Save handler with a real GitHub API commit; nothing else
   here needs to change when that happens.
============================================================================= */
// Real GitHub login — click it, approve on GitHub's real login screen, land
// back here with a real token stored for this browser tab (sessionStorage,
// not localStorage — closing the tab signs you out, which is the safer
// default for a shared/team machine).
function AuthButton() {
  const [user, setUser] = useState(sessionStorage.getItem("apiary_gh_user"));

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/token=([^&]+)/);
    if (match && hash.includes("auth-success")) {
      const token = decodeURIComponent(match[1]);
      sessionStorage.setItem("apiary_gh_token", token);
      fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((u) => { sessionStorage.setItem("apiary_gh_user", u.login); setUser(u.login); window.location.hash = "#/"; });
    }
  }, []);

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        <span style={{ color: "var(--color-faint)" }}>Signed in as <strong style={{ color: "var(--color-ink)" }}>{user}</strong></span>
        <button onClick={() => { sessionStorage.removeItem("apiary_gh_token"); sessionStorage.removeItem("apiary_gh_user"); setUser(null); }}
          style={{ background: "none", border: "1px solid var(--color-line)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Sign out</button>
      </div>
    );
  }
  return (
    <a href={`${window.APIARY_API}/auth/start`} className="apy-btn-primary" style={{ padding: "6px 14px", fontSize: 13, textDecoration: "none" }}>
      Sign in with GitHub
    </a>
  );
}

function MarkdownToolbar({ onInsert }) {
  const buttons = [
    { label: "B", title: "Bold", wrap: "**" },
    { label: "I", title: "Italic", wrap: "_" },
    { label: "H2", title: "Heading", prefix: "## " },
    { label: "•", title: "List item", prefix: "- " },
  ];
  return (
    <div style={{ display: "flex", gap: 4, padding: "6px 8px", background: "var(--color-band)", borderBottom: "1px solid var(--color-line)", borderRadius: "10px 10px 0 0" }}>
      {buttons.map((b) => (
        <button key={b.label} title={b.title} onClick={() => onInsert(b)}
          style={{ width: 26, height: 26, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--color-body)" }}>
          {b.label}
        </button>
      ))}
    </div>
  );
}

// Wraps a MarkdownBody so it can be edited in place. Give it the fetch url
// and the currently-loaded doc ({meta, html, raw}) — it owns re-fetching
// after a save so the rendered HTML (including any {{> do-dont}} etc) stays
// correct rather than just swapping in unrendered text.
function EditableMarkdown({ url, doc, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef(null);

  const startEdit = () => { setDraft(doc.raw); setEditing(true); };

  const insert = (b) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e);
    let next;
    if (b.wrap) next = value.slice(0, s) + b.wrap + selected + b.wrap + value.slice(e);
    else next = value.slice(0, s) + b.prefix + selected + value.slice(e);
    setDraft(next);
    requestAnimationFrame(() => { el.focus(); });
  };

  const [saveMsg, setSaveMsg] = useState(null);
  const save = async () => {
    setSaving(true);
    setSaveMsg(null);
    const result = await window.saveMarkdownOverride(url, draft, doc.meta);
    const updated = await fetchMarkdown(url);
    setSaving(false);
    onSaved(updated);
    if (result.ok) {
      setSaveMsg({ type: "success", text: result.committedToGithub ? "Saved — committed to GitHub and live for everyone." : "Saved to the database." });
      setTimeout(() => setEditing(false), 900);
    } else {
      setSaveMsg({ type: "error", text: result.error });
    }
  };

  if (!editing) {
    return (
      <div className="apy-editable-wrap">
        <button className="apy-edit-pencil" onClick={startEdit} title="Edit this content">✎ Edit</button>
        <MarkdownBody html={doc.html} />
      </div>
    );
  }

  return (
    <div className="apy-edit-panel">
      <MarkdownToolbar onInsert={insert} />
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="apy-edit-textarea"
        rows={16}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderTop: "1px solid var(--color-line)" }}>
        <span style={{ fontSize: 12, color: saveMsg ? (saveMsg.type === "success" ? "var(--color-success-text)" : "var(--color-danger-text)") : "var(--color-faint)" }}>
          {saveMsg ? saveMsg.text : "Saves for real once you're logged in — see the Sign in button in the top bar."}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setEditing(false)} style={{ padding: "6px 14px", fontSize: 13, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} className="apy-btn-primary" style={{ padding: "6px 16px", fontSize: 13 }}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

// Same idea for a page's h1 title — hover, pencil, inline text input, Save.
function EditableTitle({ title, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  if (!editing) {
    return (
      <span className="apy-editable-title-wrap">
        <h1>{title}</h1>
        <button className="apy-edit-pencil-inline" onClick={() => { setDraft(title); setEditing(true); }} title="Edit title">✎</button>
      </span>
    );
  }
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} className="apy-edit-title-input" autoFocus />
      <button onClick={() => { onSave(draft); setEditing(false); }} className="apy-btn-primary" style={{ padding: "6px 14px", fontSize: 13 }}>Save</button>
      <button onClick={() => setEditing(false)} style={{ padding: "6px 14px", fontSize: 13, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
    </span>
  );
}
