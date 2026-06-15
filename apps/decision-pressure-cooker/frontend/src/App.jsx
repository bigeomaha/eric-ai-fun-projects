import { useState, useCallback } from "react";
import DecisionInput from "./components/DecisionInput.jsx";
import AgentCard from "./components/AgentCard.jsx";
import VerdictPanel from "./components/VerdictPanel.jsx";
import RadarChart from "./components/RadarChart.jsx";
import LoadingState from "./components/LoadingState.jsx";
import VoicePicker from "./components/VoicePicker.jsx";
import { useDecisionAnalysis } from "./hooks/useDecisionAnalysis.js";
import { useVoiceCatalog } from "./hooks/useVoiceCatalog.js";

export default function App() {
  const { status, data, error, analyze, reset } = useDecisionAnalysis();
  const { voices, loading: voicesLoading } = useVoiceCatalog();
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(null);
  const [selectedVoices, setSelectedVoices] = useState(new Set());

  const handleToggleVoice = useCallback((id) => {
    setSelectedVoices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 5) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleQuickFill = useCallback((ids) => {
    setSelectedVoices(new Set(ids.slice(0, 5)));
  }, []);

  const handleAnalyze = useCallback(
    (decision) => {
      analyze(decision, Array.from(selectedVoices));
    },
    [analyze, selectedVoices]
  );

  const handleReset = () => {
    setSelectedAgentIndex(null);
    reset();
  };

  const selectedAgent =
    selectedAgentIndex !== null && data?.agents?.[selectedAgentIndex]
      ? data.agents[selectedAgentIndex]
      : null;

  // Build loading voices metadata from catalog + selection
  const loadingVoices = Array.from(selectedVoices)
    .map((id) => voices.find((v) => v.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-0">
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <header className="text-center pt-12 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(234,88,12,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[11px] tracking-[1px] text-orange-500 border border-orange-500/25 bg-orange-500/[0.06] rounded-full px-4 py-1.5 mb-4 font-medium">
            Multi-Agent AI &bull; 20 Voices &bull; 1 Verdict
          </div>
          <h1 className="text-4xl sm:text-[44px] font-black tracking-tight text-zinc-50 leading-tight">
            Decision{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Pressure Cooker
            </span>{" "}
            🔥
          </h1>
          {status !== "success" && (
            <p className="text-[15px] text-zinc-500 max-w-[480px] mx-auto mt-4 leading-relaxed">
              Pick 5 voices to attack your decision from every angle.
              Then a Synthesizer weighs them all and gives you a final verdict.
            </p>
          )}
        </div>
      </header>

      {/* ── Voice Picker + Input form ────────────────────────────────── */}
      {(status === "idle" || status === "error") && (
        <section className="max-w-[900px] mx-auto pb-10">
          {!voicesLoading && voices.length > 0 && (
            <VoicePicker
              voices={voices}
              selected={selectedVoices}
              onToggle={handleToggleVoice}
              onQuickFill={handleQuickFill}
            />
          )}
          <div className="max-w-2xl mx-auto">
            <DecisionInput
              onSubmit={handleAnalyze}
              isLoading={status === "loading"}
              selectedCount={selectedVoices.size}
            />
          </div>
          {error && (
            <div className="mt-4 max-w-2xl mx-auto rounded-xl border border-red-500/30 bg-red-900/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </section>
      )}

      {/* ── Loading state ────────────────────────────────────────────── */}
      {status === "loading" && (
        <LoadingState voices={loadingVoices.length > 0 ? loadingVoices : null} />
      )}

      {/* ── Results ──────────────────────────────────────────────────── */}
      {status === "success" && data && (
        <div className="animate-fade-in">
          {/* Radar + Verdict */}
          <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-0 max-w-[1200px] mx-auto px-0 sm:px-4 min-h-[420px]">
            {/* Left column: question + radar */}
            <div className="flex flex-col py-3">
              {/* Question recap — left-aligned */}
              <div className="mb-4 px-1">
                <p className="text-[10px] tracking-[3px] uppercase text-zinc-600 font-semibold mb-1.5">
                  Analyzing
                </p>
                <p className="text-[13px] text-zinc-300 italic leading-relaxed">
                  "{data.decision}"
                </p>
              </div>
              <div className="flex items-center justify-center flex-1">
                <RadarChart
                  agents={data.agents}
                  synthesisConfidence={data.synthesis.confidence}
                  onSelectAgent={(i) => setSelectedAgentIndex(i)}
                  onSelectVerdict={() => setSelectedAgentIndex(null)}
                  selectedAgentId={selectedAgent?.id}
                />
              </div>
            </div>

            {/* Right column: verdict + reset button */}
            <div className="flex flex-col">
              <VerdictPanel
                synthesis={data.synthesis}
                selectedAgent={selectedAgent}
                onBack={() => setSelectedAgentIndex(null)}
              />
              {/* Reset button */}
              <div className="mt-4">
                <button
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm tracking-wide
                             bg-gradient-to-r from-orange-500 to-red-600 text-white
                             hover:from-orange-400 hover:to-red-500 transition-all
                             shadow-lg shadow-orange-900/30"
                >
                  🔥 Put another decision under pressure
                </button>
              </div>
            </div>
          </div>

          {/* Agent cards row */}
          <div className="max-w-[1200px] mx-auto mt-7 px-0 sm:px-4">
            <h2 className="text-[10px] tracking-[2px] uppercase text-zinc-700 font-bold mb-3.5">
              Your 5 Voices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {data.agents.map((agent, i) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  index={i}
                  isSelected={selectedAgentIndex === i}
                  onClick={() =>
                    setSelectedAgentIndex(selectedAgentIndex === i ? null : i)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="text-center text-zinc-800 text-[11px] pb-8">
        Decision Pressure Cooker &bull; Multi-Agent AI &bull; Provider-Agnostic
      </footer>
    </div>
  );
}
