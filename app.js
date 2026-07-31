import React, { useState, useMemo, useEffect } from "https://esm.sh/react@18.3.1";
import ReactDOM from "https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1";
import { Search, ChevronRight, ChevronDown, ExternalLink, CheckCircle2, XCircle, Star, DollarSign, X as XIcon, Check, Plus, Minus, ChevronLeft, Calendar as CalendarIcon, HelpCircle, Pencil, Trash2, Car, Route, Smartphone, Bed, Plane, Info, AlertTriangle, Lightbulb, Loader2, Menu as MenuIcon, MoreHorizontal, MessageCircle, Phone } from "https://esm.sh/lucide-react@0.383.0?deps=react@18.3.1";

/* =============================================================================
   REAL IDENTITY — sourced directly from Figma Make's code-level extraction.
   This is RAA (Royal Automobile Association of South Australia) — confirmed
   by SiteFooter's real copyright text. National 2 (type) and Font Awesome 6
   Pro (icons) are licensed assets we don't have files for, so this site
   substitutes Inter and lucide-react — sizes/weights/values are real, the
   exact typeface and glyph set are not. Everything else below is real.
============================================================================= */
let R;
const FONT = "Inter, -apple-system, 'Segoe UI', sans-serif";
const FONT_DISPLAY = "'Plus Jakarta Sans', Inter, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

// APIary's OWN identity — not RAA's. RAA's real yellow/black only ever
// appears inside a component's own real preview/spec data, never as chrome.
const INDIGO = {
  50: "#EEF2FF",
  100: "#E0E7FF",
  200: "#C7D2FE",
  300: "#A5B4FC",
  400: "#818CF8",
  500: "#6366F1",
  600: "#5B5BD6",
  700: "#4F46E5",
  800: "#3730A3",
  900: "#312E81"
};
const AMBER = {
  50: "#FFFBEB",
  100: "#FEF3C7",
  200: "#FDE68A",
  300: "#FCD34D",
  400: "#FBBF24",
  500: "#F59E0B",
  600: "#D97706",
  700: "#B45309"
};
const SLATE = {
  50: "#F8FAFC",
  100: "#F1F5F9",
  200: "#E2E8F0",
  300: "#CBD5E1",
  400: "#94A3B8",
  500: "#64748B",
  600: "#475569",
  700: "#334155",
  800: "#1E293B",
  900: "#0F172A"
};
const SEMANTIC = {
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#2563EB"
};
const ACCENT = INDIGO[600];
const ACCENT_HOVER = INDIGO[700];
const ACCENT_TINT = INDIGO[50];
const LINE = SLATE[200];
const BAND = SLATE[50];
const FAINT = SLATE[500];
const BODY = SLATE[600];
const INK = SLATE[900];
function GlobalStyles() {
  return <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
      @keyframes apy-blob  { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(40px,-25px) scale(1.05); } 66% { transform:translate(-20px,15px) scale(0.97); } }
      @keyframes apy-blob2 { 0%,100% { transform:translate(0,0) scale(1); } 40% { transform:translate(-30px,20px) scale(1.04); } 70% { transform:translate(20px,-12px) scale(0.96); } }
      .apy-blob  { animation: apy-blob 16s ease-in-out infinite; }
      .apy-blob2 { animation: apy-blob2 20s ease-in-out infinite; }
      .apy-blob3 { animation: apy-blob 22s ease-in-out infinite reverse; }
      .apy-nav-link { transition: color 150ms ease; }
      .apy-link-hover:hover { color: #000 !important; }
      .apy-btn { transition: all 150ms ease; }
      .apy-btn:hover { transform: translateY(-1px); }
      .apy-row:hover { background: #EEF2FF !important; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
    `}</style>;
}
function Mark({
  size = 22
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1.5 L21.5 6.75 V17.25 L12 22.5 L2.5 17.25 V6.75 Z" fill={R.yellow} stroke={R.black} strokeWidth="1" />
    </svg>;
}

/* =============================================================================
   REAL FOUNDATIONS
============================================================================= */

const RAMP = (id, label, base, steps, note) => ({
  id,
  label,
  base,
  steps,
  note
});
// steps: [{ step, hex }] — every value below is a real value from Group1's export.
let COLOUR_RAMPS;
let INTERACTION_TOKENS;
let BUTTON_STATE_TOKENS;
let GRADIENT_TOKEN;
let ELEVATION;
let TYPESCALE; // Real icon names, as actually referenced by name across the captured components —
// not the real glyphs (Font Awesome 6 Pro path data wasn't captured), lucide substitutes.
let ICONS_REFERENCED_NAMES;
// Reconstructs {name, Icon} pairs from the fetched name list — the actual
// icon component references can't travel through JSON, so this lookup
// (taken verbatim from the original real pairing) restores them.
const ICON_LOOKUP = {
  star: Star, "dollar-sign": DollarSign, times: XIcon, check: Check, plus: Plus, minus: Minus,
  "angle-left": ChevronLeft, "angle-right": ChevronRight, "angle-down": ChevronDown,
  "calendar-alt": CalendarIcon, "question-circle": HelpCircle, pencil: Pencil, trash: Trash2,
  "car-crash": Car, route: Route, "mobile-alt": Smartphone, bed: Bed, plane: Plane,
  "info-circle": Info, "check-circle": CheckCircle2, "exclamation-triangle": AlertTriangle,
  "exclamation-circle": XCircle, lightbulb: Lightbulb, "spinner-third": Loader2, bars: MenuIcon,
  "ellipsis-h": MoreHorizontal, "web-chat-speech-bubbles": MessageCircle, "mobile-phone": Phone,
  "external-link-alt": ExternalLink,
};
/* =============================================================================
   REAL COMPONENTS — every value below traces to a real Figma Make code
   capture from this session. Duplicate/typo pairs found in the file are
   merged into one entry with a note, not counted twice.
============================================================================= */
let COMPONENT_GROUPS; // Related real variants grouped onto one page with sub-tabs, instead of a
// separate sidebar entry per variant. groupKey is taken from the family's
// first member so it sorts into the same sidebar section it always did.
let FAMILIES; // Every real component id that belongs to a family — used by the sidebar to
// skip listing that variant on its own.
const FAMILY_MEMBER_IDS = new Set(FAMILIES.flatMap(f => f.members));
function familyGroupKey(family) {
  const first = COMPONENTS.find(c => c.id === family.members[0]);
  return first ? first.groupKey : "actions";
}
let COMPONENTS;
/* =============================================================================
   SHARED UI
============================================================================= */
function RealTag() {
  return <span style={{
    fontSize: 11,
    fontWeight: 600,
    color: R.selected,
    background: "#E6F1F0",
    padding: "2px 7px",
    borderRadius: 3,
    fontFamily: FONT_MONO,
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  }}>Real capture</span>;
}
function FoundationTag() {
  return <span style={{
    fontSize: 11,
    fontWeight: 600,
    color: "#4D4D4D",
    background: "#F1EEE5",
    padding: "2px 7px",
    borderRadius: 3,
    fontFamily: FONT_MONO,
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  }}>Foundation</span>;
}
const CONTENT_MAX = 1080;
function GrayBand({
  title,
  description,
  extra
}) {
  return <div style={{
    background: BAND,
    padding: "36px 40px",
    borderBottom: `1px solid ${LINE}`
  }}>
      <div style={{
      maxWidth: CONTENT_MAX,
      margin: "0 auto"
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap"
      }}>
          <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#000",
          margin: 0,
          letterSpacing: "-0.01em",
          fontFamily: FONT_DISPLAY
        }}>{title}</h1>
          {extra}
        </div>
        {description && <p style={{
        fontSize: 15,
        color: BODY,
        marginTop: 8,
        maxWidth: 680,
        lineHeight: 1.6
      }}>{description}</p>}
      </div>
    </div>;
}
function TabStrip({
  tabs,
  active,
  onChange
}) {
  return <div style={{
    borderBottom: `1px solid ${LINE}`,
    padding: "0 40px"
  }}>
      <div style={{
      display: "flex",
      gap: 24,
      maxWidth: CONTENT_MAX,
      margin: "0 auto"
    }}>
        {tabs.map(t => {
        const isActive = active === t;
        return <button key={t} onClick={() => onChange(t)} style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "13px 2px",
          fontSize: 14,
          color: isActive ? "#000" : FAINT,
          fontWeight: isActive ? 700 : 500,
          borderBottom: isActive ? "2px solid #000" : "2px solid transparent",
          marginBottom: -1
        }}>
              {t}
            </button>;
      })}
      </div>
    </div>;
}
function ContentsRail({
  items,
  onJump
}) {
  return <div style={{
    width: 190,
    flexShrink: 0
  }}>
      <div style={{
      position: "sticky",
      top: 20
    }}>
        <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#000",
        marginBottom: 10
      }}>Contents</div>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        borderLeft: `2px solid ${LINE}`,
        paddingLeft: 12
      }}>
          {items.map(it => <button key={it.id} onClick={() => onJump(it.id)} style={{
          background: "none",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontSize: 13,
          color: FAINT,
          padding: 0
        }}>{it.label}</button>)}
        </div>
      </div>
    </div>;
}
function Section({
  id,
  title,
  children
}) {
  return <div id={id} style={{
    marginBottom: 34,
    scrollMarginTop: 20
  }}>
      {title && <h2 style={{
      fontSize: 19,
      fontWeight: 700,
      color: "#000",
      marginBottom: 10
    }}>{title}</h2>}
      {children}
    </div>;
}
function useJump() {
  return id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

/* =============================================================================
   GENERIC REAL-DATA PREVIEW ENGINE
   Every visual below is built from the real fill/border/radius/padding/type
   values captured off the exported code — never a guess. Complex multi-part
   layouts (calendars, tables, nav trees) are drawn as a representative shape
   using those same real values rather than a full pixel recreation, since
   exact composition wasn't always captured — that trade-off is noted inline.
============================================================================= */

function StateChip({
  s
}) {
  return <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6
  }}>
      <div style={{
      minWidth: 64,
      height: 40,
      padding: "0 10px",
      borderRadius: s.radius ?? 4,
      background: s.bg || "transparent",
      border: s.border || `1px solid ${FAINT}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 600,
      color: s.text || "#000",
      fontFamily: FONT,
      boxShadow: s.shadow || "none"
    }}>
        {s.sample || ""}
      </div>
      <div style={{
      fontSize: 11,
      color: FAINT,
      textAlign: "center"
    }}>{s.label}</div>
    </div>;
}
function PreviewFallback({
  item
}) {
  const s = (item.preview?.states || [])[0];
  return <div>
      <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      padding: 28,
      border: `1px solid ${LINE}`,
      borderRadius: 6,
      background: "#fff",
      alignItems: "center"
    }}>
        {(item.preview?.states || []).map((s, i) => <StateChip key={i} s={s} />)}
        {!item.preview?.states?.length && <span style={{
        fontSize: 13,
        color: FAINT
      }}>No renderable states captured for this item.</span>}
      </div>
    </div>;
}
function PreviewButtonLike({
  item
}) {
  const states = item.preview.states;
  return <div style={{
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    padding: 28,
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    background: "#fff"
  }}>
      {states.map((s, i) => <div key={i} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }}>
          <button style={{
        background: s.bg,
        color: s.text || "#000",
        border: s.border || "none",
        borderRadius: s.radius ?? 4,
        padding: s.padding || "12px 24px",
        fontFamily: FONT,
        fontSize: 14,
        fontWeight: 700,
        cursor: "default",
        boxShadow: s.shadow || "none"
      }}>
            {s.sample || item.name}
          </button>
          <div style={{
        fontSize: 11,
        color: FAINT
      }}>{s.label}</div>
        </div>)}
    </div>;
}
function PreviewToggleLike({
  item
}) {
  const states = item.preview.states;
  return <div style={{
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    padding: 28,
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    background: "#fff"
  }}>
      {states.map((s, i) => <div key={i} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }}>
          <div style={{
        position: "relative",
        width: s.w || 40,
        height: s.h || 20,
        borderRadius: s.radius ?? 10,
        background: s.bg
      }}>
            <div style={{
          position: "absolute",
          top: 2,
          left: s.dotLeft ?? 2,
          width: (s.h || 20) - 4,
          height: (s.h || 20) - 4,
          borderRadius: "50%",
          background: s.dotColor || "#fff"
        }} />
          </div>
          <div style={{
        fontSize: 11,
        color: FAINT
      }}>{s.label}</div>
        </div>)}
    </div>;
}
function PreviewFieldLike({
  item
}) {
  const states = item.preview.states;
  return <div style={{
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    padding: 28,
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    background: "#fff"
  }}>
      {states.map((s, i) => <div key={i} style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: s.w || 180
    }}>
          <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: s.labelColor || "#000",
        fontFamily: FONT
      }}>{s.label}</div>
          <div style={{
        height: s.h || 44,
        background: s.bg || "#fff",
        border: s.border,
        borderRadius: s.radius ?? 4,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        fontSize: 13,
        color: s.text || FAINT,
        fontFamily: FONT
      }}>
            {s.sample || "Placeholder"}
          </div>
        </div>)}
    </div>;
}
function PreviewLinkLike({
  item
}) {
  const states = item.preview.states;
  return <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 28,
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    background: "#fff"
  }}>
      {states.map((s, i) => <div key={i} style={{
      display: "flex",
      alignItems: "center",
      gap: 10
    }}>
          <span style={{
        color: s.text,
        textDecoration: s.underline === false ? "none" : "underline",
        fontFamily: FONT,
        fontSize: 14,
        background: s.bg || "transparent",
        padding: s.bg ? "2px 8px" : 0,
        borderRadius: s.bg ? 4 : 0
      }}>{item.name}</span>
          <span style={{
        fontSize: 11,
        color: FAINT
      }}>{s.label}</span>
        </div>)}
    </div>;
}
function PreviewContainerLike({
  item
}) {
  const s = item.preview.states[0];
  return <div>
      <div style={{
      padding: 28,
      border: `1px solid ${LINE}`,
      borderRadius: 6,
      background: BAND,
      display: "flex",
      justifyContent: "center"
    }}>
        <div style={{
        width: s.w || 280,
        minHeight: s.h || 100,
        background: s.bg || "#fff",
        border: s.border,
        borderRadius: s.radius ?? 4,
        padding: s.padding || 16,
        boxShadow: s.shadow || "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: FAINT,
        fontFamily: FONT,
        textAlign: "center"
      }}>
          {s.sample || `${item.name} — representative shape`}
        </div>
      </div>
      <p style={{
      fontSize: 12,
      color: FAINT,
      marginTop: 10
    }}>Representative container shape using real fill/border/radius/padding — full internal layout wasn't part of this capture pass.</p>
    </div>;
}
function PreviewProgressLike({
  item
}) {
  const s = item.preview.states[0];
  return <div style={{
    padding: 28,
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    background: "#fff"
  }}>
      <div style={{
      display: "flex",
      gap: 2,
      width: 300
    }}>
        {(s.segments || [1, 1, 1]).map((filled, i) => <div key={i} style={{
        flex: 1,
        height: 4,
        borderRadius: 2,
        background: s.track || "rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden"
      }}>
            {filled ? <div style={{
          position: "absolute",
          inset: 0,
          right: s.fillRight || "33%",
          background: s.fill || "#007064"
        }} /> : null}
          </div>)}
      </div>
    </div>;
}
function PreviewStepLike({
  item
}) {
  const states = item.preview.states;
  return <div style={{
    display: "flex",
    gap: 24,
    padding: 28,
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    background: "#fff"
  }}>
      {states.map((s, i) => <div key={i} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6
    }}>
          <div style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: s.bg || "transparent",
        border: s.border || `2px solid ${FAINT}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: s.text || "#000",
        fontFamily: FONT
      }}>
            {s.sample ?? i + 1}
          </div>
          <div style={{
        fontSize: 11,
        color: s.labelColor || FAINT
      }}>{s.label}</div>
        </div>)}
    </div>;
}
function ComponentPreview({
  item
}) {
  if (!item.preview) return <PreviewFallback item={item} />;
  switch (item.preview.kind) {
    case "button":
      return <PreviewButtonLike item={item} />;
    case "toggle":
      return <PreviewToggleLike item={item} />;
    case "field":
      return <PreviewFieldLike item={item} />;
    case "link":
      return <PreviewLinkLike item={item} />;
    case "container":
      return <PreviewContainerLike item={item} />;
    case "progress":
      return <PreviewProgressLike item={item} />;
    case "step":
      return <PreviewStepLike item={item} />;
    default:
      return <PreviewFallback item={item} />;
  }
}

/* =============================================================================
   FOUNDATIONS PAGE
============================================================================= */
let FOUNDATION_KEYS;
let GET_STARTED_ITEMS;
let GET_STARTED_LABELS;
function GetStartedPage({
  active
}) {
  const content = GET_STARTED_CONTENT[active];
  return <div>
      <GrayBand title={GET_STARTED_LABELS[active]} extra={content ? <RealTag /> : undefined} description={content ? "Real content from the team's Zeroheight pages, word for word." : "Structure is here, real content isn't yet — waiting on the actual Zeroheight content, not filled in with placeholder text."} />
      <div style={{
      padding: "40px",
      maxWidth: CONTENT_MAX,
      margin: "0 auto"
    }}>
        {content ? <ContentBlocks {...content} /> : <div style={{
        border: `1px dashed ${LINE}`,
        borderRadius: 8,
        padding: 24,
        textAlign: "center",
        color: FAINT,
        fontSize: 13
      }}>
            Content pending — paste the real copy for "{GET_STARTED_LABELS[active]}" and it goes here word for word.
          </div>}
      </div>
    </div>;
}
let FOUNDATION_LABELS;
/* =============================================================================
   REAL ZEROHEIGHT CONTENT — verbatim from the team's actual Get Started /
   Foundations narrative pages. A generic block renderer handles the shared
   shape (title + body + list + note) across Get Started and Foundations.
============================================================================= */
function ContentBlocks({
  intro,
  body,
  blocks,
  cta
}) {
  return <div>
      {intro && <p style={{
      fontSize: 16,
      fontWeight: 600,
      color: INK,
      lineHeight: 1.6,
      marginBottom: 12
    }}>{intro}</p>}
      {body && <p style={{
      fontSize: 14,
      color: BODY,
      lineHeight: 1.65,
      marginBottom: 24
    }}>{body}</p>}
      {(blocks || []).map((b, i) => <div key={i} style={{
      marginBottom: 24
    }}>
          {b.title && <div style={{
        fontSize: 15,
        fontWeight: 700,
        color: INK,
        marginBottom: 8
      }}>{b.title}</div>}
          {b.note1 && <div style={{
        fontSize: 12,
        color: AMBER[600],
        marginBottom: 6
      }}>{b.note1}</div>}
          {b.body && <p style={{
        fontSize: 14,
        color: BODY,
        lineHeight: 1.6,
        marginBottom: b.list ? 8 : 0
      }}>{b.body}</p>}
          {b.list && <ul style={{
        margin: 0,
        paddingLeft: 20,
        fontSize: 13,
        color: BODY,
        lineHeight: 1.7,
        listStyle: "disc",
        listStylePosition: "outside"
      }}>
              {b.list.map((x, j) => <li key={j}>{x}</li>)}
            </ul>}
          {b.note && <p style={{
        fontSize: 12,
        color: FAINT,
        marginTop: 8,
        fontStyle: "italic"
      }}>{b.note}</p>}
        </div>)}
      {cta && <div style={{
      borderLeft: `3px solid ${ACCENT}`,
      background: ACCENT_TINT,
      padding: "12px 16px",
      fontSize: 13,
      color: INK,
      lineHeight: 1.6,
      marginTop: 8
    }}>{cta}</div>}
    </div>;
}
let GET_STARTED_CONTENT;
let FOUNDATION_NARRATIVE;
let SPACING_SCALE;
function SpacingFoundation() {
  return <div>
      <p style={{
      fontSize: 16,
      fontWeight: 600,
      color: INK,
      marginBottom: 12
    }}>Create rhythm and clarity through consistent spacing across products.</p>
      <p style={{
      fontSize: 14,
      color: BODY,
      lineHeight: 1.65,
      marginBottom: 20
    }}>Spacing helps define relationships between elements, build hierarchy, and maintain a clean, user-friendly layout. Apiary uses a consistent spacing scale — a 6px base unit — to guide design decisions and support scalable, accessible interfaces.</p>
      <div style={{
      border: `1px solid ${LINE}`,
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 16
    }}>
        <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 2fr",
        padding: "8px 14px",
        background: BAND,
        fontSize: 11,
        fontWeight: 700,
        color: FAINT,
        textTransform: "uppercase"
      }}>
          <span>Pixel value</span><span>Token name (coming soon)</span><span>Description</span>
        </div>
        {SPACING_SCALE.map((s, i) => <div key={i} style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 2fr",
        padding: "10px 14px",
        borderTop: `1px solid ${LINE}`,
        fontSize: 13
      }}>
            <span style={{
          fontWeight: 600
        }}>{s.px}</span><span style={{
          fontFamily: "monospace",
          color: FAINT
        }}>{s.token}</span><span style={{
          color: BODY
        }}>{s.desc}</span>
          </div>)}
      </div>
      <p style={{
      fontSize: 12,
      color: FAINT,
      marginBottom: 20
    }}>Right now, use pixel values directly — token names are shown as a guide for a future stage. (Worth noting: this 6px base matches the 12px/24px paddings we found repeated across real captured components — a good cross-check that this scale is genuinely in use.)</p>
      <ContentBlocks blocks={[{
      title: "How to use",
      list: ["Use spacing values (e.g. 24px) consistently for padding, margins, or gaps between elements", "Refer to this scale when reviewing designs or handing off to development", "Follow spacing values defined in component specs or patterns in Apiary"]
    }, {
      title: "Looking ahead",
      body: "As Apiary evolves, spacing tokens will be implemented to support design–code alignment. Once in place, they'll replace raw pixel values and enable:",
      list: ["Faster updates across products", "Easier theming and scaling", "Less hardcoded spacing in code"],
      note: "For now, stick to the pixel values shown above to stay consistent."
    }]} />
    </div>;
}
function ColourFoundation() {
  return <div>
      <ContentBlocks {...FOUNDATION_NARRATIVE.colour} />
      <div style={{
      height: 1,
      background: LINE,
      margin: "8px 0 28px"
    }} />
      <p style={{
      fontSize: 14,
      color: BODY,
      marginBottom: 24,
      lineHeight: 1.6
    }}>
        {COLOUR_RAMPS.length} real colour groups, straight from the file's own colour-palette frame. None have a bound token name in the source file — shown here as real values, not raw spectrum bars.
      </p>
      {COLOUR_RAMPS.map(ramp => <div key={ramp.id} style={{
      marginBottom: 28
    }}>
          <div style={{
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: SLATE[700]
      }}>{ramp.label}</div>
          {ramp.note && <div style={{
        fontSize: 12,
        color: AMBER[600],
        marginBottom: 8
      }}>⚠ {ramp.note}</div>}
          <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
        gap: 8
      }}>
            {ramp.steps.map((s, i) => <div key={i} style={{
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff"
        }}>
                <div style={{
            height: 56,
            background: s.hex,
            borderBottom: s.hex.includes("255,255,255") ? `1px solid ${LINE}` : "none"
          }} />
                <div style={{
            padding: "6px 8px"
          }}>
                  <div style={{
              fontSize: 12,
              fontWeight: 600
            }}>{s.step}</div>
                  <div style={{
              fontSize: 10,
              color: FAINT,
              fontFamily: FONT_MONO
            }}>{s.hex}</div>
                </div>
              </div>)}
          </div>
        </div>)}

      <div style={{
      marginTop: 32
    }}>
        <div style={{
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: SLATE[700]
      }}>Interaction values</div>
        <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 10
      }}>
          {INTERACTION_TOKENS.map((t, i) => <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: "8px 12px"
        }}>
              <div style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: t.hex,
            flexShrink: 0
          }} />
              <div>
                <div style={{
              fontSize: 12
            }}>{t.name}</div>
                <div style={{
              fontSize: 10,
              color: FAINT,
              fontFamily: FONT_MONO
            }}>{t.hex}</div>
              </div>
            </div>)}
        </div>
      </div>

      <div style={{
      marginTop: 24
    }}>
        <div style={{
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: SLATE[700]
      }}>Primary button values (cross-checked against Button's own code)</div>
        <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap"
      }}>
          {BUTTON_STATE_TOKENS.map((t, i) => <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: "8px 12px"
        }}>
              <div style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: t.hex
          }} />
              <div><div style={{
              fontSize: 12
            }}>{t.name}</div><div style={{
              fontSize: 10,
              color: FAINT,
              fontFamily: FONT_MONO
            }}>{t.hex}</div></div>
            </div>)}
        </div>
      </div>

      <div style={{
      marginTop: 24
    }}>
        <div style={{
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: SLATE[700]
      }}>Gradient</div>
        <div style={{
        width: 200,
        height: 40,
        borderRadius: 8,
        background: `linear-gradient(90deg, ${GRADIENT_TOKEN.from} ${GRADIENT_TOKEN.fromStop * 100}%, ${GRADIENT_TOKEN.to} ${GRADIENT_TOKEN.toStop * 100}%)`
      }} />
      </div>
    </div>;
}
function ElevationFoundation() {
  return <div>
      <p style={{
      fontSize: 14,
      color: BODY,
      marginBottom: 24
    }}>5 real shadow levels, confirmed against code twice in the session.</p>
      <div style={{
      display: "flex",
      gap: 24,
      flexWrap: "wrap"
    }}>
        {ELEVATION.map((e, i) => <div key={i} style={{
        textAlign: "center"
      }}>
            <div style={{
          width: 100,
          height: 100,
          background: "#fff",
          borderRadius: 4,
          boxShadow: e.shadow,
          marginBottom: 10
        }} />
            <div style={{
          fontSize: 12,
          fontWeight: 600
        }}>{e.name}</div>
          </div>)}
      </div>
    </div>;
}
function TypographyFoundation() {
  return <div>
      <ContentBlocks {...FOUNDATION_NARRATIVE.typography} />
      <div style={{
      height: 1,
      background: LINE,
      margin: "8px 0 28px"
    }} />
      <p style={{
      fontSize: 14,
      color: BODY,
      marginBottom: 20
    }}>Real sizes and line-heights from the file's Typescale specimen (duplicated once more as a near-identical frame called "Row"). Font substituted with Inter — National 2 is licensed and its files weren't provided.</p>
      {TYPESCALE.map(w => <div key={w.weight} style={{
      marginBottom: 24
    }}>
          <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: FAINT,
        textTransform: "uppercase",
        marginBottom: 8
      }}>{w.weight}</div>
          {w.sizes.map((sz, i) => <div key={i} style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        marginBottom: 6
      }}>
              <span style={{
          fontSize: sz.s,
          fontWeight: w.weight === "Regular" ? 400 : w.weight === "Medium" ? 500 : w.weight === "Bold" ? 700 : 800,
          fontFamily: FONT,
          lineHeight: `${sz.l}px`
        }}>Aa</span>
              <span style={{
          fontSize: 11,
          color: FAINT,
          fontFamily: "monospace"
        }}>{sz.s}px / {sz.l}px line-height</span>
            </div>)}
        </div>)}
    </div>;
}
function IconsFoundation() {
  return <div>
      <ContentBlocks {...FOUNDATION_NARRATIVE.icons} />
      <div style={{
      height: 1,
      background: LINE,
      margin: "8px 0 20px"
    }} />
      <p style={{
      fontSize: 14,
      color: BODY,
      marginBottom: 20,
      lineHeight: 1.6
    }}>
        The file has two full icon libraries — <code>IconMaster</code> (60+ line-style icons) and <code>IconDuotoneMaster</code> (a duotone counterpart, 524KB — too large to fully read). Font Awesome 6 Pro's actual glyph paths weren't captured, so below are lucide-react substitutes for every icon name we saw genuinely referenced by a real component — same meaning, different exact artwork.
      </p>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
      gap: 10
    }}>
        {ICONS_REFERENCED_NAMES.map((name, i) => {
        const Icon = ICON_LOOKUP[name] || HelpCircle;
        return <div key={i} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        border: `1px solid ${LINE}`,
        borderRadius: 6,
        padding: 10
      }}>
            <Icon size={20} />
            <span style={{
          fontSize: 10,
          color: FAINT,
          textAlign: "center"
        }}>{name}</span>
          </div>;
      })}
      </div>
    </div>;
}
function LogoFoundation() {
  return <div>
      <p style={{
      fontSize: 14,
      color: BODY,
      marginBottom: 20,
      lineHeight: 1.6
    }}>
        <code>RaaMasterLogo</code> — 5 real style variants. The gradient stop values below are exact; the shield/wing shape data wasn't captured (no raw SVG path), so it's approximated here.
      </p>
      <div style={{
      display: "flex",
      gap: 24,
      flexWrap: "wrap"
    }}>
        <div style={{
        textAlign: "center"
      }}>
          <svg width="90" height="90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="38.8%" stopColor="#FF6E00" /><stop offset="50.9%" stopColor="#FF8500" /><stop offset="100%" stopColor="#FFE600" />
              </linearGradient>
            </defs>
            <path d="M50 5 L90 20 V55 C90 78 72 92 50 98 C28 92 10 78 10 55 V20 Z" fill="url(#shieldGrad)" />
          </svg>
          <div style={{
          fontSize: 12,
          marginTop: 8
        }}>Positive — shield gradient</div>
        </div>
        <div style={{
        textAlign: "center"
      }}>
          <svg width="90" height="90" viewBox="0 0 100 100">
            <defs><linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FFE600" /><stop offset="100%" stopColor="#FFC300" /></linearGradient></defs>
            <path d="M10 60 Q50 20 90 60 Q50 45 10 60 Z" fill="url(#wingGrad)" />
          </svg>
          <div style={{
          fontSize: 12,
          marginTop: 8
        }}>Positive — wing gradient</div>
        </div>
      </div>
      <p style={{
      fontSize: 12,
      color: FAINT,
      marginTop: 16
    }}>Other real variants captured: Negative (white body), Reverse (white shield with opacity ramp), Mono Positive (all black), Mono Negative (all white).</p>
    </div>;
}
function FoundationsPage({
  active
}) {
  return <div>
      <GrayBand title={FOUNDATION_LABELS[active]} extra={<FoundationTag />} description="Colour, spacing, elevation, and typography carry real captured or documented values; Accessibility and Design Tokens are the team's real narrative pages, not yet backed by live tokens." />
      <div style={{
      padding: "28px 40px",
      maxWidth: CONTENT_MAX,
      margin: "0 auto"
    }}>
        {active === "colour" && <ColourFoundation />}
        {active === "spacing" && <SpacingFoundation />}
        {active === "elevation" && <ElevationFoundation />}
        {active === "typography" && <TypographyFoundation />}
        {active === "icons" && <IconsFoundation />}
        {active === "logo" && <LogoFoundation />}
        {active === "accessibility" && <ContentBlocks {...FOUNDATION_NARRATIVE.accessibility} />}
        {active === "design-tokens" && <ContentBlocks {...FOUNDATION_NARRATIVE["design-tokens"]} />}
      </div>
    </div>;
}

/* =============================================================================
   DETAIL PAGE
============================================================================= */

/* =============================================================================
   REAL FIGMA DOCUMENTATION — verbatim content pasted from the team's actual
   Figma design-doc pages, not written by us. `sameAs` reuses a family's
   guidance for a merged/variant component. `templateEmpty: true` means the
   real Figma page was checked and genuinely has nothing written on it yet —
   that's a fact about the source, not a gap we're filling with a guess.
============================================================================= */
let GUIDELINES;
function getGuidelines(id) {
  const g = GUIDELINES[id];
  if (!g) return null;
  return g.sameAs ? GUIDELINES[g.sameAs] : g;
}
function GuidelinesTab({
  item
}) {
  const g = getGuidelines(item.id);
  if (!g) {
    return <p style={{
      fontSize: 13,
      color: FAINT,
      fontStyle: "italic"
    }}>Not yet provided — real design documentation for this component hasn't been shared here yet.</p>;
  }
  if (g.templateEmpty) {
    return <p style={{
      fontSize: 13,
      color: FAINT,
      fontStyle: "italic"
    }}>Checked the real Figma documentation page for this component — it's an empty template. The design team hasn't written this guidance yet either; nothing is fabricated here to fill the gap.</p>;
  }
  const Block = ({
    title,
    list
  }) => list && list.length > 0 ? <div style={{
    marginBottom: 20
  }}>
      <div style={{
      fontSize: 12,
      fontWeight: 700,
      color: SLATE[700],
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      marginBottom: 8
    }}>{title}</div>
      <ul style={{
      margin: 0,
      paddingLeft: 20,
      fontSize: 13,
      color: BODY,
      lineHeight: 1.7,
      listStyle: "disc",
      listStylePosition: "outside"
    }}>{list.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div> : null;
  const TitledBlock = ({
    title,
    items
  }) => items && items.length > 0 ? <div style={{
    marginBottom: 20
  }}>
      <div style={{
      fontSize: 12,
      fontWeight: 700,
      color: SLATE[700],
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      marginBottom: 8
    }}>{title}</div>
      <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>
        {items.map((it, i) => <div key={i}>
            <div style={{
          fontSize: 13,
          fontWeight: 700
        }}>{it.title}</div>
            <div style={{
          fontSize: 13,
          color: BODY,
          lineHeight: 1.6
        }}>{it.body}</div>
          </div>)}
      </div>
    </div> : null;
  return <div>
      {g.version && <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      fontFamily: "monospace",
      color: "#059669",
      background: "#ECFDF5",
      padding: "3px 8px",
      borderRadius: 4,
      marginBottom: 12
    }}>
          v{g.version} · documented
        </div>}
      {g.use && <p style={{
      fontSize: 14,
      color: BODY,
      lineHeight: 1.65,
      marginBottom: 20
    }}>{g.use}</p>}
      {g.sourceIssue && <div style={{
      borderLeft: "3px solid #DC2626",
      background: "#FEF2F2",
      padding: "10px 14px",
      fontSize: 13,
      color: BODY,
      lineHeight: 1.6,
      marginBottom: 20
    }}>
          <strong>Content issue found on the live site:</strong> {g.sourceIssue}
        </div>}
      {g.implementationNote && <div style={{
      borderLeft: `3px solid ${AMBER[400]}`,
      background: AMBER[50],
      padding: "10px 14px",
      fontSize: 13,
      color: BODY,
      lineHeight: 1.6,
      marginBottom: 20
    }}>
          <strong>Known implementation gap:</strong> {g.implementationNote}
        </div>}
      <Block title="Real token names (documentation)" list={g.tokens} />
      {g.tokenCrossCheck && <div style={{
      borderLeft: `3px solid #059669`,
      background: "#ECFDF5",
      padding: "10px 14px",
      fontSize: 13,
      color: BODY,
      lineHeight: 1.6,
      marginBottom: 20
    }}>
          <strong>Cross-check:</strong> {g.tokenCrossCheck}
        </div>}
      <Block title="When to use" list={g.whenToUse} />
      <Block title="Variants" list={g.variants} />
      <Block title="Principles" list={g.principles} />
      <Block title="Anatomy" list={g.anatomy} />
      <Block title="Size" list={g.size} />
      <Block title="Typography" list={g.typography} />
      <Block title="Character limit" list={g.characterLimit} />
      <Block title="States" list={g.states} />
      <Block title="Transitions" list={g.transitions} />
      <Block title="Priority" list={g.priority} />
      <Block title="Behaviour" list={g.behaviour} />
      <TitledBlock title="Types" items={g.types} />
      <Block title="Arrangement & spacing" list={g.arrangement} />
      <Block title="Accessibility" list={g.accessibility} />
      {g.doList && <div style={{
      marginBottom: 20
    }}>
          <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#059669",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: 8
      }}>Do</div>
          <ul style={{
        margin: 0,
        paddingLeft: 20,
        fontSize: 13,
        color: BODY,
        lineHeight: 1.7,
        listStyle: "disc",
        listStylePosition: "outside"
      }}>{g.doList.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>}
      {g.dontList && <div style={{
      marginBottom: 20
    }}>
          <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#DC2626",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: 8
      }}>Don't</div>
          <ul style={{
        margin: 0,
        paddingLeft: 20,
        fontSize: 13,
        color: BODY,
        lineHeight: 1.7,
        listStyle: "disc",
        listStylePosition: "outside"
      }}>{g.dontList.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>}
      <TitledBlock title="Content guidelines" items={g.contentGuidelines} />
      <Block title="Resources" list={g.resources} />
      {g.changelog && g.changelog.length > 0 && <div style={{
      marginBottom: 20
    }}>
          <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: SLATE[700],
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: 8
      }}>Changelog</div>
          <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}>
            {g.changelog.map((c, i) => <div key={i} style={{
          fontSize: 13,
          color: BODY,
          borderLeft: `2px solid ${LINE}`,
          paddingLeft: 10
        }}>
                <span style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: FAINT
          }}>{c.date} · v{c.version}</span> — {c.note}
              </div>)}
          </div>
        </div>}
      {g.usedInPattern && <p style={{
      fontSize: 12,
      color: FAINT,
      marginTop: 8
    }}><strong>Used in pattern:</strong> {g.usedInPattern}</p>}
    </div>;
}
function ComponentTabsBody({
  item
}) {
  const jump = useJump();
  const tabs = ["Overview", "Guidelines", "Specs", "QA Notes"];
  const [tab, setTab] = useState("Overview");
  const toc = {
    Overview: [{
      id: "preview",
      label: "Preview"
    }],
    Guidelines: [{
      id: "guidelines",
      label: "Real documentation"
    }],
    Specs: [{
      id: "specs",
      label: "Real values"
    }],
    "QA Notes": [{
      id: "usage",
      label: "Flags found in code"
    }]
  };
  const specsIntro = item.summary.split(/(?<=\.)\s+/).slice(1).join(" ");
  return <div>
      <TabStrip tabs={tabs} active={tab} onChange={setTab} />
      <div style={{
      padding: "0 40px"
    }}>
        <div style={{
        display: "flex",
        maxWidth: CONTENT_MAX,
        margin: "0 auto"
      }}>
          <div style={{
          flex: 1,
          padding: "28px 0",
          maxWidth: 720
        }}>
            {tab === "Overview" && <Section id="preview" title="Preview">
                <ComponentPreview item={item} />
                <p style={{
              fontSize: 12,
              color: FAINT,
              marginTop: 10
            }}>Source: {item.source}</p>
              </Section>}
            {tab === "Specs" && <Section id="specs" title="Real values">
                {specsIntro && <p style={{
              fontSize: 13,
              color: BODY,
              marginBottom: 14,
              lineHeight: 1.6
            }}>{specsIntro}</p>}
                <div style={{
              fontSize: 12,
              color: FAINT,
              marginBottom: 12
            }}>Variants: {item.variantsRaw}</div>
                <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
                  {item.tokenFindings.map((f, i) => <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                border: `1px solid ${LINE}`,
                borderRadius: 6,
                padding: "8px 12px"
              }}>
                      <div>
                        <div style={{
                    fontSize: 13,
                    fontWeight: 600
                  }}>{f.field}</div>
                        {f.value && <div style={{
                    fontSize: 12,
                    color: BODY,
                    fontFamily: "monospace",
                    marginTop: 2
                  }}>{f.value}</div>}
                        {f.note && <div style={{
                    fontSize: 12,
                    color: f.unconfirmed ? AMBER[600] : FAINT,
                    marginTop: 2
                  }}>{f.note}</div>}
                      </div>
                      {f.unconfirmed && <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: AMBER[600],
                  background: AMBER[50],
                  padding: "2px 7px",
                  borderRadius: 3,
                  height: "fit-content",
                  whiteSpace: "nowrap"
                }}>unconfirmed</span>}
                    </div>)}
                </div>
              </Section>}
            {tab === "Guidelines" && <Section id="guidelines" title="Real documentation">
                <GuidelinesTab item={item} />
              </Section>}
            {tab === "QA Notes" && <Section id="usage" title="Flags found in code">
                {item.capturedNotes.length === 0 ? <p style={{
              fontSize: 13,
              color: FAINT,
              fontStyle: "italic"
            }}>Nothing flagged for this component — no real inconsistencies were found in the exported code.</p> : <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}>
                    {item.capturedNotes.map((n, i) => <div key={i} style={{
                borderLeft: `3px solid ${ACCENT}`,
                background: ACCENT_TINT,
                padding: "10px 14px",
                fontSize: 13,
                lineHeight: 1.6
              }}>{n}</div>)}
                  </div>}
              </Section>}
          </div>
          <div style={{
          padding: "28px 0 0 40px"
        }}><ContentsRail items={toc[tab]} onJump={jump} /></div>
        </div>
      </div>
    </div>;
}
function DetailPage({
  item
}) {
  const headline = item.summary.split(/(?<=\.)\s+/)[0];
  return <div>
      <GrayBand title={item.name} description={headline} extra={<RealTag />} />
      <ComponentTabsBody item={item} />
    </div>;
}
function FamilyPage({
  family,
  navigate
}) {
  const members = family.members.map(id => COMPONENTS.find(c => c.id === id)).filter(Boolean);
  const [selectedId, setSelectedId] = useState(members[0]?.id);
  const selected = members.find(m => m.id === selectedId) || members[0];
  if (!selected) return null;
  const headline = selected.summary.split(/(?<=\.)\s+/)[0];
  return <div>
      <GrayBand title={family.label} description={`${members.length} real variants grouped on one page.`} extra={<RealTag />} />
      <div style={{
      padding: "16px 40px 0",
      borderBottom: `1px solid ${LINE}`
    }}>
        <div style={{
        display: "flex",
        gap: 8,
        maxWidth: CONTENT_MAX,
        margin: "0 auto",
        flexWrap: "wrap"
      }}>
          {members.map(m => <button key={m.id} onClick={() => setSelectedId(m.id)} style={{
          background: selectedId === m.id ? ACCENT : "none",
          color: selectedId === m.id ? "#fff" : BODY,
          border: `1px solid ${selectedId === m.id ? ACCENT : LINE}`,
          borderRadius: 999,
          padding: "6px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 10
        }}>
              {m.name}
            </button>)}
        </div>
      </div>
      <div style={{
      padding: "16px 40px 0",
      maxWidth: CONTENT_MAX,
      margin: "0 auto"
    }}>
        <p style={{
        fontSize: 14,
        color: BODY,
        lineHeight: 1.6
      }}>{headline}</p>
      </div>
      <ComponentTabsBody item={selected} />
    </div>;
}

/* =============================================================================
   SIDEBAR / TOP BAR / HOME / APP
============================================================================= */

function Sidebar({
  page,
  navigate
}) {
  const [openGroups, setOpenGroups] = useState({
    getStarted: true,
    foundations: true,
    actions: true
  });
  const toggle = k => setOpenGroups(o => ({
    ...o,
    [k]: !o[k]
  }));
  return <div style={{
    width: 250,
    flexShrink: 0,
    borderRight: `1px solid ${LINE}`,
    overflowY: "auto",
    padding: "14px 0"
  }}>
      <button onClick={() => navigate({
      kind: "home"
    })} style={{
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "7px 16px",
      background: page.kind === "home" ? ACCENT_TINT : "none",
      border: "none",
      borderLeft: page.kind === "home" ? `2px solid ${ACCENT}` : "2px solid transparent",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: page.kind === "home" ? 700 : 400
    }}>Home</button>

      <div style={{
      marginTop: 8
    }}>
        <button onClick={() => toggle("getStarted")} style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        width: "100%",
        padding: "7px 16px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600
      }}>
          {openGroups.getStarted ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Get Started
        </button>
        {openGroups.getStarted && GET_STARTED_ITEMS.map(it => <button key={it.key} onClick={() => navigate({
        kind: "getstarted",
        ref: it.key
      })} style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "6px 16px 6px 34px",
        background: page.kind === "getstarted" && page.ref === it.key ? ACCENT_TINT : "none",
        border: "none",
        borderLeft: page.kind === "getstarted" && page.ref === it.key ? `2px solid ${ACCENT}` : "2px solid transparent",
        cursor: "pointer",
        fontSize: 13
      }}>
            {it.label}
          </button>)}
      </div>

      <div style={{
      marginTop: 8
    }}>
        <button onClick={() => toggle("foundations")} style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        width: "100%",
        padding: "7px 16px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600
      }}>
          {openGroups.foundations ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Foundations
        </button>
        {openGroups.foundations && FOUNDATION_KEYS.map(k => <button key={k} onClick={() => navigate({
        kind: "foundation",
        ref: k
      })} style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "6px 16px 6px 34px",
        background: page.kind === "foundation" && page.ref === k ? ACCENT_TINT : "none",
        border: "none",
        borderLeft: page.kind === "foundation" && page.ref === k ? `2px solid ${ACCENT}` : "2px solid transparent",
        cursor: "pointer",
        fontSize: 13
      }}>
            {FOUNDATION_LABELS[k]}
          </button>)}
      </div>

      <div style={{
      marginTop: 8
    }}>
        <div style={{
        padding: "7px 16px",
        fontSize: 11,
        fontWeight: 700,
        color: FAINT,
        fontFamily: FONT_MONO,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>Components</div>
        {COMPONENT_GROUPS.map(g => {
        const familiesInGroup = FAMILIES.filter(f => familyGroupKey(f) === g.key);
        const standalone = COMPONENTS.filter(c => c.groupKey === g.key && !FAMILY_MEMBER_IDS.has(c.id));
        return <div key={g.key}>
              <button onClick={() => toggle(g.key)} style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            width: "100%",
            padding: "5px 16px 5px 20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            color: FAINT,
            textTransform: "uppercase",
            fontFamily: FONT_MONO,
            letterSpacing: "0.04em"
          }}>
                {openGroups[g.key] ? <ChevronDown size={11} /> : <ChevronRight size={11} />} {g.label}
              </button>
              {openGroups[g.key] && <>
                  {familiesInGroup.map(f => <button key={f.id} className="apy-row" onClick={() => navigate({
              kind: "family",
              ref: f
            })} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              textAlign: "left",
              padding: "5px 16px 5px 40px",
              background: page.kind === "family" && page.ref?.id === f.id ? ACCENT_TINT : "none",
              border: "none",
              borderLeft: page.kind === "family" && page.ref?.id === f.id ? `2px solid ${ACCENT}` : "2px solid transparent",
              cursor: "pointer",
              fontSize: 13,
              transition: "background 120ms ease"
            }}>
                      <span>{f.label}</span>
                      <span style={{
                fontSize: 10,
                color: FAINT,
                fontFamily: FONT_MONO
              }}>{f.members.length}</span>
                    </button>)}
                  {standalone.map(c => <button key={c.id} className="apy-row" onClick={() => navigate({
              kind: "component",
              ref: c
            })} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              textAlign: "left",
              padding: "5px 16px 5px 40px",
              background: page.kind === "component" && page.ref?.id === c.id ? ACCENT_TINT : "none",
              border: "none",
              borderLeft: page.kind === "component" && page.ref?.id === c.id ? `2px solid ${ACCENT}` : "2px solid transparent",
              cursor: "pointer",
              fontSize: 13,
              transition: "background 120ms ease"
            }}>
                      <span>{c.name}</span>
                      {!getGuidelines(c.id) && <span title="No real documentation yet" style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: SLATE[300],
                flexShrink: 0,
                marginRight: 10
              }} />}
                    </button>)}
                </>}
            </div>;
      })}
      </div>
    </div>;
}
function buildSearchIndex() {
  const idx = [];
  COMPONENTS.forEach(c => idx.push({
    label: c.name,
    sub: `Component · ${COMPONENT_GROUPS.find(g => g.key === c.groupKey)?.label}`,
    kind: "component",
    ref: c
  }));
  FOUNDATION_KEYS.forEach(k => idx.push({
    label: FOUNDATION_LABELS[k],
    sub: "Foundation",
    kind: "foundation",
    ref: k
  }));
  return idx;
}
const SEARCH_INDEX = buildSearchIndex();
function TopBar({
  onNavigate
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(r => r.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);
  return <div style={{
    height: 56,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    gap: 20,
    borderBottom: `1px solid ${LINE}`,
    background: "#fff"
  }}>
      <button onClick={() => onNavigate({
      kind: "home"
    })} style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "none",
      border: "none",
      cursor: "pointer"
    }}>
        <Mark size={26} />
        <span style={{
        display: "flex",
        flexDirection: "column",
        lineHeight: 1.15
      }}>
          <span style={{
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          fontFamily: FONT,
          color: INK
        }}>Apiary</span>
          <span style={{
          fontSize: 10,
          color: FAINT
        }}>Design System</span>
        </span>
      </button>
      <span style={{
      fontSize: 12,
      color: FAINT
    }}>· RAA design system reference</span>
      <div style={{
      marginLeft: "auto",
      position: "relative",
      width: 260
    }}>
        <Search size={14} color={FAINT} style={{
        position: "absolute",
        left: 10,
        top: 11
      }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search components & foundations" style={{
        width: "100%",
        background: BAND,
        border: `1px solid ${LINE}`,
        borderRadius: 4,
        padding: "8px 10px 8px 30px",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box"
      }} />
        {results.length > 0 && <div style={{
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 6,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        overflow: "hidden",
        zIndex: 40
      }}>
            {results.map((r, i) => <button key={i} onClick={() => {
          setQuery("");
          onNavigate(r);
        }} style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "9px 12px",
          background: "none",
          border: "none",
          borderBottom: i < results.length - 1 ? `1px solid ${BAND}` : "none",
          cursor: "pointer"
        }}>
                <div style={{
            fontSize: 13
          }}>{r.label}</div><div style={{
            fontSize: 11,
            color: FAINT
          }}>{r.sub}</div>
              </button>)}
          </div>}
      </div>
    </div>;
}
function DotPattern() {
  return <svg className="absolute inset-0" width="100%" height="100%" style={{
    opacity: 0.4
  }}>
      <defs><pattern id="apy-dots" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#E2E0D8" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#apy-dots)" />
    </svg>;
}
function HomePage({
  navigate
}) {
  const flaggedCount = COMPONENTS.reduce((n, c) => n + c.capturedNotes.length, 0);
  return <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
      position: "relative",
      minHeight: "88vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      background: "#FFFEF9",
      padding: "0 40px"
    }}>
        <DotPattern />
        <div className="apy-blob" style={{
        position: "absolute",
        width: 620,
        height: 620,
        top: -180,
        right: -140,
        borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgba(255,230,0,0.20) 0%, transparent 65%)"
      }} />
        <div className="apy-blob2" style={{
        position: "absolute",
        width: 460,
        height: 460,
        bottom: -100,
        left: -80,
        borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgba(150,120,210,0.14) 0%, transparent 65%)"
      }} />
        <div className="apy-blob3" style={{
        position: "absolute",
        width: 300,
        height: 300,
        top: "38%",
        right: "16%",
        borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgba(0,112,100,0.12) 0%, transparent 65%)"
      }} />

        {/* Static top header */}
        <header style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: "#fff",
        borderBottom: `1px solid ${LINE}`
      }}>
          <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
            <Mark size={20} /><span style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            fontFamily: FONT
          }}>APIARY</span>
          </div>
          <nav style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          fontSize: 13,
          color: BODY
        }}>
            <button onClick={() => navigate({
            kind: "getstarted",
            ref: "what-is-apiary"
          })} className="apy-nav-link apy-link-hover" style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: BODY,
            fontFamily: FONT
          }}>Get Started</button>
            {["Foundations", "Components", "Patterns", "Resources"].map(n => <button key={n} onClick={() => navigate({
            kind: n === "Foundations" ? "foundation" : "component",
            ref: n === "Foundations" ? "colour" : COMPONENTS[0]
          })} className="apy-nav-link apy-link-hover" style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: BODY,
            fontFamily: FONT
          }}>{n}</button>)}
          </nav>
          <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16
        }}>
            <span style={{
            fontSize: 11,
            color: FAINT,
            fontFamily: FONT_MONO
          }}>v1.0 — real capture</span>
            <button onClick={() => navigate({
            kind: "component",
            ref: COMPONENTS[0]
          })} style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: ACCENT,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>Open docs <ChevronRight size={14} /></button>
          </div>
        </header>

        {/* Hero content */}
        <div style={{
        position: "relative",
        zIndex: 5,
        paddingTop: 60,
        maxWidth: 980
      }}>
          <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 12px",
          borderRadius: 999,
          background: ACCENT_TINT,
          border: `1px solid ${INDIGO[200]}`,
          marginBottom: 34
        }}>
            <span style={{
            fontSize: 11,
            fontFamily: FONT_MONO,
            fontWeight: 600,
            color: ACCENT
          }}>{COMPONENTS.length} components, captured from real code</span>
          </div>

          <div style={{
          marginBottom: 28,
          lineHeight: 0.86,
          userSelect: "none"
        }}>
            <div style={{
            fontSize: "clamp(56px, 9vw, 120px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontFamily: FONT_DISPLAY,
            color: INK
          }}>API</div>
            <div style={{
            fontSize: "clamp(56px, 9vw, 120px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontFamily: FONT_DISPLAY,
            color: ACCENT,
            marginLeft: "clamp(20px, 5vw, 72px)"
          }}>ARY</div>
          </div>

          <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "flex-end",
          marginBottom: 40
        }}>
            <p style={{
            fontSize: 18,
            color: BODY,
            lineHeight: 1.6,
            maxWidth: 440,
            margin: 0
          }}>
              RAA's real design system, captured off live code — <span style={{
              color: INK,
              fontWeight: 700
            }}>not described, not guessed, extracted.</span>
            </p>
            <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 12,
            fontFamily: FONT_MONO,
            color: FAINT
          }}>
              <span>/ {COMPONENTS.length} real components</span>
              <span>/ {COLOUR_RAMPS.length} colour ramps</span>
              <span>/ {ELEVATION.length} elevation levels</span>
              <span>/ {flaggedCount} real bugs flagged</span>
            </div>
          </div>

          <div style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap"
        }}>
            <button className="apy-btn" onClick={() => navigate({
            kind: "component",
            ref: COMPONENTS[0]
          })} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: ACCENT,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 26px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer"
          }}>
              Explore the system <ChevronRight size={15} />
            </button>
            <button className="apy-btn" onClick={() => navigate({
            kind: "foundation",
            ref: "colour"
          })} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            color: SLATE[700],
            border: `1px solid ${SLATE[200]}`,
            borderRadius: 8,
            padding: "14px 26px",
            fontSize: 13,
            fontFamily: FONT_MONO,
            cursor: "pointer"
          }}>
              see_the_real_palette →
            </button>
          </div>
        </div>

        <div style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      }}>
          <div style={{
          width: 1,
          height: 34,
          background: `linear-gradient(to bottom, transparent, ${FAINT})`
        }} />
          <span style={{
          fontSize: 9,
          fontFamily: FONT_MONO,
          letterSpacing: "0.2em",
          color: FAINT,
          textTransform: "uppercase"
        }}>scroll</span>
        </div>
      </section>

      <section style={{
      padding: "72px 40px",
      borderTop: `1px solid ${LINE}`,
      background: BAND
    }}>
        <div style={{
        maxWidth: 900
      }}>
          <p style={{
          fontSize: 11,
          fontFamily: FONT_MONO,
          fontWeight: 600,
          color: AMBER[600],
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 10
        }}>Provenance</p>
          <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          fontFamily: FONT_DISPLAY,
          marginBottom: 28,
          letterSpacing: "-0.01em"
        }}>What's real vs. what's substituted</h2>
          <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16
        }}>
            <div style={{
            background: "#fff",
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: 22
          }}>
              <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#007064",
              marginBottom: 8,
              fontFamily: FONT_MONO
            }}>✓ REAL</div>
              <p style={{
              fontSize: 14,
              color: BODY,
              lineHeight: 1.65,
              margin: 0
            }}>Every colour, border, radius, padding, and gap value. The full colour palette. Every elevation shadow. The real type scale. RaaMasterLogo's exact gradient stops. Every flagged inconsistency below is a genuine bug in the source file.</p>
            </div>
            <div style={{
            background: "#fff",
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: 22
          }}>
              <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#946F00",
              marginBottom: 8,
              fontFamily: FONT_MONO
            }}>⚠ SUBSTITUTED</div>
              <p style={{
              fontSize: 14,
              color: BODY,
              lineHeight: 1.65,
              margin: 0
            }}>National 2 (licensed) → Inter/Plus Jakarta Sans. Font Awesome 6 Pro (licensed) → lucide-react. Icon and logo shape data (raw SVG paths weren't captured) → simplified approximations using the real colour values.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE ──────────────────────────────────────────────── */}
      <section style={{
      padding: "72px 40px"
    }}>
        <p style={{
        fontSize: 11,
        fontFamily: FONT_MONO,
        fontWeight: 600,
        color: ACCENT,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: 10
      }}>By the numbers</p>
        <h2 style={{
        fontSize: 32,
        fontWeight: 800,
        fontFamily: FONT_DISPLAY,
        marginBottom: 28,
        letterSpacing: "-0.01em"
      }}>Explore</h2>
        <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 14
      }}>
          {COMPONENT_GROUPS.map(g => <button key={g.key} className="apy-btn" onClick={() => {
          const first = COMPONENTS.find(c => c.groupKey === g.key);
          if (first) navigate({
            kind: "component",
            ref: first
          });
        }} style={{
          textAlign: "left",
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: 18,
          background: "#fff",
          cursor: "pointer"
        }}>
              <div style={{
            fontSize: 16,
            fontWeight: 700,
            fontFamily: FONT_DISPLAY,
            marginBottom: 6
          }}>{g.label}</div>
              <div style={{
            fontSize: 12,
            color: FAINT,
            fontFamily: FONT_MONO
          }}>{COMPONENTS.filter(c => c.groupKey === g.key).length} components</div>
            </button>)}
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section style={{
      padding: "48px 40px",
      borderTop: `1px solid ${LINE}`,
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      gap: 24,
      textAlign: "center"
    }}>
        {[{
        n: COMPONENTS.length,
        label: "Components"
      }, {
        n: COMPONENTS.reduce((s, c) => s + c.tokenFindings.length, 0),
        label: "Real values captured"
      }, {
        n: FOUNDATION_KEYS.length,
        label: "Foundations"
      }, {
        n: COMPONENTS.filter(c => getGuidelines(c.id)).length,
        label: `Documented (of ${COMPONENTS.length})`
      }, {
        n: flaggedCount,
        label: "Real bugs flagged"
      }].map((s, i) => <div key={i}>
            <div style={{
          fontSize: 36,
          fontWeight: 800,
          color: ACCENT,
          fontFamily: FONT_DISPLAY
        }}>{s.n}</div>
            <div style={{
          fontSize: 13,
          color: FAINT
        }}>{s.label}</div>
          </div>)}
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────── */}
      <section style={{
      padding: "72px 40px",
      background: ACCENT,
      textAlign: "center"
    }}>
        <p style={{
        fontSize: 11,
        fontFamily: FONT_MONO,
        fontWeight: 600,
        color: INDIGO[200],
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: 14
      }}>Get started</p>
        <h2 style={{
        fontSize: 34,
        fontWeight: 800,
        color: "#fff",
        fontFamily: FONT_DISPLAY,
        marginBottom: 12,
        letterSpacing: "-0.01em"
      }}>Real data, not a mockup.</h2>
        <p style={{
        fontSize: 15,
        color: INDIGO[100],
        marginBottom: 26
      }}>Start with Foundations, browse real components, see exactly what's flagged.</p>
        <div style={{
        display: "flex",
        gap: 14,
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
          <button onClick={() => navigate({
          kind: "component",
          ref: COMPONENTS[0]
        })} style={{
          background: "#fff",
          color: ACCENT,
          border: "none",
          borderRadius: 8,
          padding: "13px 26px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer"
        }}>Browse the system →</button>
          <button onClick={() => navigate({
          kind: "foundation",
          ref: "colour"
        })} style={{
          background: "transparent",
          color: INDIGO[100],
          border: "none",
          padding: "13px 10px",
          fontSize: 14,
          cursor: "pointer"
        }}>See real foundations</button>
        </div>
      </section>

      <footer style={{
      padding: "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: `1px solid ${LINE}`,
      fontSize: 12,
      color: FAINT
    }}>
        <span>APIary — real RAA design system reference</span>
        <span>Patterns and Templates: not yet captured, by design</span>
      </footer>
    </div>;
}
// Real hash routing — shareable deep links, works natively on GitHub Pages
// with no server config, and supports the browser back/forward buttons.
function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [kind, ref] = h.split("/").map(decodeURIComponent);
  if (!kind || kind === "home") return { kind: "home" };
  if (kind === "component") {
    const c = COMPONENTS.find((c) => c.id === ref);
    return c ? { kind: "component", ref: c } : { kind: "home" };
  }
  if (kind === "family") {
    const f = FAMILIES.find((f) => f.id === ref);
    return f ? { kind: "family", ref: f } : { kind: "home" };
  }
  if (kind === "foundation") return { kind: "foundation", ref: ref || FOUNDATION_KEYS[0] };
  if (kind === "getstarted") return { kind: "getstarted", ref: ref || GET_STARTED_ITEMS[0].key };
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
  const navigate = target => {
    const next = ["foundation", "component", "getstarted", "family"].includes(target.kind) ? target : {
      kind: target.kind
    };
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
    return <div style={{
      fontFamily: FONT,
      color: "#000"
    }}>
        <GlobalStyles />
        <HomePage navigate={navigate} />
      </div>;
  }
  return <div style={{
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#fff",
    fontFamily: FONT,
    color: "#000"
  }}>
      <GlobalStyles />
      <TopBar onNavigate={navigate} />
      <div style={{
      flex: 1,
      display: "flex",
      overflow: "hidden"
    }}>
        <Sidebar page={page} navigate={navigate} />
        <div style={{
        flex: 1,
        overflowY: "auto"
      }}>
          {page.kind === "getstarted" && <GetStartedPage active={page.ref} />}
          {page.kind === "foundation" && <FoundationsPage active={page.ref} onSelect={k => navigate({
          kind: "foundation",
          ref: k
        })} />}
          {page.kind === "component" && <DetailPage item={page.ref} />}
          {page.kind === "family" && <FamilyPage family={page.ref} navigate={navigate} />}
        </div>
      </div>
    </div>;
}
/* =============================================================================
   DATA BOOTSTRAP — every real value lives in /data/*.json, not in this file.
   Update a JSON file in the repo and it changes here automatically on next
   load; no code edit needed. This is what makes the data "live" per-repo.
============================================================================= */
const DATA_FILES = {
  COMPONENTS: "COMPONENTS.json", GUIDELINES: "GUIDELINES.json",
  FOUNDATION_NARRATIVE: "FOUNDATION_NARRATIVE.json", GET_STARTED_CONTENT: "GET_STARTED_CONTENT.json",
  COLOUR_RAMPS: "COLOUR_RAMPS.json", TYPESCALE: "TYPESCALE.json", ELEVATION: "ELEVATION.json",
  GRADIENT_TOKEN: "GRADIENT_TOKEN.json", INTERACTION_TOKENS: "INTERACTION_TOKENS.json",
  BUTTON_STATE_TOKENS: "BUTTON_STATE_TOKENS.json", SPACING_SCALE: "SPACING_SCALE.json",
  FAMILIES: "FAMILIES.json", COMPONENT_GROUPS: "COMPONENT_GROUPS.json",
  FOUNDATION_KEYS: "FOUNDATION_KEYS.json", FOUNDATION_LABELS: "FOUNDATION_LABELS.json",
  GET_STARTED_ITEMS: "GET_STARTED_ITEMS.json", GET_STARTED_LABELS: "GET_STARTED_LABELS.json",
  ICONS_REFERENCED_NAMES: "ICONS_REFERENCED.json", R: "R.json",
};

async function boot() {
  const root = document.getElementById("root");
  root.innerHTML = '<div style="font-family:Inter,sans-serif;padding:60px;color:#64748B">Loading real data…</div>';

  const base = new URL("./data/", document.baseURI);
  const entries = Object.entries(DATA_FILES);
  const results = await Promise.all(
    entries.map(([, file]) => fetch(new URL(file, base)).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${file}: ${r.status}`);
      return r.json();
    }))
  );
  entries.forEach(([varName], i) => { globalThis[varName] = results[i]; });

  // The stripped consts above are function-scoped `let` bindings, not truly
  // global — reassign them here via the same names so every render function
  // that closes over them (unchanged from the original artifact) sees data.
  COMPONENTS = globalThis.COMPONENTS; GUIDELINES = globalThis.GUIDELINES;
  FOUNDATION_NARRATIVE = globalThis.FOUNDATION_NARRATIVE; GET_STARTED_CONTENT = globalThis.GET_STARTED_CONTENT;
  COLOUR_RAMPS = globalThis.COLOUR_RAMPS; TYPESCALE = globalThis.TYPESCALE; ELEVATION = globalThis.ELEVATION;
  GRADIENT_TOKEN = globalThis.GRADIENT_TOKEN; INTERACTION_TOKENS = globalThis.INTERACTION_TOKENS;
  BUTTON_STATE_TOKENS = globalThis.BUTTON_STATE_TOKENS; SPACING_SCALE = globalThis.SPACING_SCALE;
  FAMILIES = globalThis.FAMILIES; COMPONENT_GROUPS = globalThis.COMPONENT_GROUPS;
  FOUNDATION_KEYS = globalThis.FOUNDATION_KEYS; FOUNDATION_LABELS = globalThis.FOUNDATION_LABELS;
  GET_STARTED_ITEMS = globalThis.GET_STARTED_ITEMS; GET_STARTED_LABELS = globalThis.GET_STARTED_LABELS;
  ICONS_REFERENCED_NAMES = globalThis.ICONS_REFERENCED_NAMES; R = globalThis.R;

  ReactDOM.createRoot(root).render(<APIary />);
}

boot().catch((err) => {
  document.getElementById("root").innerHTML =
    `<div style="font-family:Inter,sans-serif;padding:60px;color:#DC2626">Failed to load real data: ${err.message}. Check that /data/*.json exists and this page is served over http(s), not file://.</div>`;
});
