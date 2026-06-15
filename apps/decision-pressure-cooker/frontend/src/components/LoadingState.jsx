/**
 * LoadingState — shown while agents + synthesizer are running.
 * Accepts optional `voices` prop with selected voice metadata.
 */

import { getIcon, COLOR_HEX, COLOR_CLASSES } from "../data/voiceConfig.js";

const FALLBACK_AGENTS = [
  { icon: "ShieldHeart", name: "Voice 1", color: "red" },
  { icon: "Hammer", name: "Voice 2", color: "blue" },
  { icon: "HeartHandshake", name: "Voice 3", color: "green" },
  { icon: "Glasses", name: "Voice 4", color: "amber" },
  { icon: "Swords", name: "Voice 5", color: "purple" },
];

export default function LoadingState({ voices }) {
  const agents = voices && voices.length > 0 ? voices : FALLBACK_AGENTS;

  return (
    <div className="w-full py-8 animate-fade-in">
      <p className="text-center text-gray-400 text-sm mb-6">
        Consulting your {agents.length} voices in parallel…
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-[900px] mx-auto">
        {agents.map((agent, i) => {
          const Icon = getIcon(agent.icon);
          const hex = COLOR_HEX[agent.color] || COLOR_HEX.blue;
          const c = COLOR_CLASSES[agent.color] || COLOR_CLASSES.blue;

          return (
            <div
              key={agent.name}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800
                         bg-gray-900 px-4 py-5 animate-pulse2"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.iconBg}`}>
                <Icon className="w-5 h-5" style={{ color: hex }} strokeWidth={1.8} />
              </div>
              <div className={`w-8 h-1 rounded-full ${c.bar} opacity-60`} />
              <span className="text-xs text-gray-500 text-center">{agent.name}</span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-gray-600 text-xs mt-6">
        This usually takes 10–20 seconds
      </p>
    </div>
  );
}
