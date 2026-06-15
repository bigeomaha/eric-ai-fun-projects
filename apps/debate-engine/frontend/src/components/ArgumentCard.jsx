/**
 * ArgumentCard — one debate turn.
 *
 * FOR cards:     cream (#fdf0e4), amber left border, left-aligned tag
 * AGAINST cards: sky blue (#c0ddf0), blue right border, right-aligned tag
 *                (tag format flipped: "TURN 2 · CHALLENGE ◈")
 */
const TURN_LABELS = {
  1: "OPENING ARGUMENT",
  2: "CHALLENGE",
  3: "REBUTTAL",
  4: "COUNTER-REBUTTAL",
  5: "CLOSING ARGUMENT",
  6: "FINAL COUNTER",
};

export default function ArgumentCard({ turn }) {
  const isFor = turn.side === "for";

  const cardStyle = isFor
    ? {
        background:   "#fdf0e4",
        borderLeft:   "2px solid #c87830",
        borderTop:    "0.5px solid #e8ceb0",
        borderRight:  "0.5px solid #e8ceb0",
        borderBottom: "0.5px solid #e8ceb0",
      }
    : {
        background:   "#c0ddf0",
        borderRight:  "2px solid #2278b8",
        borderTop:    "0.5px solid #90c0e0",
        borderLeft:   "0.5px solid #90c0e0",
        borderBottom: "0.5px solid #90c0e0",
      };

  // FOR:     "◈ OPENING ARGUMENT · TURN 1"
  // AGAINST: "TURN 2 · CHALLENGE ◈"
  const tag = isFor
    ? `◈ ${TURN_LABELS[turn.turnNumber]} · TURN ${turn.turnNumber}`
    : `TURN ${turn.turnNumber} · ${TURN_LABELS[turn.turnNumber]} ◈`;

  return (
    <div className="card-enter" style={{ borderRadius: "6px", padding: "14px 16px", ...cardStyle }}>

      {/* Turn label */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.13em",
          marginBottom: "6px",
          color: isFor ? "#904818" : "#0a4870",
          textAlign: isFor ? "left" : "right",
        }}
      >
        {tag}
      </div>

      {/* Key point quote */}
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontSize: "13px",
          lineHeight: 1.55,
          marginBottom: "10px",
          color: isFor ? "#2a3a4a" : "#0d2a40",
        }}
      >
        "{turn.keyPoint}"
      </div>

      {/* Bullet points */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
        {(turn.bullets || []).map((bullet, i) => (
          <li
            key={i}
            style={{
              fontSize: "12px",
              lineHeight: 1.45,
              paddingLeft: "12px",
              position: "relative",
              color: isFor ? "#5a7090" : "#1a4a6a",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{ position: "absolute", left: 0, color: isFor ? "#c87830" : "#2278b8" }}>›</span>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
