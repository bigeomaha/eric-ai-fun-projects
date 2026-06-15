/**
 * BaseAgent — each persona extends this.
 * The `translate(phrase)` method rewrites the input in the persona's voice
 * and returns structured JSON the frontend renders directly.
 */

import { getProvider } from "../providers/index.js";
import { extractJson } from "../../../../shared/extractJson.js";

const JSON_FORMAT = `
---
RESPONSE FORMAT: You must respond with ONLY a valid JSON object in this exact shape (no markdown, no other text):
{
  "rewrite": "The full rewritten phrase in your voice",
  "signature": "A short in-character internal thought, aside, or sign-off (1 sentence max)"
}`;

export class BaseAgent {
  constructor({ id, name, emoji, age, title, color, systemPrompt }) {
    this.id = id;
    this.name = name;
    this.emoji = emoji;
    this.age = age;
    this.title = title;
    this.color = color;
    this.systemPrompt = systemPrompt + JSON_FORMAT;
  }

  async translate(phrase) {
    const provider = getProvider();

    const userMessage = `
Rewrite the following phrase EXACTLY in your voice. Stay completely in character — voice, vocabulary, punctuation, length, and tone must all match.

ORIGINAL PHRASE:
"${phrase}"
    `.trim();

    const raw = await provider.chat(this.systemPrompt, userMessage);

    let parsed;
    try {
      parsed = extractJson(raw);
    } catch {
      // Graceful fallback — still show something
      parsed = {
        rewrite: raw.slice(0, 400),
        signature: "⚠️ Parse hiccup — raw response shown",
      };
    }

    return {
      id: this.id,
      name: this.name,
      emoji: this.emoji,
      age: this.age,
      title: this.title,
      color: this.color,
      ...parsed,
    };
  }
}
