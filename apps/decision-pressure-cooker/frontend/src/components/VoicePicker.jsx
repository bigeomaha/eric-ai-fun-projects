/**
 * VoicePicker — lets users select exactly 5 voices from the catalog.
 * Voices are grouped by category with "select all" quick-fill per group.
 */

import { useMemo } from "react";
import { getIcon, COLOR_HEX, COLOR_CLASSES } from "../data/voiceConfig.js";
import { Check } from "lucide-react";

const CATEGORY_ORDER = ["Family Dinner", "The Friend Group", "The Advisors", "The Elders"];

export default function VoicePicker({ voices, selected, onToggle, onQuickFill }) {
  // Group voices by category
  const grouped = useMemo(() => {
    const map = {};
    for (const cat of CATEGORY_ORDER) map[cat] = [];
    for (const v of voices) {
      if (map[v.category]) map[v.category].push(v);
    }
    return map;
  }, [voices]);

  const count = selected.size;
  const isFull = count >= 5;

  return (
    <div className="w-full max-w-[900px] mx-auto mb-8">
      {/* Counter */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] tracking-[2px] uppercase text-zinc-600 font-bold">
          Build Your Panel
        </h2>
        <div className={`
          font-mono text-xs px-3 py-1 rounded-full border transition-colors
          ${count === 5
            ? "border-green-500/30 bg-green-500/[0.06] text-green-400"
            : "border-zinc-700 bg-zinc-900 text-zinc-400"
          }
        `}>
          {count}/5 selected
        </div>
      </div>

      {/* Category sections */}
      {/* Bottom counter (duplicate) */}
      {CATEGORY_ORDER.map((category) => {
        const categoryVoices = grouped[category] || [];
        if (categoryVoices.length === 0) return null;

        const allSelected = categoryVoices.every((v) => selected.has(v.id));
        const canQuickFill = categoryVoices.length === 5;

        return (
          <div key={category} className="mb-5">
            {/* Category header */}
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[11px] font-semibold text-zinc-500 tracking-wide">
                {category}
              </h3>
              {canQuickFill && (
                <button
                  onClick={() => onQuickFill(categoryVoices.map((v) => v.id))}
                  className={`
                    text-[10px] font-medium px-2.5 py-1 rounded-md border transition-colors
                    ${allSelected
                      ? "border-zinc-700 text-zinc-600 cursor-default"
                      : "border-zinc-700 text-zinc-500 hover:border-orange-500/40 hover:text-orange-400"
                    }
                  `}
                  disabled={allSelected}
                >
                  {allSelected ? "Selected" : "Select group"}
                </button>
              )}
            </div>

            {/* Voice cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {categoryVoices.map((voice) => {
                const isSelected = selected.has(voice.id);
                const isDisabled = isFull && !isSelected;
                const c = COLOR_CLASSES[voice.color] || COLOR_CLASSES.blue;
                const Icon = getIcon(voice.icon);
                const hex = COLOR_HEX[voice.color] || COLOR_HEX.blue;

                return (
                  <button
                    key={voice.id}
                    onClick={() => !isDisabled && onToggle(voice.id)}
                    disabled={isDisabled}
                    className={`
                      relative flex flex-col items-center text-center px-3 py-4 rounded-xl border
                      transition-all duration-200 group
                      ${isDisabled
                        ? "opacity-30 cursor-not-allowed border-[#1c1c20] bg-[#111114]"
                        : isSelected
                          ? `${c.selectedBorder} ${c.glow} bg-[#111114]`
                          : "border-[#1c1c20] bg-[#111114] hover:border-zinc-600 hover:-translate-y-0.5 cursor-pointer"
                      }
                    `}
                  >
                    {/* Checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 ${c.iconBg}`}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: hex }}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Name */}
                    <span className={`text-xs font-bold mb-1 ${isSelected ? c.accent : "text-zinc-300"}`}>
                      {voice.name}
                    </span>

                    {/* Description */}
                    <span className="text-[10px] text-zinc-600 leading-snug">
                      {voice.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Bottom counter */}
      <div className="flex justify-end mt-2">
        <div className={`
          font-mono text-xs px-3 py-1 rounded-full border transition-colors
          ${count === 5
            ? "border-green-500/30 bg-green-500/[0.06] text-green-400"
            : "border-zinc-700 bg-zinc-900 text-zinc-400"
          }
        `}>
          {count}/5 selected
        </div>
      </div>
    </div>
  );
}
