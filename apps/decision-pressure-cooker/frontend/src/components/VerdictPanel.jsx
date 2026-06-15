import { getIcon, COLOR_HEX, COLOR_CLASSES } from "../data/voiceConfig.js";
import { Brain } from "lucide-react";

const CONFIDENCE_LABEL = (n) => {
  if (n >= 85) return "High";
  if (n >= 60) return "Moderate";
  return "Low";
};

function SemicircleGauge({ value }) {
  const dashOffset = 126 - (value / 100) * 126;
  return (
    <svg viewBox="0 0 100 56" className="w-20 h-[46px]">
      <defs>
        <linearGradient id="vgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1c1c20" strokeWidth={7} strokeLinecap="round" />
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#vgGrad)" strokeWidth={7} strokeLinecap="round"
        strokeDasharray={126} strokeDashoffset={dashOffset} />
    </svg>
  );
}

function VerdictView({ synthesis }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <Brain className="w-5 h-5 text-red-200" strokeWidth={1.8} />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-red-600 font-bold">
              Final Verdict
            </div>
            <div className="text-[11px] text-zinc-700 mt-0.5">
              Synthesized from all perspectives
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <SemicircleGauge value={synthesis.confidence} />
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-zinc-50">
              {synthesis.confidence}<span className="text-xs text-zinc-600">%</span>
            </div>
            <div className="text-[9px] text-amber-500 uppercase tracking-[1px] font-semibold">
              {CONFIDENCE_LABEL(synthesis.confidence)}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="text-lg font-bold text-zinc-50 leading-[1.5] mb-4 pb-4 border-b border-[#1c1c20]">
        {synthesis.recommendation}
      </div>

      {/* Rationale */}
      <p className="text-[13px] text-zinc-500 leading-relaxed mb-5">
        {synthesis.rationale}
      </p>

      {/* Tradeoffs */}
      {synthesis.tradeoffs?.length > 0 && (
        <div className="mb-5">
          <h4 className="text-[9px] tracking-[2px] uppercase text-zinc-700 font-bold mb-2">
            Trade-offs to Accept
          </h4>
          <ul className="space-y-1">
            {synthesis.tradeoffs.map((t, i) => (
              <li key={i} className="flex gap-2 text-xs text-zinc-400 leading-relaxed py-1">
                <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-orange-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Flip condition */}
      {synthesis.watchOut && (
        <div className="rounded-[10px] border border-red-500/[0.12] bg-red-500/[0.04] px-4 py-3">
          <div className="font-mono text-[9px] tracking-[2px] uppercase text-red-500 font-bold mb-1.5">
            Flip Condition
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{synthesis.watchOut}</p>
        </div>
      )}

      {/* Dominant voice */}
      {synthesis.dominantPerspective && (
        <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-700 pt-3.5 border-t border-zinc-900">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Dominant voice: <strong className="text-zinc-500 font-semibold">{synthesis.dominantPerspective}</strong>
        </div>
      )}
    </>
  );
}

function AgentDetailView({ agent, onBack }) {
  const c = COLOR_CLASSES[agent.color] || COLOR_CLASSES.blue;
  const Icon = getIcon(agent.icon);
  const hex = COLOR_HEX[agent.color] || COLOR_HEX.blue;

  return (
    <>
      {/* Back button */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-3.5 h-3.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Final Verdict
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${c.iconBg}`}>
            <Icon className="w-6 h-6" style={{ color: hex }} strokeWidth={1.8} />
          </div>
          <div>
            <div className={`font-bold text-base ${c.accent}`}>{agent.name}</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">Confidence: {agent.confidence}%</div>
          </div>
        </div>
        <span className={`font-mono text-[13px] font-bold px-3 py-1 rounded-md border ${c.border} ${c.bg} ${c.accent}`}>
          {agent.confidence}%
        </span>
      </div>

      {/* Angle */}
      <p className="text-sm text-zinc-400 leading-relaxed italic mb-3.5">
        {agent.angle}
      </p>

      {/* Confidence bar */}
      <div className="h-[3px] bg-[#1c1c20] rounded-sm overflow-hidden mb-4">
        <div className={`h-full rounded-sm ${c.bar}`} style={{ width: `${agent.confidence}%` }} />
      </div>

      {/* Points */}
      {agent.points?.length > 0 && (
        <ul className="space-y-0 mb-4">
          {agent.points.map((point, i) => (
            <li key={i} className="flex gap-3 text-[13px] text-zinc-400 leading-relaxed py-2 border-b border-zinc-900 last:border-b-0">
              <span className={`mt-2 shrink-0 w-[5px] h-[5px] rounded-full ${c.bar}`} />
              {point}
            </li>
          ))}
        </ul>
      )}

      {/* Verdict */}
      {agent.verdict && (
        <div className="border-t border-[#1c1c20] pt-3.5">
          <p className="font-mono text-xs text-zinc-500 italic leading-relaxed mb-2.5">
            "{agent.verdict}"
          </p>
          {agent.keyRisk && (
            <div className="flex gap-1.5 text-xs text-zinc-600">
              <span className={`font-bold uppercase text-[10px] tracking-[1px] ${c.accent}`}>Key Risk:</span>
              <span>{agent.keyRisk}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function VerdictPanel({ synthesis, selectedAgent, onBack }) {
  const barColor = selectedAgent
    ? COLOR_HEX[selectedAgent.color] || COLOR_HEX.blue
    : null;

  return (
    <div
      className="verdict-panel bg-[#111114] border border-[#1c1c20] rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden animate-fade-in"
    >
      {/* Left color bar */}
      <div
        className="absolute top-0 left-0 w-[3px] h-full"
        style={{
          background: selectedAgent
            ? barColor
            : "linear-gradient(180deg, #ef4444, #f97316, #f59e0b)",
        }}
      />

      {selectedAgent ? (
        <AgentDetailView agent={selectedAgent} onBack={onBack} />
      ) : (
        <VerdictView synthesis={synthesis} />
      )}
    </div>
  );
}
