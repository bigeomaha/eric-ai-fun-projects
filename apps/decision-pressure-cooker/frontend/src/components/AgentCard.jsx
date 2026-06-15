import { getIcon, COLOR_HEX, COLOR_CLASSES } from "../data/voiceConfig.js";

export default function AgentCard({ agent, isSelected, onClick, index }) {
  const c = COLOR_CLASSES[agent.color] || COLOR_CLASSES.blue;
  const Icon = getIcon(agent.icon);
  const hex = COLOR_HEX[agent.color] || COLOR_HEX.blue;

  return (
    <div
      onClick={onClick}
      className={`
        agent-card bg-[#111114] border rounded-xl px-4 py-[18px] relative overflow-hidden cursor-pointer
        transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-lg
        animate-slide-up
        ${isSelected ? `${c.selectedBorder} ${c.glow}` : "border-[#1c1c20]"}
      `}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      {/* Left color bar */}
      <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: hex }} />

      {/* Header */}
      <div className="flex justify-between items-start mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center ${c.iconBg}`}>
            <Icon className="w-4 h-4" style={{ color: hex }} strokeWidth={1.8} />
          </div>
          <span className={`font-bold text-xs ${c.accent}`}>{agent.name}</span>
        </div>
        <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${c.border} ${c.bg} ${c.accent}`}>
          {agent.confidence}%
        </span>
      </div>

      {/* Confidence bar */}
      <div className="h-[2px] bg-[#1c1c20] rounded-sm overflow-hidden mb-2.5">
        <div className={`h-full rounded-sm ${c.bar}`} style={{ width: `${agent.confidence}%` }} />
      </div>

      {/* Angle (clamped to 3 lines) */}
      <p className="text-[11px] text-zinc-400 leading-snug mb-3 line-clamp-3">
        {agent.angle}
      </p>

      {/* Verdict (clamped to 2 lines) */}
      {agent.verdict && (
        <div className="pt-2.5 border-t border-zinc-900">
          <p className="font-mono text-[10px] text-zinc-600 italic leading-snug line-clamp-2">
            "{agent.verdict}"
          </p>
        </div>
      )}
    </div>
  );
}
