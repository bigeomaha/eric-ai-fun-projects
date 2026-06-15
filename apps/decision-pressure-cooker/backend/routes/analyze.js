/**
 * POST /api/analyze
 * Accepts a decision + optional voice selection.
 * Runs the selected agents in parallel, then the synthesizer.
 */

import { Router } from "express";
import { VOICE_REGISTRY } from "../agents/voiceRegistry.js";
import { devilsAdvocate } from "../agents/devilsAdvocate.js";
import { optimist } from "../agents/optimist.js";
import { pessimist } from "../agents/pessimist.js";
import { pragmatist } from "../agents/pragmatist.js";
import { wildcard } from "../agents/wildcard.js";
import { synthesize } from "../agents/synthesizer.js";

const router = Router();

// Legacy fallback agents
const LEGACY_AGENTS = [devilsAdvocate, optimist, pessimist, pragmatist, wildcard];

router.post("/", async (req, res) => {
  const { decision, voices } = req.body;

  // Validate decision
  if (!decision || typeof decision !== "string" || decision.trim().length < 10) {
    return res.status(400).json({
      error: "Please provide a decision with at least 10 characters.",
    });
  }

  const trimmedDecision = decision.trim();

  // Resolve agents — from voice selection or legacy fallback
  let agents;

  if (voices && Array.isArray(voices) && voices.length > 0) {
    // Validate voice IDs
    const invalid = voices.filter((id) => !VOICE_REGISTRY[id]);
    if (invalid.length > 0) {
      return res.status(400).json({
        error: `Unknown voice(s): ${invalid.join(", ")}`,
      });
    }
    if (voices.length !== 5) {
      return res.status(400).json({
        error: "Please select exactly 5 voices.",
      });
    }
    agents = voices.map((id) => VOICE_REGISTRY[id]);
  } else {
    agents = LEGACY_AGENTS;
  }

  try {
    // ── Phase 1: Run all agents in parallel ─────────────────────────────────
    console.log(`[analyze] Running ${agents.length} agents in parallel...`);

    const agentResults = await Promise.all(
      agents.map((agent) =>
        agent.analyze(trimmedDecision).catch((err) => ({
          id: agent.id,
          name: agent.name,
          emoji: agent.emoji,
          icon: agent.icon,
          color: agent.color,
          error: err.message,
          angle: "Analysis failed",
          points: [],
          confidence: 0,
          verdict: "This agent encountered an error.",
          keyRisk: "N/A",
        }))
      )
    );

    console.log(`[analyze] All agents complete. Running synthesizer...`);

    // ── Phase 2: Synthesize ──────────────────────────────────────────────────
    const synthesis = await synthesize(trimmedDecision, agentResults);

    console.log(`[analyze] Synthesis complete. Sending response.`);

    res.json({
      decision: trimmedDecision,
      agents: agentResults,
      synthesis,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[analyze] Fatal error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
