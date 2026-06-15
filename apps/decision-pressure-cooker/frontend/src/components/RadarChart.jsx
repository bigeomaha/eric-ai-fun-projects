/**
 * RadarChart — dynamic N-gon radar/spider chart.
 * Computes vertex angles from the agents array length (works for any N).
 */

import { useMemo } from "react";
import { COLOR_HEX } from "../data/voiceConfig.js";

const CX = 200, CY = 200, MAX_R = 150;

function polarToXY(angleDeg, r) {
  const rad = (angleDeg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function ngonPoints(angles, r) {
  return angles.map((a) => polarToXY(a, r).join(",")).join(" ");
}

/** Determine text-anchor based on angle quadrant */
function labelAnchor(angleDeg) {
  const norm = ((angleDeg % 360) + 360) % 360; // normalize to 0–360
  if (norm > 350 || norm < 10) return "start";   // right
  if (norm > 170 && norm < 190) return "end";     // left
  if (norm >= 80 && norm <= 100) return "middle";  // bottom
  if (norm >= 260 && norm <= 280) return "middle"; // top
  if (norm >= 10 && norm < 170) return "start";    // right half
  return "end";                                     // left half
}

/** Offset labels away from the polygon edge */
function labelOffset(angleDeg) {
  const norm = ((angleDeg % 360) + 360) % 360;
  // top
  if (norm >= 250 && norm <= 290) return [0, -20];
  // bottom
  if (norm >= 70 && norm <= 110) return [0, 22];
  // right half
  if (norm < 70 || norm > 290) return [18, 4];
  // left half
  return [-20, 4];
}

export default function RadarChart({
  agents,
  synthesisConfidence,
  onSelectAgent,
  onSelectVerdict,
  selectedAgentId,
}) {
  const n = agents.length;

  // Compute angles: evenly spaced, starting at top (-90°)
  const angles = useMemo(
    () => agents.map((_, i) => (i / n) * 360 - 90),
    [n]
  );

  // Build meta from agents + computed angles
  const agentsMeta = useMemo(
    () =>
      agents.map((a, i) => ({
        label: a.name,
        color: COLOR_HEX[a.color] || COLOR_HEX.blue,
        angle: angles[i],
      })),
    [agents, angles]
  );

  // Data points (confidence-scaled)
  const dataPoints = useMemo(
    () =>
      agents.map((agent, i) => {
        const r = (agent.confidence / 100) * MAX_R;
        return polarToXY(angles[i], r);
      }),
    [agents, angles]
  );

  const polygonStr = dataPoints.map((p) => p.join(",")).join(" ");

  const outerPoints = angles.map((a) => polarToXY(a, MAX_R));
  const labelPositions = agentsMeta.map((m) => {
    const [dx, dy] = labelOffset(m.angle);
    const [x, y] = polarToXY(m.angle, MAX_R);
    return [x + dx, y + dy];
  });

  return (
    <div className="radar-container">
      <svg viewBox="-60 -10 520 420" className="w-full h-full">
        {/* Grid N-gons */}
        <polygon points={ngonPoints(angles, MAX_R * 0.25)} className="radar-grid" />
        <polygon points={ngonPoints(angles, MAX_R * 0.5)} className="radar-grid-dashed" />
        <polygon points={ngonPoints(angles, MAX_R * 0.75)} className="radar-grid" />
        <polygon points={ngonPoints(angles, MAX_R)} className="radar-grid" />

        {/* Axis lines */}
        {outerPoints.map(([x, y], i) => (
          <line key={i} x1={CX} y1={CY} x2={x} y2={y} className="radar-axis" />
        ))}

        {/* Confidence polygon */}
        <polygon points={polygonStr} className="radar-polygon" />

        {/* Data points */}
        {dataPoints.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={5}
            fill={agentsMeta[i].color}
            stroke="#0a0a0f"
            strokeWidth={2}
            className="radar-point"
            style={{ filter: `drop-shadow(0 0 4px ${agentsMeta[i].color}80)` }}
            onClick={() => onSelectAgent(i)}
          />
        ))}

        {/* Clickable labels */}
        {agentsMeta.map((meta, i) => {
          const [lx, ly] = labelPositions[i];
          const anchor = labelAnchor(meta.angle);
          const isSelected = agents[i]?.id === selectedAgentId;
          return (
            <g
              key={i}
              className="radar-label-group"
              onClick={() => onSelectAgent(i)}
              style={{ cursor: "pointer" }}
            >
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                fill={meta.color}
                className="radar-label"
                style={{ opacity: isSelected ? 1 : 0.85 }}
              >
                {meta.label}
              </text>
              <text
                x={lx}
                y={ly + 12}
                textAnchor={anchor}
                fill="#52525b"
                className="radar-label-pct"
              >
                {agents[i]?.confidence ?? 0}%
              </text>
            </g>
          );
        })}

        {/* Center — clickable, returns to verdict */}
        <g
          onClick={onSelectVerdict}
          className="radar-center-group"
          style={{ cursor: "pointer" }}
        >
          <circle cx={CX} cy={CY} r={42} fill="transparent" />
          <text
            x={CX - 7}
            y={CY + 5}
            textAnchor="middle"
            className="radar-center-number"
          >
            {synthesisConfidence}
          </text>
          <text
            x={CX + 18}
            y={CY + 5}
            textAnchor="start"
            className="radar-center-pct"
          >
            %
          </text>
          <text
            x={CX}
            y={CY + 22}
            textAnchor="middle"
            className="radar-center-label"
          >
            Final Verdict
          </text>
        </g>
      </svg>
    </div>
  );
}
