/**
 * Identity Generator — names and genders for both debaters.
 * Called once before the debate starts. Result is streamed to the
 * frontend immediately so avatars and nameplates appear right away.
 *
 * Accepts optional nameHints so the AI picks names that fit the
 * selected personality archetype (e.g. a grandparent gets an older name,
 * a startup founder gets a younger one).
 */

import { getProvider } from "../providers/index.js";
import { extractJson } from "../../../../shared/extractJson.js";

const SYSTEM =
  "You assign realistic human names and genders to debate participants. Return only valid JSON, no markdown.\n\n---\nRESPONSE FORMAT: You must respond with ONLY a valid JSON object in this exact shape (no other text):\n{\n  \"proposer\":   { \"name\": \"First Last\", \"gender\": \"male\" },\n  \"challenger\": { \"name\": \"First Last\", \"gender\": \"female\" }\n}";

/**
 * @param {string} claim          - The claim being debated
 * @param {string} forNameHint    - Description of the FOR debater's archetype
 * @param {string} againstNameHint - Description of the AGAINST debater's archetype
 * @returns {Promise<{ proposer: { name, gender }, challenger: { name, gender } }>}
 */
export async function generateDebaterIdentities(claim, forNameHint, againstNameHint) {
  const provider = getProvider();

  const forHint    = forNameHint    || "a professional with relevant expertise";
  const againstHint = againstNameHint || "a professional with relevant expertise";

  const prompt = `A formal debate is beginning on this claim: "${claim}"

Assign one realistic human name to each debater. The name should feel authentic to their background.

FOR THE MOTION debater — they are ${forHint}. Pick a name that fits this person naturally.
AGAINST THE MOTION debater — they are ${againstHint}. Pick a name that fits this person naturally.

Rules:
- Use varied nationalities and backgrounds — do not default to Anglo-American names
- Do NOT always make the FOR side male
- Names should feel like real people, not archetypes (no "Professor Smith" or "General Johnson")`;

  const raw = await provider.chat(SYSTEM, prompt);
  return extractJson(raw);
}
