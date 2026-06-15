/**
 * GroupSelector — center column between the two debater headers.
 *
 * Shows four group options as minimal bordered buttons.
 * Active group gets a subtle border highlight — no filled backgrounds.
 * When a group is selected, both debater dropdowns are replaced by
 * the group's role labels (handled in DebaterPanel via groupRole prop).
 */
import { GROUPS } from "../constants/personalities.js";

// isStarted = debate is running or complete — buttons hidden, only label remains
export default function GroupSelector({ selectedGroupId, onGroupChange, isStarted }) {
  return (
    <div style={{
      background: "rgba(200,212,224,0.18)",
      borderTop: "2px solid #c8d4e0",
      borderBottom: "0.5px solid #c8d4e0",
      borderLeft: "0.5px solid #c8d4e0",
      borderRight: "0.5px solid #c8d4e0",
      padding: "9px 6px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "5px",
    }}>
      {/* Label */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "8px",
        letterSpacing: "0.16em",
        color: "#7a9ab8",
        marginBottom: "2px",
      }}>
        GROUP
      </div>

      {/* Group buttons — hidden once debate starts */}
      {!isStarted && GROUPS.map(g => {
        const isActive = selectedGroupId === g.id;
        return (
          <button
            key={g.id}
            onClick={() => onGroupChange(isActive ? null : g.id)}
            title={`${g.forRole} vs ${g.againstRole}`}
            style={{
              width: "100%",
              background: isActive ? "#3a8fc8" : "rgba(58,143,200,0.18)",
              border: `0.5px solid ${isActive ? "#2a7ab8" : "#3a8fc8"}`,
              borderRadius: "3px",
              padding: "6px 5px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.04em",
              lineHeight: 1.4,
              color: isActive ? "#ffffff" : "#1a5a8a",
              cursor: "pointer",
              textAlign: "center",
              whiteSpace: "pre-line",   // renders the \n in GROUP_SHORT_LABELS
              transition: "background 0.15s, border-color 0.15s, color 0.15s",
            }}
          >
            {GROUP_SHORT_LABELS[g.id]}
          </button>
        );
      })}

      {/* Clear link — hidden once debate starts */}
      {!isStarted && selectedGroupId && (
        <button
          onClick={() => onGroupChange(null)}
          style={{
            background: "none", border: "none", padding: "1px 0 0",
            fontFamily: "'DM Mono', monospace", fontSize: "8px",
            letterSpacing: "0.06em", color: "#7a9ab8",
            cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px",
            opacity: 0.75,
          }}
        >
          clear
        </button>
      )}
    </div>
  );
}

// Shortened labels that fit the ~72px center column
const GROUP_SHORT_LABELS = {
  family: "FAMILY\nTABLE",
  office: "CORNER\nOFFICE",
  money:  "OLD /\nNEW $",
  faith:  "FAITH &\nFRONT",
};
