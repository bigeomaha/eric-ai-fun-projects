import OpenAI from "openai";

const DEFAULT_MODEL = "openrouter/auto";

export async function chat(systemPrompt, userMessage, model) {
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.AI_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "https://ai-projects.lackore.me",
      "X-Title": "AI Projects",
    },
  });

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
