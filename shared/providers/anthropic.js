import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-4-6";

export async function chat(systemPrompt, userMessage, model) {
  const client = new Anthropic({ apiKey: process.env.AI_API_KEY });

  const response = await client.messages.create({
    model: model || process.env.AI_MODEL || DEFAULT_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return response.content[0].text;
}
