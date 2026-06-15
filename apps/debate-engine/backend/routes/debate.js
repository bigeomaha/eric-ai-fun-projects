/**
 * POST /api/debate              — register claim, return debateId
 * GET  /api/debate/:id/stream   — SSE stream of the full debate
 *
 * SSE event sequence:
 *   1. { type: "identities", proposer: {name, gender, role}, challenger: {name, gender, role} }
 *   2–5. { type: "turn", turnNumber, label, id, name, side, bullets, keyPoint }
 *        then: { type: "ticker", headline } — after each turn (runs in parallel with 2.5s pause)
 *   6. { type: "verdict", verdictPoints, winner, winnerReason, keyInsight, ... }
 *   7. { type: "done" }
 *
 * Chain architecture:
 *   [roleAssign?] → identities → [2.5s pause] → T1 Proposer → T2 Challenger → … → Arbiter
 *   For group debates, assignGroupRoles runs first so the correct role argues FOR/AGAINST
 *   based on the actual claim, not a hardwired default.
 */

import { Router } from "express";
import { proposer } from "../agents/proposer.js";
import { challenger } from "../agents/challenger.js";
import { adjudicate } from "../agents/arbiter.js";
import { generateDebaterIdentities } from "../agents/identityGenerator.js";
import { generateTickerHeadline } from "../agents/headlineGenerator.js";
import { assignGroupRoles } from "../agents/roleAssigner.js";
import { PERSONALITIES, GROUPS } from "../agents/personalities.js";

const router = Router();

// In-memory session store with 5-minute TTL
const sessions = new Map();
const SESSION_TTL_MS = 5 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function pruneOldSessions() {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.createdAt > SESSION_TTL_MS) sessions.delete(id);
  }
}

// Turn metadata — 3 rounds, 6 turns total
const TURN_META = [
  { label: "Opening Argument" },  // Round 1 — For
  { label: "The Challenge"    },  // Round 1 — Against
  { label: "The Rebuttal"     },  // Round 2 — For
  { label: "Counter-Rebuttal" },  // Round 2 — Against
  { label: "Closing Argument" },  // Round 3 — For
  { label: "Final Counter"    },  // Round 3 — Against
];

// ── POST /api/debate ──────────────────────────────────────────────────────────
router.post("/", (req, res) => {
  const { claim, forPersonalityId, againstPersonalityId, groupId } = req.body;
  if (!claim || typeof claim !== "string" || claim.trim().length < 10) {
    return res.status(400).json({ error: "Please provide a claim with at least 10 characters." });
  }

  pruneOldSessions();

  // For groups: store the groupId raw — role assignment happens in the stream
  // after the AI reads the claim, so we don't hardwire which role argues which side.
  // For individual personalities: resolve immediately from IDs.
  let forPersonality     = null;
  let againstPersonality = null;
  let resolvedGroupId    = null;

  if (groupId && GROUPS[groupId]) {
    resolvedGroupId = groupId;
    console.log(`[debate] Group: ${GROUPS[groupId].label} (roles assigned at stream time)`);
  } else {
    if (forPersonalityId    && PERSONALITIES[forPersonalityId])    forPersonality    = PERSONALITIES[forPersonalityId];
    if (againstPersonalityId && PERSONALITIES[againstPersonalityId]) againstPersonality = PERSONALITIES[againstPersonalityId];
    if (forPersonality || againstPersonality)
      console.log(`[debate] Personalities: ${forPersonality?.label ?? "default"} vs ${againstPersonality?.label ?? "default"}`);
  }

  const debateId = crypto.randomUUID();
  sessions.set(debateId, {
    claim: claim.trim(),
    forPersonality,
    againstPersonality,
    groupId: resolvedGroupId,   // null for individual personality debates
    createdAt: Date.now(),
  });
  console.log(`[debate] New session ${debateId}: "${claim.trim().slice(0, 60)}"`);

  res.json({ debateId });
});

// ── GET /api/debate/:debateId/stream ─────────────────────────────────────────
router.get("/:debateId/stream", async (req, res) => {
  const session = sessions.get(req.params.debateId);
  if (!session) return res.status(404).json({ error: "Session not found or expired." });
  sessions.delete(req.params.debateId);

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const emit = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  let { claim, forPersonality, againstPersonality, groupId } = session;
  const history = [];

  try {
    // ── Step 0a: Assign group roles based on the claim ──────────────────────
    // Groups define two roles, but which argues FOR depends on the topic.
    // A Parent might argue AGAINST "should I get married at 23" — the AI decides.
    if (groupId && GROUPS[groupId]) {
      console.log(`[debate] Assigning group roles for "${groupId}"…`);
      ({ forPersonality, againstPersonality } = await assignGroupRoles(claim, GROUPS[groupId]));
    }

    // ── Step 0b: Generate debater identities ────────────────────────────────
    console.log(`[debate] Generating identities…`);
    const identities = await generateDebaterIdentities(
      claim,
      forPersonality?.nameHint,
      againstPersonality?.nameHint
    );

    // Include the AI-assigned role in the identity so the frontend badge reflects
    // the actual side each role is arguing (which may differ from the group default).
    emit({
      type: "identities",
      proposer:   { ...identities.proposer,   role: forPersonality?.role   ?? null },
      challenger: { ...identities.challenger, role: againstPersonality?.role ?? null },
    });
    console.log(`[debate] Identities: ${identities.proposer.name} (${forPersonality?.role ?? "default"}) vs ${identities.challenger.name} (${againstPersonality?.role ?? "default"})`);

    // Dramatic pause — user sees the debaters before anyone speaks
    await sleep(2500);

    /**
     * runTurn — runs one debate turn and emits the result + ticker headline.
     * The headline generates concurrently with the 2.5s inter-turn pause so
     * the total wait between turns is max(headline_time, 2500ms).
     */
    async function runTurn(agent, debaterName, turnIndex, personality) {
      console.log(`[debate] Turn ${turnIndex + 1} — ${debaterName}${personality ? ` [${personality.label || personality.role}]` : ""}`);
      const turn = await agent.respond(claim, history, debaterName, personality);
      history.push(turn);

      emit({
        type: "turn",
        turnNumber: turnIndex + 1,
        label: TURN_META[turnIndex].label,
        ...turn,
      });

      // Headline + 2.5s pause run in parallel — next turn starts after both finish
      const [headline] = await Promise.all([
        generateTickerHeadline(debaterName, turn.side, turn.keyPoint),
        sleep(2500),
      ]);
      emit({ type: "ticker", headline });
    }

    // ── Turns 1–6: 3 full rounds, sequential chain ───────────────────────────
    await runTurn(proposer,   identities.proposer.name,   0, forPersonality);    // Round 1 — Opening Argument
    await runTurn(challenger, identities.challenger.name, 1, againstPersonality); // Round 1 — The Challenge
    await runTurn(proposer,   identities.proposer.name,   2, forPersonality);    // Round 2 — The Rebuttal
    await runTurn(challenger, identities.challenger.name, 3, againstPersonality); // Round 2 — Counter-Rebuttal
    await runTurn(proposer,   identities.proposer.name,   4, forPersonality);    // Round 3 — Closing Argument
    await runTurn(challenger, identities.challenger.name, 5, againstPersonality); // Round 3 — Final Counter

    // ── Arbiter verdict ───────────────────────────────────────────────────────
    console.log(`[debate] Arbiter deliberating…`);
    const verdict = await adjudicate(claim, history);
    emit({ type: "verdict", ...verdict });

    // Ticker headline for the verdict
    const verdictName =
      verdict.winner === "proposer"   ? identities.proposer.name   :
      verdict.winner === "challenger" ? identities.challenger.name : null;
    const verdictHeadline = await generateTickerHeadline(
      verdictName || "THE ARBITER",
      verdict.winner === "proposer" ? "for" : "against",
      verdict.winner === "tie"
        ? "debate declared a draw by arbiter"
        : `wins the debate — ${verdict.winnerReason}`
    );
    emit({ type: "ticker", headline: verdictHeadline });

    emit({ type: "done" });
    console.log(`[debate] Complete.`);
  } catch (err) {
    console.error(`[debate] Error:`, err.message);
    emit({ type: "error", message: err.message });
  } finally {
    res.end();
  }
});

export default router;
