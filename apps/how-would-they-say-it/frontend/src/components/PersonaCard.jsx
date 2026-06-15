/**
 * PersonaCard — office memo card.
 * Colored top band, letterhead (avatar + name + title), RE line,
 * body text, and stamp footer. Info + copy actions in header.
 */
import { useState } from "react";

// Maps each persona id → visual config for the memo card
const PERSONA_CONFIG = {
  "passive-aggressive-boss": {
    initials: "SM", hex: "#7C3AED",
    avatarBg: "#EDE9FE", avatarColor: "#5B21B6",
    stamp: "Passive-Aggressive",
  },
  "ragequit-ceo": {
    initials: "MT", hex: "#DC2626",
    avatarBg: "#FEE2E2", avatarColor: "#991B1B",
    stamp: "URGENT — COO",
  },
  "enthusiastic-intern": {
    initials: "TB", hex: "#16A34A",
    avatarBg: "#DCFCE7", avatarColor: "#166534",
    stamp: "Enthusiastic",
  },
  "hr-karen": {
    initials: "DK", hex: "#2563EB",
    avatarBg: "#DBEAFE", avatarColor: "#1E40AF",
    stamp: "Official",
  },
  "diplomatic-ceo": {
    initials: "CV", hex: "#4338CA",
    avatarBg: "#E0E7FF", avatarColor: "#3730A3",
    stamp: "Strategic",
  },
  "the-lawyer": {
    initials: "RH", hex: "#059669",
    avatarBg: "#D1FAE5", avatarColor: "#065F46",
    stamp: "Privileged",
  },
  "burned-out-admin": {
    initials: "JW", hex: "#6B7280",
    avatarBg: "#F3F4F6", avatarColor: "#374151",
    stamp: "Acknowledged",
  },
  "wellness-girlboss": {
    initials: "AG", hex: "#DB2777",
    avatarBg: "#FCE7F3", avatarColor: "#9D174D",
    stamp: "Manifesting",
  },
};

const FALLBACK = {
  initials: "?", hex: "#6B7280",
  avatarBg: "#F3F4F6", avatarColor: "#374151",
  stamp: "Noted",
};

export default function PersonaCard({ persona, index, onOpenInfo, isHighlighted, fullWidth }) {
  const [copied, setCopied] = useState(false);
  const cfg = PERSONA_CONFIG[persona.id] || FALLBACK;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(persona.rewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  // Truncate long RE lines so they fit as a memo subject
  const reLine = persona.signature
    ? persona.signature.length > 90
      ? persona.signature.slice(0, 88) + "…"
      : persona.signature
    : null;

  return (
    <div
      id={`card-${persona.id}`}
      className="animate-slide-up"
      style={{
        gridColumn: fullWidth ? "1 / -1" : undefined,
        display: "flex", flexDirection: "column",   /* stretch to row height */
        border: isHighlighted ? `1.5px solid #2C2416` : "0.5px solid #C4B99A",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#FDF8F0",
        transition: "border-color 0.2s, border-width 0.1s",
        animationDelay: `${index * 55}ms`,
        animationFillMode: "both",
      }}
    >
      {/* ── Colored top band ───────────────────────────────────────── */}
      <div style={{ height: "4px", background: cfg.hex }} />

      {/* ── Letterhead ─────────────────────────────────────────────── */}
      <div style={{ padding: "10px 12px 8px", borderBottom: "0.5px solid #D6CDB8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: reLine ? "6px" : "0" }}>
          {/* Avatar circle — SVG portrait with initials fallback */}
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
            background: cfg.avatarBg, color: cfg.avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: "500", fontFamily: "system-ui, sans-serif",
            overflow: "hidden", position: "relative",
          }}>
            <span style={{ position: "absolute" }}>{cfg.initials}</span>
            <img
              src={`/how-would-they-say-it/avatars/${persona.id}.svg`}
              alt={persona.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
            />
          </div>

          {/* Name + title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: "#1C1510", lineHeight: 1.2, fontFamily: "system-ui, sans-serif" }}>
              {persona.name}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#7A6A52", fontFamily: "system-ui, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {persona.title}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {/* Info — persona brand color */}
            <button
              onClick={() => onOpenInfo(persona.id)}
              title="View personality"
              style={{
                width: "26px", height: "26px", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "6px",
                border: `0.5px solid ${cfg.hex}55`,
                background: `${cfg.hex}10`,
                cursor: "pointer",
                color: cfg.hex,
                transition: "background 0.15s",
              }}
            >
              <InfoIcon />
            </button>
            {/* Copy — slate, turns green on success */}
            <button
              onClick={handleCopy}
              title="Copy rewrite"
              style={{
                width: "26px", height: "26px", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "6px",
                border: copied ? "0.5px solid #16A34A" : "0.5px solid #94A3B855",
                background: copied ? "#DCFCE7" : "#64748B10",
                cursor: "pointer",
                color: copied ? "#16A34A" : "#64748B",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        {/* RE line — uses persona signature as the memo subject */}
        {reLine && (
          <div style={{
            borderTop: "0.5px solid #D6CDB8", paddingTop: "5px",
            fontSize: "13px", color: "#2C1C10", fontFamily: "system-ui, sans-serif",
            fontWeight: "600", lineHeight: 1.35,
          }}>
            <span style={{
              color: cfg.hex, fontStyle: "normal", fontWeight: "700",
              fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px",
              marginRight: "5px",
            }}>
              Re:
            </span>
            {reLine}
          </div>
        )}
      </div>

      {/* ── Body — the rewritten phrase ────────────────────────────── */}
      <div style={{
        padding: "10px 12px",
        fontSize: "15px", lineHeight: "1.65",
        color: "#1C1510", fontFamily: "Georgia, serif",
        background: "#FDF8F0",
        flex: 1,
      }}>
        {persona.rewrite}
      </div>

      {/* ── Footer stamp ───────────────────────────────────────────── */}
      <div style={{
        padding: "6px 12px", background: "#F0E8D8",
        borderTop: "0.5px solid #D6CDB8",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{
          fontSize: "10px", fontWeight: "500", letterSpacing: "1px",
          textTransform: "uppercase", fontFamily: "system-ui, sans-serif",
          border: `1.5px solid ${cfg.hex}`, color: cfg.hex,
          padding: "1px 7px", borderRadius: "2px",
          transform: "rotate(-1.5deg)", display: "inline-block",
        }}>
          {cfg.stamp}
        </span>
        <span style={{ fontSize: "12px", color: "#A8957A", fontFamily: "system-ui, sans-serif" }}>
          Age {persona.age}
        </span>
      </div>
    </div>
  );
}

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
