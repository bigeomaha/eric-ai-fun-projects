/**
 * Logo — ARBITER debate engine mark.
 *
 * A geometric "A" where:
 *   - Left leg  = amber (#c87830)  → FOR THE MOTION
 *   - Right leg = blue  (#3a8fc8)  → AGAINST THE MOTION
 *   - Crossbar  = dark  (#1a2a3a)  → the neutral Arbiter
 *   - Apex dot  = dark             → the final verdict / decision point
 *
 * The shape reads instantly as both an "A" (Arbiter) and a balanced
 * scale — two arguments rising to a single point of judgment.
 */
export default function Logo({ size = 36 }) {
  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-label="Arbiter logo"
      role="img"
    >
      {/* Left leg — FOR side, amber */}
      <line
        x1="5"  y1="40"
        x2="22" y2="5"
        stroke="#c87830"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* Right leg — AGAINST side, blue */}
      <line
        x1="39" y1="40"
        x2="22" y2="5"
        stroke="#3a8fc8"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* Crossbar — the Arbiter, neutral, sits slightly above midpoint */}
      <line
        x1="11" y1="26"
        x2="33" y2="26"
        stroke="#1a2a3a"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Apex dot — the verdict / decision */}
      <circle cx="22" cy="5" r="3.2" fill="#1a2a3a" />
    </svg>
  );
}
