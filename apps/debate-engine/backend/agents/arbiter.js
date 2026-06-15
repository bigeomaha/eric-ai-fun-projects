/**
 * The Arbiter — neutral judge who delivers the final ruling.
 * Receives the full 4-turn transcript and assesses who made stronger arguments.
 */

import { getProvider } from "../providers/index.js";
import { extractJson } from "../../../../shared/extractJson.js";

const SYSTEM_PROMPT = `You are The Arbiter — a neutral, intellectually rigorous debate judge. You have no stake in the outcome. Your job is to evaluate the quality of arguments made, not your personal view on the claim.

Assess:
- Who was more specific and concrete vs vague and generic?
- Who engaged with the actual points made vs talked past the other side?
- Who introduced stronger evidence, logic, or examples?
- Who landed more damaging blows?

Be honest. If one side clearly won, say so. If it was close, explain why. Your verdict should be something a thinking person reads and says "yes, that's a fair call."

---
RESPONSE FORMAT: You must respond with ONLY a valid JSON object in this exact shape (no markdown, no other text):
{
  "verdictPoints": [
    "One crisp observation about how the debate unfolded — max 20 words",
    "Who had the stronger evidence or logic, and why — max 20 words",
    "What ultimately decided it — max 20 words"
  ],
  "winner": "proposer" | "challenger" | "tie",
  "winnerReason": "The single most decisive reason — max 15 words",
  "keyInsight": "The most interesting thing the debate revealed — max 20 words",
  "proposerScore": <integer 0-100>,
  "challengerScore": <integer 0-100>
}

Scores reflect argument quality — they don't have to add to 100.`;

/**
 * Adjudicate the full debate transcript.
 *
 * @param {string} claim   - The original claim
 * @param {Array}  history - All 4 debate turns
 * @returns {Promise<ArbiterVerdict>}
 */
export async function adjudicate(claim, history) {
  const provider = getProvider();

  const transcript = history
    .map(
      (turn, i) =>
        `Turn ${i + 1} — ${turn.name} (${turn.side === "for" ? "FOR the claim" : "AGAINST the claim"}):\n${turn.bullets.join(" ")}`
    )
    .join("\n\n---\n\n");

  const userMessage = `
CLAIM: "${claim}"

FULL DEBATE TRANSCRIPT:
${transcript}

You have read the complete debate. Now deliver your ruling.
  `.trim();

  const raw = await provider.chat(SYSTEM_PROMPT, userMessage);

  let parsed;
  try {
    parsed = extractJson(raw);
  } catch {
    throw new Error(`Arbiter returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  return parsed;
}
