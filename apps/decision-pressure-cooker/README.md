# Decision Pressure Cooker 🔥

> Five specialist AI agents attack your decision from every angle. One Synthesizer delivers the final verdict.

A multi-agent AI tool for portfolio demonstration. Each perspective is its own independent agent with a distinct persona, system prompt, and reasoning style. All 5 agents run in parallel, then a Synthesizer weighs their outputs and produces a confidence-scored recommendation.

---

## Architecture

```
User Input
    │
    ▼
POST /api/analyze
    │
    ├──▶ 😈 Devil's Advocate agent  ─┐
    ├──▶ 🚀 Optimist agent          │  (parallel)
    ├──▶ ⚠️  Pessimist agent         │
    ├──▶ ⚙️  Pragmatist agent        │
    └──▶ 🃏 Wildcard agent          ─┘
                                      │
                                      ▼
                              🧠 Synthesizer agent
                                      │
                                      ▼
                              Final verdict + confidence score
```

**Stack:** React + Vite (frontend) · Node.js + Express (backend) · Provider-agnostic AI layer

---

## Setup

### 1. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
AI_PROVIDER=anthropic          # or: openai
AI_API_KEY=your_api_key_here
AI_MODEL=                      # optional — uses provider default if blank
PORT=3001
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Run

Open two terminals:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Then open **http://localhost:5173**

---

## Switching AI Providers

The AI layer is fully abstracted. Swap providers by changing two env vars — no code changes needed:

| Provider  | `AI_PROVIDER` | Default model          |
|-----------|---------------|------------------------|
| Anthropic | `anthropic`   | `claude-sonnet-4-6`    |
| OpenAI    | `openai`      | `gpt-4o`               |

To add a new provider: create `backend/providers/yourprovider.js` with a `chat(systemPrompt, userMessage, model)` export and add a case in `backend/providers/index.js`.

---

## The Agents

| Agent | Persona | Focus |
|-------|---------|-------|
| 😈 Devil's Advocate | Razor-sharp critic | Flaws, blind spots, faulty assumptions |
| 🚀 Optimist | Forward-thinking strategist | Upside, tailwinds, compounding effects |
| ⚠️ Pessimist | Cautious realist | Execution failure, second-order consequences |
| ⚙️ Pragmatist | Execution-focused operator | Critical path, resources, dependencies |
| 🃏 Wildcard | Lateral thinker | Unconventional angles, black swans, reframes |
| 🧠 Synthesizer | Senior decision strategist | Weighs all 5, delivers verdict + confidence |
