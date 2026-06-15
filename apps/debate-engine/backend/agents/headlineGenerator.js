/**
 * Headline Generator — produces a 5-6 word all-caps ticker headline
 * after each debate turn. Fast, cheap call. Output is a raw string (no JSON).
 */

import { getProvider } from "../providers/index.js";

const SYSTEM =
  "You write punchy 5-6 word ALL CAPS news ticker headlines for a live debate broadcast. Return ONLY the headline text — no quotes, no punctuation at the end, no explanation.";

/**
 * @param {string} debaterName - e.g. "Marcus Webb"
 * @param {"for"|"against"} side
 * @param {string} keyPoint - the debater's headline quote
 * @returns {Promise<string>} e.g. "WEBB EXPOSES FATAL MARKET ASSUMPTION"
 */
export async function generateTickerHeadline(debaterName, side, keyPoint) {
  const provider = getProvider();

  const lastName = debaterName.split(" ").pop().toUpperCase();
  const sideTag  = side === "for" ? "ARGUING FOR" : "ARGUING AGAINST";

  const prompt = `Debate moment:
- Speaker: ${debaterName} (${sideTag})
- Key point: "${keyPoint}"

Write a 5-6 word punchy ticker headline. Use the speaker's last name (${lastName}).
Examples: "${lastName} EXPOSES FATAL MARKET ASSUMPTION" / "${lastName} DELIVERS KNOCKOUT STAT" / "${lastName} PIVOTS ON CORE CLAIM"`;

  const raw = await provider.chat(SYSTEM, prompt, null, 40); // low token limit for speed
  return raw.trim().toUpperCase().replace(/['".,!?]/g, "").slice(0, 72);
}
