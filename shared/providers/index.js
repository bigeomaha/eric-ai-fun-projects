import * as anthropic from "./anthropic.js";
import * as openai from "./openai.js";
import * as openrouter from "./openrouter.js";

const PROVIDERS = {
  anthropic,
  openai,
  openrouter,
};

export function getProvider() {
  const name = (process.env.AI_PROVIDER || "openrouter").toLowerCase();
  const provider = PROVIDERS[name];

  if (!provider) {
    throw new Error(
      `Unknown AI_PROVIDER "${name}". Valid options: ${Object.keys(PROVIDERS).join(", ")}`
    );
  }

  return provider;
}
