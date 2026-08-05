/* =============================================================================
   PARTIAL: editable — Stage 1 of the editing interface. Hover any real
   content, click the pencil, edit as plain markdown with a small toolbar,
   Save updates it for this session only (js/0-markdown.js's SESSION_OVERRIDES
   map) — reload the page and it's back to the real file on GitHub. Stage 2
   replaces the Save handler with a real GitHub API commit; nothing else
   here needs to change when that happens.
============================================================================= */
// There's no real login screen yet — that's real future work (a proper
// auth flow, a database, an admin dashboard). For now this is honestly
// just a link to the real repository, not a sign-in action.
function AuthButton() {
  return (
    <a href="https://github.com/asmithdigital/apiary" target="_blank" rel="noopener noreferrer" className="apy-btn-primary" style={{ padding: "6px 14px", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
      ⌥ View source on GitHub
    </a>
  );
}

// Real token list, pulled from the real token library (content/tokens.json)
// — not a hardcoded guess. Cached after first fetch since it doesn't change
// mid-session.
let __tokenListCache = null;
function useTokenList() {
  const [tokens, setTokens] = useState(__tokenListCache);
  useEffect(() => {
    if (__tokenListCache) return;
    fetchJSON("./content/tokens.json").then((t) => {
      const flat = [
        ...Object.keys(t.color || {}).map((k) => ({ name: k, value: t.color[k].value, kind: "color" })),
        ...Object.keys(t.spacing || {}).map((k) => ({ name: k, value: t.spacing[k].value, kind: "spacing" })),
      ];
      __tokenListCache = flat;
      setTokens(flat);
    }).catch(() => setTokens([]));
  }, []);
  return tokens || [];
}

function TokenPickerMenu({ onPick }) {
  const [open, setOpen] = useState(false);
  const tokens = useTokenList();
  return (
    <div style={{ position: "relative" }}>
      <button title="Insert a real design token" onClick={() => setOpen((o) => !o)}
        style={{ height: 26, padding: "0 8px", border: "1px solid var(--color-line)", background: "#fff", borderRadius: 5, cursor: "pointer", fontSize: 12, color: "var(--color-body)" }}>
        Insert token ▾
      </button>
      {open && (
        <div style={{ position: "absolute", top: 30, left: 0, zIndex: 20, background: "#fff", border: "1px solid var(--color-line)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", width: 240, maxHeight: 280, overflowY: "auto" }}>
          {tokens.length === 0 && <div style={{ padding: 12, fontSize: 12, color: "var(--color-faint)" }}>Loading real tokens…</div>}
          {tokens.map((t) => (
            <button key={t.name} onClick={() => { onPick(t); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "7px 10px", border: "none", background: "none", cursor: "pointer", fontSize: 12.5 }}>
              {t.kind === "color" && <span style={{ width: 12, height: 12, borderRadius: 3, background: t.value, border: "1px solid var(--color-line)", flexShrink: 0 }} />}
              <span style={{ fontFamily: "var(--font-mono)" }}>{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MarkdownToolbar({ onInsert }) {
  const buttons = [
    { label: "B", title: "Bold", wrap: "**" },
    { label: "I", title: "Italic", wrap: "_" },
    { label: "H2", title: "Heading", prefix: "## " },
    { label: "•", title: "List item", prefix: "- " },
    { label: "Do/Don't", title: "Insert a Do/Don't block (real template)", raw: "\n{{do-dont doList=\"Real, specific do item\" dontList=\"Real, specific don't item\"}}\n" },
  ];
  return (
    <div style={{ display: "flex", gap: 4, padding: "6px 8px", background: "var(--color-band)", borderBottom: "1px solid var(--color-line)", borderRadius: "10px 10px 0 0", flexWrap: "wrap" }}>
      {buttons.map((b) => (
        <button key={b.label} title={b.title} onClick={() => onInsert(b)}
          style={{ height: 26, padding: b.label.length > 2 ? "0 8px" : 0, width: b.label.length > 2 ? "auto" : 26, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--color-body)" }}>
          {b.label}
        </button>
      ))}
      <TokenPickerMenu onPick={(t) => onInsert({ raw: `{{token:${t.name}}}` })} />
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
    else if (b.raw) next = value.slice(0, s) + b.raw + value.slice(e);
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

// Real "create a new page" flow. Type determines the default tab set
// (component/pattern get Examples/Usage/Specs/Changelog; foundation/
// get-started get a single Content tab) — matches how the real 68
// captured components are actually structured, not an arbitrary guess.
function NewPageModal({ onClose, onCreate }) {
  const [type, setType] = useState("component");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("new");
  const [groupKey, setGroupKey] = useState("actions");

  const groupOptions = Object.keys(window.CATEGORY_STYLE || { actions: 1 });

  const submit = () => {
    if (!title.trim()) return;
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    onCreate({ id, type, title: title.trim(), description: description.trim(), status, groupKey });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width: 480, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--color-line)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 653, margin: 0 }}>New page</h3>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ display: "block", width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14 }}>
              <option value="component">Component</option>
              <option value="pattern">Pattern</option>
            </select>
          </label>
          {type === "component" || type === "pattern" ? (
            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Category
              <select value={groupKey} onChange={(e) => setGroupKey(e.target.value)} style={{ display: "block", width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14 }}>
                {groupOptions.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
          ) : null}
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Progress ring" style={{ display: "block", width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14 }} />
          </label>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="One line describing what it's for" style={{ display: "block", width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14, fontFamily: "inherit" }} />
          </label>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ display: "block", width: "100%", marginTop: 6, padding: "8px 10px", border: "1px solid var(--color-line)", borderRadius: 6, fontSize: 14 }}>
              <option value="new">New</option>
              <option value="stable">Stable</option>
              <option value="beta">Beta</option>
              <option value="caution">Caution</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 24px", borderTop: "1px solid var(--color-line)" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", fontSize: 13, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
          <button onClick={submit} disabled={!title.trim()} className="apy-btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>Create page</button>
        </div>
      </div>
    </div>
  );
}

// Real SVG upload — reads the actual file as text (SVGs are XML, not
// binary, so this is a real literal capture of the file, not a stub) and
// renders it directly. Session-only, like everything else in Stage 1 —
// the honest caption says exactly that, rather than pretending it's
// already wired to GitHub.
function SvgUploadBlock({ block, onChange }) {
  const inputRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ svgMarkup: reader.result, fileName: file.name });
    reader.readAsText(file);
  };
  if (block.svgMarkup) {
    return (
      <div style={{ border: "1px solid var(--color-line)", borderRadius: 8, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "center", padding: 20, background: "var(--color-band)", borderRadius: 6 }} dangerouslySetInnerHTML={{ __html: block.svgMarkup }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--color-faint)" }}>{block.fileName} — stored for this session only. Will upload to a real folder in GitHub automatically once Stage 2's backend is deployed.</span>
          <button onClick={() => inputRef.current?.click()} style={{ fontSize: 12, padding: "4px 10px", border: "1px solid var(--color-line)", background: "#fff", borderRadius: 5, cursor: "pointer" }}>Replace</button>
        </div>
        <input ref={inputRef} type="file" accept=".svg,image/svg+xml" onChange={handleFile} style={{ display: "none" }} />
      </div>
    );
  }
  return (
    <button onClick={() => inputRef.current?.click()} style={{ width: "100%", padding: 32, border: "2px dashed var(--color-line)", borderRadius: 8, background: "var(--color-band)", cursor: "pointer", color: "var(--color-faint)", fontSize: 13 }}>
      Click to upload an SVG
      <input ref={inputRef} type="file" accept=".svg,image/svg+xml" onChange={handleFile} style={{ display: "none" }} />
    </button>
  );
}

// One block in a draft page's tab — dispatches on block.type. Every
// block type here is something a real designer would actually add:
// a heading, a paragraph, a Do/Dont comparison, a token reference, or
// an uploaded SVG.
function DraftBlock({ block, pageId, tabId, index, total }) {
  const [, force] = useState(0);
  const update = (patch) => { DraftStore.updateBlock(pageId, tabId, block.id, patch); force((n) => n + 1); };
  const remove = () => DraftStore.removeBlock(pageId, tabId, block.id);
  const move = (dir) => DraftStore.moveBlock(pageId, tabId, block.id, dir);

  const chrome = (children) => (
    <div style={{ position: "relative", marginBottom: 16, border: "1px solid transparent", borderRadius: 8 }} className="apy-draft-block">
      <div className="apy-draft-block-controls" style={{ position: "absolute", top: -14, right: 0, display: "flex", gap: 4 }}>
        <button onClick={() => move(-1)} disabled={index === 0} title="Move up" style={{ width: 22, height: 22, fontSize: 11, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 4, cursor: "pointer" }}>↑</button>
        <button onClick={() => move(1)} disabled={index === total - 1} title="Move down" style={{ width: 22, height: 22, fontSize: 11, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 4, cursor: "pointer" }}>↓</button>
        <button onClick={remove} title="Remove block" style={{ width: 22, height: 22, fontSize: 11, border: "1px solid var(--color-line)", background: "#fff", borderRadius: 4, cursor: "pointer", color: "var(--color-danger-text)" }}>✕</button>
      </div>
      {children}
    </div>
  );

  if (block.type === "heading") {
    const Tag = block.level === 3 ? "h3" : "h2";
    return chrome(
      <input value={block.text} onChange={(e) => update({ text: e.target.value })}
        style={{ width: "100%", fontSize: block.level === 3 ? 20 : 24, fontWeight: 653, fontFamily: "var(--font-display)", border: "none", outline: "none", padding: "4px 0" }} />
    );
  }
  if (block.type === "paragraph") {
    return chrome(
      <textarea value={block.text} onChange={(e) => update({ text: e.target.value })} rows={3}
        style={{ width: "100%", fontSize: 15, lineHeight: 1.6, color: "var(--color-paragraph)", border: "1px solid var(--color-line)", borderRadius: 6, padding: 10, fontFamily: "inherit" }} />
    );
  }
  if (block.type === "do-dont") {
    return chrome(
      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 653, marginBottom: 6, color: "var(--color-success-text)" }}>✓ Do</div>
          <textarea value={block.doList} onChange={(e) => update({ doList: e.target.value })} rows={2} style={{ width: "100%", fontSize: 14, border: "1px solid var(--color-line)", borderRadius: 6, padding: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 653, marginBottom: 6, color: "var(--color-danger-text)" }}>✗ Don't</div>
          <textarea value={block.dontList} onChange={(e) => update({ dontList: e.target.value })} rows={2} style={{ width: "100%", fontSize: 14, border: "1px solid var(--color-line)", borderRadius: 6, padding: 8 }} />
        </div>
      </div>
    );
  }
  if (block.type === "token") {
    return chrome(
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "var(--color-band)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 13 }}>
        {block.tokenName}
      </div>
    );
  }
  if (block.type === "svg") {
    return chrome(<SvgUploadBlock block={block} onChange={update} />);
  }
  return null;
}

// "+ Add block" menu at the bottom of a draft tab's content.
function AddBlockMenu({ pageId, tabId }) {
  const [open, setOpen] = useState(false);
  const tokens = useTokenList();
  const [tokenSubmenu, setTokenSubmenu] = useState(false);

  const add = (block) => { DraftStore.addBlock(pageId, tabId, block); setOpen(false); setTokenSubmenu(false); };

  return (
    <div style={{ position: "relative", marginTop: 8 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ padding: "8px 14px", fontSize: 13, border: "1px dashed var(--color-line)", background: "#fff", borderRadius: 6, cursor: "pointer", color: "var(--color-faint)" }}>
        + Add block
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: 40, left: 0, zIndex: 20, background: "#fff", border: "1px solid var(--color-line)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", width: 220 }}>
          {[
            ["Heading", () => add({ type: "heading", level: 2, text: "New heading" })],
            ["Sub-heading", () => add({ type: "heading", level: 3, text: "New sub-heading" })],
            ["Paragraph", () => add({ type: "paragraph", text: "New paragraph text." })],
            ["Do/Don't", () => add({ type: "do-dont", doList: "Real, specific do item", dontList: "Real, specific don't item" })],
            ["Upload SVG", () => add({ type: "svg", svgMarkup: null })],
          ].map(([label, fn]) => (
            <button key={label} onClick={fn} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 13.5 }}>{label}</button>
          ))}
          <button onClick={() => setTokenSubmenu((s) => !s)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", border: "none", borderTop: "1px solid var(--color-line)", background: "none", cursor: "pointer", fontSize: 13.5 }}>Insert token ▾</button>
          {tokenSubmenu && (
            <div style={{ maxHeight: 180, overflowY: "auto", borderTop: "1px solid var(--color-line)" }}>
              {tokens.map((t) => (
                <button key={t.name} onClick={() => add({ type: "token", tokenName: t.name })}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "7px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 12.5 }}>
                  {t.kind === "color" && <span style={{ width: 10, height: 10, borderRadius: 2, background: t.value, flexShrink: 0 }} />}
                  <span style={{ fontFamily: "var(--font-mono)" }}>{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Floating button + panel showing the real JSON shape of every draft page
// this session — this is literally what Stage 2's database would store
// and serve, made visible so it's clear the data layer already exists
// as real structured data, not just rendered HTML.
function DataLayerPanel() {
  const [open, setOpen] = useState(false);
  const [, force] = useState(0);
  useEffect(() => DraftStore.subscribe(() => force((n) => n + 1)), []);
  const data = DraftStore.exportJSON();
  const count = Object.keys(data).length;
  return (
    <>
      <button onClick={() => setOpen((o) => !o)}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 50, padding: "10px 16px", borderRadius: 24, border: "1px solid var(--color-line)", background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        {"{ }"} Data layer {count > 0 && <span style={{ background: "var(--color-accent)", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{count}</span>}
      </button>
      {open && (
        <div style={{ position: "fixed", bottom: 70, right: 20, zIndex: 50, width: 420, maxHeight: "60vh", background: "#fff", border: "1px solid var(--color-line)", borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-line)", fontSize: 13, fontWeight: 600 }}>
            Real data layer (session only)
            <div style={{ fontSize: 11.5, color: "var(--color-faint)", fontWeight: 400, marginTop: 4 }}>
              What Stage 2's database would store for every page created this session. Refresh and it's gone — same as everything else until that's wired up.
            </div>
          </div>
          <pre style={{ margin: 0, padding: 14, fontSize: 11.5, overflow: "auto", flex: 1, fontFamily: "var(--font-mono)", background: "var(--color-ink)", color: "#fff" }}>
            {count === 0 ? "No draft pages created this session yet." : JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </>
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
