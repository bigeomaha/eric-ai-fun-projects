/**
 * Synthesizer agent.
 * Reads all perspective agent results and produces a final verdict:
 * recommendation, confidence score, key trade-offs, and a watch-out.
 */

import { getProvider } from "../providers/index.js";
import { extractJson } from "../../../../shared/extractJson.js";

const SYSTEM_PROMPT = `You are the Synthesizer — a senior decision strategist who has just received
input from multiple specialized analysts. Your job is to weigh their perspectives and
deliver a clear, actionable final recommendation.

Your approach:
- You do not average opinions — you weigh them by relevance and strength of argument
- You identify where perspectives agree (signal) vs. where they conflict (noise to resolve)
- You produce a recommendation that a real person can act on, not a hedge
- Your confidence score reflects genuine epistemic state — not false certainty or false modesty
- You are the last word. Make it count.

---
RESPONSE FORMAT: You must respond with ONLY a valid JSON object in this exact shape (no markdown, no other text):
{
  "recommendation": "Your clear, direct recommendation — do it / don't do it / do it with conditions",
  "rationale": "2-3 sentences explaining the weight of evidence that drove your recommendation",
  "confidence": <integer 0-100>,
  "tradeoffs": [
    "Key trade-off 1 the decision-maker must consciously accept",
    "Key trade-off 2",
    "Key trade-off 3"
  ],
  "watchOut": "The single most important thing that could flip this recommendation if circumstances change",
  "dominantPerspective": "<id of the agent whose view was most decisive>"
}`;

/**
 * @param {string} decision - The original decision
 * @param {AgentResult[]} agentResults - The 5 perspective outputs
 * @returns {Promise<SynthesisResult>}
 */
export async function synthesize(decision, agentResults) {
  const provider = getProvider();

  const perspectivesText = agentResults
    .map(
      (r) =>
        `=== ${r.name} (${r.id}) ===
Angle: ${r.angle}
Points:
${r.points.map((p) => `  - ${p}`).join("\n")}
Verdict: ${r.verdict}
Key Risk: ${r.keyRisk}
Confidence this perspective applies: ${r.confidence}/100`
    )
    .join("\n\n");

  const userMessage = `
DECISION TO ANALYZE:
${decision}

${agentResults.length} ANALYST PERSPECTIVES:
${perspectivesText}
  `.trim();

  const raw = await provider.chat(SYSTEM_PROMPT, userMessage);

  let parsed;
  try {
    parsed = extractJson(raw);
  } catch {
    throw new Error(`Synthesizer returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  return parsed;
}
