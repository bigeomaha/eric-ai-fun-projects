/**
 * LoadingGrid — paper-themed pulsing memo skeletons shown while agents run.
 * Mirrors the results layout: 2×2 front page + 3-col staff dispatches.
 */

const FRONT_PAGE = [
  { hex: "#4338CA", label: "Christopher V.", role: "Chief Executive Officer" },
  { hex: "#DC2626", label: "Marcus T.",      role: "Chief Operating Officer" },
  { hex: "#2563EB", label: "Deborah K.",     role: "HR Business Partner" },
  { hex: "#16A34A", label: "Tyler B.",       role: "Chief of Staff Intern, Office of the COO" },
];

const DISPATCHES = [
  { hex: "#6B7280", label: "Janet W.",   role: "Executive Assistant to All Executives" },
  { hex: "#059669", label: "Richard H.", role: "General Counsel" },
  { hex: "#7C3AED", label: "Sandra M.",  role: "Senior Manager, Team Cohesion" },
  { hex: "#DB2777", label: "Amber G.",   role: "Chief Wellness Officer", fullWidth: true },
];

function SectionRule({ left, right }) {
  return (
    <div style={{
      background: "#C8BFA8",
      borderTop: "1px solid #A89880", borderBottom: "1px solid #A89880",
      padding: "5px 10px", marginBottom: "12px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{ fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#2C2416", fontFamily: "Georgia, serif", fontWeight: "600" }}>
        {left}
      </span>
      {right && (
        <span style={{ fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#2C2416", fontFamily: "Georgia, serif", fontWeight: "600" }}>
          {right}
        </span>
      )}
    </div>
  );
}

function SkeletonCard({ hex, delay, fullWidth }) {
  return (
    <div
      className="animate-pulse"
      style={{
        gridColumn: fullWidth ? "1 / -1" : undefined,
        border: "0.5px solid #C4B99A", borderRadius: "12px",
        overflow: "hidden", background: "#FDF8F0",
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ height: "4px", background: hex, opacity: 0.35 }} />
      <div style={{ padding: "10px 12px 10px", borderBottom: "0.5px solid #E0D9CC" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E0D9CC", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: "10px", background: "#E0D9CC", borderRadius: "4px", width: "55%", marginBottom: "5px" }} />
            <div style={{ height: "8px",  background: "#EDE8DC", borderRadius: "4px", width: "75%" }} />
          </div>
        </div>
        <div style={{ marginTop: "8px", borderTop: "0.5px solid #E0D9CC", paddingTop: "6px" }}>
          <div style={{ height: "8px", background: "#E0D9CC", borderRadius: "4px", width: "80%" }} />
        </div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ height: "9px", background: "#E0D9CC", borderRadius: "4px", marginBottom: "5px" }} />
        <div style={{ height: "9px", background: "#EDE8DC", borderRadius: "4px", width: "90%", marginBottom: "5px" }} />
        <div style={{ height: "9px", background: "#EDE8DC", borderRadius: "4px", width: "60%" }} />
      </div>
      <div style={{ padding: "7px 12px", background: "#F0E8D8", borderTop: "0.5px solid #D6CDB8" }}>
        <div style={{ height: "14px", background: "#D6CDB8", borderRadius: "2px", width: "80px" }} />
      </div>
    </div>
  );
}

export default function LoadingGrid() {
  return (
    <div style={{ width: "100%", paddingBottom: "2rem" }} className="animate-fade-in">
      <p style={{
        textAlign: "center", color: "#7A6A52",
        fontSize: "15px", fontFamily: "Georgia, serif", fontStyle: "italic",
        marginBottom: "16px",
      }}>
        Routing to all 8 departments simultaneously…
      </p>

      <SectionRule left="Front page — awaiting response" right="All Departments" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "10px" }}>
        {FRONT_PAGE.map((p, i) => (
          <SkeletonCard key={p.label} hex={p.hex} delay={i * 80} />
        ))}
      </div>

      <SectionRule left="Staff dispatches — awaiting response" right="Internal Only" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {DISPATCHES.map((p, i) => (
          <SkeletonCard key={p.label} hex={p.hex} delay={(i + 4) * 80} fullWidth={p.fullWidth} />
        ))}
      </div>

      <p style={{ textAlign: "center", color: "#A8957A", fontSize: "13px", marginTop: "16px", fontFamily: "system-ui, sans-serif" }}>
        Usually takes 10–15 seconds
      </p>
    </div>
  );
}
