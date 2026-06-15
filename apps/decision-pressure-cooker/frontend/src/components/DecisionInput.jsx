/**
 * DecisionInput — the main form where users describe their decision.
 */

import { useState } from "react";

const EXAMPLES = [
  "Should I leave my stable corporate job to start my own company?",
  "Should I relocate to a new city for a higher-paying job offer?",
  "Should I go back to school for a graduate degree while working full-time?",
  "Should I invest my savings into a friend's startup?",
];

export default function DecisionInput({ onSubmit, isLoading, selectedCount = 5 }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim().length >= 10 && !isLoading && selectedCount === 5) {
      onSubmit(value.trim());
    }
  };

  const fillExample = (example) => {
    setValue(example);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe the decision you're wrestling with…"
          rows={4}
          disabled={isLoading}
          className="w-full resize-none rounded-2xl border border-gray-700 bg-gray-900 px-5 py-4
                     text-gray-100 placeholder-gray-500 text-base leading-relaxed
                     focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/60
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <div className="absolute bottom-3 right-4 text-xs text-gray-600">
          {value.length} chars
        </div>
      </div>

      {/* Example prompts */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-600 self-center mr-1">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => fillExample(ex)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-400
                       hover:border-orange-500/50 hover:text-orange-400 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {ex.length > 45 ? ex.slice(0, 44) + "…" : ex}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={value.trim().length < 10 || isLoading || selectedCount !== 5}
        className="w-full py-4 rounded-2xl font-semibold text-base tracking-wide
                   bg-gradient-to-r from-orange-500 to-red-600 text-white
                   hover:from-orange-400 hover:to-red-500 transition-all
                   disabled:opacity-40 disabled:cursor-not-allowed
                   shadow-lg shadow-orange-900/30"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner /> Running your panel…
          </span>
        ) : (
          "🔥 Put it under pressure"
        )}
      </button>
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
