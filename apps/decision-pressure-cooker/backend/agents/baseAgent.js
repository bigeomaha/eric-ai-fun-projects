/**
 * Base agent class.
 * Each perspective agent extends this and provides its own SYSTEM_PROMPT.
 * The `analyze` method sends the decision to the AI and parses the response.
 */

import { getProvider } from "../providers/index.js";
import { extractJson } from "../../../../shared/extractJson.js";

const JSON_FORMAT = `
---
RESPONSE FORMAT: You must respond with ONLY a valid JSON object in this exact shape (no markdown, no other text):
{
  "angle": "One-line description of your core perspective on this decision",
  "points": [
    "Point 1 — be specific, direct, and non-generic",
    "Point 2",
    "Point 3",
    "Point 4"
  ],
  "confidence": <integer 0-100 representing how strongly your perspective applies here>,
  "verdict": "Your single-sentence verdict or warning for the decision-maker",
  "keyRisk": "The one thing from your perspective they absolutely must not ignore"
}`;

export class BaseAgent {
  constructor({ id, name, emoji, icon, color, category, description, systemPrompt }) {
    this.id = id;
    this.name = name;
    this.emoji = emoji || null;
    this.icon = icon || null;
    this.color = color;
    this.category = category || null;
    this.description = description || null;
    this.systemPrompt = systemPrompt + JSON_FORMAT;
  }

  async analyze(decision) {
    const provider = getProvider();

    const userMessage = `
DECISION TO ANALYZE:
${decision}
    `.trim();

    const raw = await provider.chat(this.systemPrompt, userMessage);

    let parsed;
    try {
      parsed = extractJson(raw);
    } catch {
      throw new Error(`Agent "${this.name}" returned invalid JSON: ${raw.slice(0, 200)}`);
    }

    return {
      id: this.id,
      name: this.name,
      emoji: this.emoji,
      icon: this.icon,
      color: this.color,
      ...parsed,
    };
  }
}
