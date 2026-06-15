/**
 * DebaterPanel — two modes:
 *
 *  SELECTOR mode  (debater === null, i.e. before debate starts)
 *    Shows a transparent personality dropdown + randomize link.
 *    If a group is active, shows the group role label instead.
 *
 *  IDENTITY mode  (debater is set, i.e. debate is running or complete)
 *    Shows the AI-generated name, letter avatar, and personality badge.
 */
import { PERSONALITIES } from "../constants/personalities.js";

// ── Chevron SVG used as a custom dropdown arrow ────────────────────────────
// Always pinned to the right edge; both FOR and AGAINST use ltr direction.
function DropArrow({ color }) {
  return (
    <svg
      width="8" height="5" viewBox="0 0 8 5"
      style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <path d="M0 0L4 5L8 0" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DebaterPanel({
  debater,
  side,
  personalityId,
  onPersonalityChange,
  groupRole,           // string like "CEO" when a group is active
  isLive,             // true while debate is running (lock selectors)
}) {
  const isFor        = side === "for";
  const accentColor  = isFor ? "#c87830"  : "#2278b8";
  const headerBg     = isFor ? "#fdf0e4"  : "#c0ddf0";
  const headerBorder = isFor ? "#e8ceb0"  : "#90c0e0";
  const nameColor    = isFor ? "#2a1a08"  : "#0d2a40";
  const dimColor     = isFor ? "#904818"  : "#0a4870";
  const avatarColors = isFor
    ? { background: "#f5e4d0", color: "#7a4010", borderColor: "#c87830" }
    : { background: "#e8f4fc", color: "#0a4870", borderColor: "#2278b8" };

  const label   = isFor ? "FOR THE MOTION" : "AGAINST THE MOTION";
  const initial = debater?.name ? debater.name.charAt(0).toUpperCase() : "?";
  const currentLabel = PERSONALITIES.find(p => p.id === personalityId)?.label ?? "";

  const flexDir = isFor ? "row" : "row-reverse";

  // ── IDENTITY mode ──────────────────────────────────────────────────────────
  if (debater) {
    return (
      <div style={{
        display: "flex", alignItems: "center", flexDirection: flexDir, gap: "12px",
        padding: "12px 16px",
        background: headerBg,
        borderTop: `2px solid ${accentColor}`,
        borderBottom: `0.5px solid ${headerBorder}`,
      }}>
        {/* Letter-initial avatar */}
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700,
          flexShrink: 0, border: "2px solid", ...avatarColors,
        }}>
          {initial}
        </div>

        {/* Name + stance + personality badge */}
        <div style={{ textAlign: isFor ? "left" : "right" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700, color: nameColor, marginBottom: "1px" }}>
            {debater.name}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "8px", letterSpacing: "0.13em", color: accentColor }}>
            {label}
          </div>
          {/* Personality badge — prefers backend-assigned role (reflects actual swap),
               falls back to frontend groupRole, then individual personality label */}
          <div style={{
            display: "inline-block", marginTop: "4px",
            fontFamily: "'DM Mono', monospace", fontSize: "8px", letterSpacing: "0.08em",
            padding: "2px 7px", borderRadius: "3px",
            background: "transparent",
            border: `0.5px solid ${accentColor}55`,
            color: dimColor,
          }}>
            {(debater.role ?? groupRole ?? currentLabel).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  // ── SELECTOR mode ──────────────────────────────────────────────────────────
  return (
    <div style={{
      padding: "12px 16px",
      background: headerBg,
      borderTop: `2px solid ${accentColor}`,
      borderBottom: `0.5px solid ${headerBorder}`,
      display: "flex",
      flexDirection: "column",
      alignItems: isFor ? "flex-start" : "flex-end",
      gap: "8px",
    }}>
      {/* Stance label */}
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "8px", letterSpacing: "0.14em", color: accentColor }}>
        {label}
      </div>

      {/* Group role override — no dropdown needed */}
      {groupRole ? (
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 700,
          color: nameColor, fontStyle: "italic",
        }}>
          {groupRole}
        </div>
      ) : (
        /* Individual personality dropdown */
        <div style={{ position: "relative", width: "100%" }}>
          <select
            value={personalityId}
            onChange={e => onPersonalityChange(e.target.value)}
            disabled={isLive}
            style={{
              width: "100%",
              background: "transparent",
              border: `0.5px solid ${accentColor}50`,
              borderRadius: "4px",
              // Always ltr + right-pad for the SVG arrow pinned at right:9
              padding: "5px 28px 5px 8px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              color: dimColor,
              cursor: isLive ? "not-allowed" : "pointer",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              outline: "none",
            }}
          >
            {PERSONALITIES.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <DropArrow color={accentColor} />
        </div>
      )}

      {/* Randomize link — hidden when group active or live */}
      {!groupRole && !isLive && (
        <button
          onClick={() => {
            const others = PERSONALITIES.filter(p => p.id !== personalityId);
            onPersonalityChange(others[Math.floor(Math.random() * others.length)].id);
          }}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "8px", letterSpacing: "0.08em",
            color: accentColor, opacity: 0.65, textDecoration: "underline", textUnderlineOffset: "2px",
            alignSelf: isFor ? "flex-start" : "flex-end",
          }}
        >
          ↻ randomize
        </button>
      )}
    </div>
  );
}
