/**
 * Ticker — scrolling headline bar beneath the motion input.
 *
 * Dark navy background, orange "LIVE" badge on the left.
 * Scrolls continuously (infinite) — key={headline} remounts
 * the span to restart the animation on each new headline.
 */
export default function Ticker({ headline }) {
  const text = headline || "AWAITING FIRST ARGUMENT…";

  return (
    <div
      style={{
        height: "28px",
        display: "flex",
        alignItems: "center",
        background: "#1a2a3a",
        borderBottom: "0.5px solid #0d1e2e",
        overflow: "hidden",
      }}
    >
      {/* LIVE badge */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.14em",
          padding: "0 14px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#d05a18",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        LIVE
      </div>

      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: "hidden", height: "100%", display: "flex", alignItems: "center" }}>
        <span
          key={text}
          className="ticker-text"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            color: "#a8c8e0",
            letterSpacing: "0.1em",
            paddingLeft: "24px",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
