# AI Projects

A monorepo of multi-agent AI experiments — three independent apps served from a single Express instance.

- **Decision Pressure Cooker** 🔥 — five agents attack your decision in parallel, one synthesizer delivers the verdict
- **The Debate Engine** ⚖️ — two AI debaters go head-to-head across 3 rounds, an arbiter declares the winner
- **How Would They Say It?** 🎭 — eight personas rewrite any phrase in their unique voice

All three share a provider-agnostic AI layer (Anthropic, OpenAI, or OpenRouter), a common `extractJson` utility for resilient response parsing, and a unified test suite.

---

## Architecture

```
User → / → Homepage (3 cards)
            ├── /decision-pressure-cooker/          → DPC frontend
            │   └── /decision-pressure-cooker/api/  → DPC backend
            ├── /debate-engine/                     → Debate frontend
            │   └── /debate-engine/api/             → Debate backend
            └── /how-would-they-say-it/             → HWTSI frontend
                └── /how-would-they-say-it/api/     → HWTSI backend
```

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI | Provider-agnostic (`openrouter` \| `openai` \| `anthropic`) |
| Shared | `shared/providers/`, `shared/extractJson.js` |
| Tests | Vitest (unit) + Playwright (E2E) |

---

## Projects

### Decision Pressure Cooker 🔥

Five specialist agents analyze your decision in parallel. A synthesizer weighs their outputs and produces a confidence-scored recommendation.

| Agent | Focus |
|---|---|
| 😈 Devil's Advocate | Flaws, blind spots, faulty assumptions |
| 🚀 Optimist | Upside, tailwinds, compounding effects |
| ⚠️ Pessimist | Execution failure, second-order consequences |
| ⚙️ Pragmatist | Critical path, resources, dependencies |
| 🃏 Wildcard | Unconventional angles, black swans, reframes |
| 🧠 Synthesizer | Weighs all 5, delivers verdict + confidence |

### The Debate Engine ⚖️

Two AI debaters (Proposer vs Challenger) engage in a structured 3-round debate, streamed via Server-Sent Events. An arbiter evaluates argument quality and declares a winner with scores.

Supports individual personalities or pre-defined group matchups (e.g. Parent vs Teenager, Landlord vs Tenant).

### How Would They Say It? 🎭

Eight office-worker personas rewrite any phrase in-character — from the Diplomatic CEO to the Ragequit COO to the Passive-Aggressive Boss. Each persona has a full backstory (accessible via info modal) and generates a signed memo as output.

| Persona | Title |
|---|---|
| 🎩 Diplomatic CEO | Chief Executive Officer |
| 😤 Ragequit COO | Chief Operating Officer |
| 📋 HR Karen | Human Resources |
| 🌟 Enthusiastic Intern | COO's Chief of Staff Intern |
| 😮‍💨 Burned Out Admin | Assistant to All Executives |
| ⚖️ The Lawyer | General Counsel |
| 😏 Passive-Aggressive Boss | Middle Management |
| ✨ Wellness Girlboss | Chief Wellness Officer |

---

## Local Setup

### Prerequisites

- Node.js 18+
- An AI provider API key (OpenRouter, Anthropic, or OpenAI)

### 1. Clone & install

```bash
git clone git@github.com:bigeomaha/eric-ai-fun-projects.git
cd eric-ai-fun-projects
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your API key:

```env
AI_PROVIDER=openrouter
AI_API_KEY=sk-or-v1-your-key-here
AI_MODEL=openrouter/auto
PORT=3000
```

Supported providers:

| Provider | `AI_PROVIDER` | Default Model |
|---|---|---|
| OpenRouter | `openrouter` | `openrouter/auto` |
| Anthropic | `anthropic` | `claude-sonnet-4-6` |
| OpenAI | `openai` | `gpt-4o` |

### 3. Build frontends

```bash
npm run build
```

This installs deps and builds all three frontends with `vite build`.

### 4. Start

```bash
npm start
```

Open **http://localhost:3000** — the homepage shows cards linking to each app.

### Development (hot-reload)

For backend changes, use `npm run dev` (runs `node --watch server.js`). For frontend changes, run each app's Vite dev server independently:

```bash
cd apps/decision-pressure-cooker/frontend && npm run dev   # :5173
cd apps/debate-engine/frontend        && npm run dev   # :5175
cd apps/how-would-they-say-it/frontend && npm run dev   # :5174
```

Each Vite dev server serves its app at the correct sub-path (e.g. `localhost:5173/decision-pressure-cooker/`). API calls go to the root server on port 3000.

---

## Tests

```bash
npm test          # Vitest — 18 unit tests (routes, validation, extractJson, providers)
npm run test:e2e  # Playwright — 5 E2E tests (navigation across all 3 apps)
```

---

## Deployment (Railway)

```bash
npm run build   # Builds all frontends
npm start       # Single process, single port — Railway sets PORT automatically
```

A `Procfile` is not required — Railway detects the `start` script in `package.json`.

---

## License

Educational reference only. See [LICENSE](./LICENSE).
