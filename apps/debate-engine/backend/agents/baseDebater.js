/**
 * BaseDebater — base class for all debate participants.
 *
 * The key architectural difference from Projects 1 & 2:
 * agents here are SEQUENTIAL, not parallel. Each debater receives
 * the full conversation history so they can respond to what was
 * actually said — not just to the original claim in isolation.
 */

import { getProvider } from "../providers/index.js";
import { extractJson } from "../../../../shared/extractJson.js";

const JSON_FORMAT = `
---
RESPONSE FORMAT: You must respond with ONLY a valid JSON object in this exact shape (no markdown, no other text):
{
  "bullets": [
    "First point — up to 35 words, make a specific and substantive argument with real reasoning behind it",
    "Second point — up to 35 words, engage directly with what the other side said if applicable",
    "Third point — up to 35 words, your sharpest attack or defense — leave them with something to answer"
  ],
  "keyPoint": "Your single most memorable line — the one a journalist would quote (max 18 words)"
}

Rules: exactly 3 bullets, each a full and meaningful point — not a vague fragment. No filler phrases like "it is clear that" or "one must consider".`;

export class BaseDebater {
  /**
   * @param {object} config
   * @param {string} config.id           - Unique identifier (e.g. "proposer")
   * @param {string} config.name         - Display name (e.g. "The Proposer")
   * @param {string} config.side         - "for" | "against" | "neutral"
   * @param {string} config.systemPrompt - The debater's core persona and instructions
   */
  constructor({ id, name, side, systemPrompt }) {
    this.id = id;
    this.name = name;
    this.side = side;
    this.systemPrompt = systemPrompt + JSON_FORMAT;
  }

  async respond(claim, history, debaterName = null, personality = null) {
    const provider = getProvider();

    const fullSystemPrompt = personality?.style
      ? `${personality.style}\n\n${this.systemPrompt}`
      : this.systemPrompt;

    const transcript =
      history.length === 0
        ? "No prior turns — this is your opening statement."
        : history
            .map(
              (turn, i) =>
                `Turn ${i + 1} — ${turn.name} (${turn.side === "for" ? "FOR" : "AGAINST"}):\n${turn.bullets.join(" ")}`
            )
            .join("\n\n");

    const nameContext = debaterName
      ? `You are debating under the name "${debaterName}".`
      : "";

    const userMessage = `
${nameContext}
CLAIM BEING DEBATED: "${claim}"

DEBATE TRANSCRIPT SO FAR:
${transcript}

It is now your turn. Respond directly to what has been said — engage with the specific points made, not generic talking points.
    `.trim();

    const raw = await provider.chat(fullSystemPrompt, userMessage);

    let parsed;
    try {
      parsed = extractJson(raw);
    } catch {
      throw new Error(`${this.name} returned invalid JSON: ${raw.slice(0, 200)}`);
    }

    return {
      id: this.id,
      // Use the real human name if provided, otherwise fall back to role name
      name: debaterName || this.name,
      side: this.side,
      bullets: parsed.bullets,
      keyPoint: parsed.keyPoint,
    };
  }
}
