import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-4o";

export async function chat(systemPrompt, userMessage, model) {
  const client = new OpenAI({ apiKey: process.env.AI_API_KEY });

  const response = await client.chat.completions.create({
    model: model || process.env.AI_MODEL || DEFAULT_MODEL,
    max_tokens: 1024,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0].message.content;
}
