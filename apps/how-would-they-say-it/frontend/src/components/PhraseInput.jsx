/**
 * PhraseInput — paper-themed phrase entry.
 * Textarea + example chips + distribute button.
 */
import { useState } from "react";

const EXAMPLES = [
  "I've decided to make Fridays optional 1/2 days. Subject to your departmental needs.",
  "I need everyone in the all-hands at 6pm tonight.",
  "I need this done by tomorrow morning.",
  "Despite all the personnel changes, everybody's job is secure.",
];

export default function PhraseInput({ onSubmit, isLoading }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim().length >= 3 && !isLoading) onSubmit(value.trim());
  };

  const canSubmit = value.trim().length >= 3 && !isLoading;

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>

      {/* ── Textarea ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a phrase, sentence, or workplace announcement…"
          rows={3}
          disabled={isLoading}
          style={{
            width: "100%", boxSizing: "border-box", resize: "none",
            borderRadius: "8px", border: "0.5px solid #C4B99A",
            background: "#FDF8F0", padding: "14px 44px 14px 16px",
            fontSize: "17px", lineHeight: "1.6", color: "#1C1510",
            fontFamily: "Georgia, serif", outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#8B7355"}
          onBlur={(e) => e.target.style.borderColor = "#C4B99A"}
        />
        <span style={{
          position: "absolute", bottom: "10px", right: "12px",
          fontSize: "13px", color: "#C4B99A",
          fontFamily: "system-ui, sans-serif",
        }}>
          {value.length}
        </span>
      </div>

      {/* ── Example chips ────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "13px", color: "#A8957A", fontFamily: "system-ui, sans-serif" }}>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setValue(ex)}
            disabled={isLoading}
            style={{
              fontSize: "13px", padding: "4px 10px", borderRadius: "20px",
              border: "0.5px solid #C4B99A", background: "#FDF8F0",
              color: "#7A6A52", cursor: "pointer", fontFamily: "system-ui, sans-serif",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseOver={(e) => { e.target.style.borderColor = "#8B7355"; e.target.style.color = "#3A2E1E"; }}
            onMouseOut={(e) => { e.target.style.borderColor = "#C4B99A"; e.target.style.color = "#7A6A52"; }}
          >
            {ex.length > 42 ? ex.slice(0, 41) + "…" : ex}
          </button>
        ))}
      </div>

      {/* ── Submit ───────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          width: "100%", padding: "14px",
          borderRadius: "8px", border: "none",
          fontWeight: "500", fontSize: "16px", letterSpacing: "0.3px",
          background: canSubmit ? "#2C2416" : "#C4B99A",
          color: "#F5F0E8",
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "background 0.2s",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {isLoading
          ? "Distributing to all departments…"
          : "Distribute to all 8 departments →"}
      </button>
    </form>
  );
}
