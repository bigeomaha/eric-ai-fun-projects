/**
 * VerdictCard — Arbiter's final ruling.
 *
 * Dark navy background (#2a5878), score grid with real debater names,
 * decisive factor text. Simpler than previous version — no key-insight box.
 */
const WINNER_LABELS = {
  proposer:   { text: "FOR WINS",     style: { background: "#0a3018", border: "0.5px solid #28a050", color: "#60d890" } },
  challenger: { text: "AGAINST WINS", style: { background: "#4a1010", border: "0.5px solid #c83030", color: "#f08080" } },
  tie:        { text: "A DRAW",       style: { background: "#1a2a3a", border: "0.5px solid #3a8fc8", color: "#78c8f0" } },
};

export default function VerdictCard({ verdict, debaters }) {
  const winner = WINNER_LABELS[verdict.winner] || WINNER_LABELS.tie;

  return (
    <div
      style={{
        background: "#2a5878",
        borderTop: "1px solid #5a8ab0",
        padding: "18px 24px",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.14em", color: "#a8d8f8" }}>
          ⊕ ARBITER'S RULING
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.12em",
            padding: "4px 12px",
            borderRadius: "4px",
            ...winner.style,
          }}
        >
          {winner.text}
        </span>
      </div>

      {/* Score grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "12px" }}>
        <ScoreBar
          label={debaters?.proposer?.name || "Proposer"}
          score={verdict.proposerScore}
          barColor="#c87830"
        />
        <ScoreBar
          label={debaters?.challenger?.name || "Challenger"}
          score={verdict.challengerScore}
          barColor="#7ad0f0"
        />
      </div>

      {/* Decisive factor */}
      <p style={{ fontSize: "12px", lineHeight: 1.65, color: "#90c0d8", fontFamily: "'DM Sans', sans-serif" }}>
        <strong style={{ color: "#e8f4fc", fontWeight: 500 }}>Decisive factor: </strong>
        {verdict.winnerReason}
      </p>
    </div>
  );
}

function ScoreBar({ label, score, barColor }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          color: "#78aac8",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#b8d8f0", fontWeight: 500 }}>{score}</span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", background: "#1a3a54", overflow: "hidden" }}>
        <div
          className="score-bar"
          style={{ height: "100%", borderRadius: "2px", width: `${score}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
