import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Mock AI provider ──────────────────────────────────────────────────────────
vi.mock("../../shared/providers/index.js", () => ({
  getProvider: () => ({
    chat: vi.fn().mockResolvedValue(
      JSON.stringify({
        angle: "Test perspective",
        points: ["Point 1", "Point 2", "Point 3", "Point 4"],
        confidence: 75,
        verdict: "Test verdict",
        keyRisk: "Test risk",
      })
    ),
  }),
}));

// ── Mock provider for each backend's re-export ─────────────────────────────────
vi.mock("../../../shared/providers/index.js", () => ({
  getProvider: () => ({
    chat: vi.fn().mockResolvedValue(
      JSON.stringify({
        angle: "Test perspective",
        points: ["Point 1", "Point 2", "Point 3", "Point 4"],
        confidence: 75,
        verdict: "Test verdict",
        keyRisk: "Test risk",
      })
    ),
  }),
}));

vi.mock("../../../../shared/providers/index.js", () => ({
  getProvider: () => ({
    chat: vi.fn().mockResolvedValue(
      JSON.stringify({
        angle: "Test perspective",
        points: ["Point 1", "Point 2", "Point 3", "Point 4"],
        confidence: 75,
        verdict: "Test verdict",
        keyRisk: "Test risk",
      })
    ),
  }),
}));

// ── Import routes (after mocks) ───────────────────────────────────────────────
import analyzeRouter  from "../apps/decision-pressure-cooker/backend/routes/analyze.js";
import voicesRouter   from "../apps/decision-pressure-cooker/backend/routes/voices.js";
import debateRouter   from "../apps/debate-engine/backend/routes/debate.js";
import translateRouter from "../apps/how-would-they-say-it/backend/routes/translate.js";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/decision-pressure-cooker/api/analyze", analyzeRouter);
  app.use("/decision-pressure-cooker/api/voices", voicesRouter);
  app.use("/debate-engine/api/debate", debateRouter);
  app.use("/how-would-they-say-it/api/translate", translateRouter);
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  return app;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Health endpoint", () => {
  it("returns ok status", async () => {
    const app = createApp();
    // Simple inline server for testing
    const { default: supertest } = await import("supertest");
    const res = await supertest(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Decision Pressure Cooker", () => {
  it("GET /voices returns voice catalog", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app).get("/decision-pressure-cooker/api/voices");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
  });

  it("POST /analyze returns 400 for short decisions", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .post("/decision-pressure-cooker/api/analyze")
      .send({ decision: "Hi" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /analyze returns 400 for missing decision", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .post("/decision-pressure-cooker/api/analyze")
      .send({});
    expect(res.status).toBe(400);
  });

  it("POST /analyze returns 400 for invalid voice IDs", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .post("/decision-pressure-cooker/api/analyze")
      .send({ decision: "Should I accept the new job offer?", voices: ["nonexistent-voice"] });
    expect(res.status).toBe(400);
  });
});

describe("Debate Engine", () => {
  it("POST /debate returns 400 for short claims", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .post("/debate-engine/api/debate")
      .send({ claim: "Hi" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /debate creates session with valid claim", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .post("/debate-engine/api/debate")
      .send({ claim: "Social media does more harm than good for teenagers." });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("debateId");
  });
});

describe("How Would They Say It", () => {
  it("POST /translate returns 400 for short phrases", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .post("/how-would-they-say-it/api/translate")
      .send({ phrase: "Hi" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /personas/:id returns markdown for valid persona", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .get("/how-would-they-say-it/api/translate/personas/diplomatic-ceo");
    expect(res.status).toBe(200);
    expect(res.text).toBeTruthy();
  });

  it("GET /personas/:id returns 400 for invalid persona id", async () => {
    const { default: supertest } = await import("supertest");
    const app = createApp();
    const res = await supertest(app)
      .get("/how-would-they-say-it/api/translate/personas/<script>");
    expect(res.status).toBe(400);
  });
});

describe("Provider selection", () => {
  it("shared providers index exports getProvider", async () => {
    const { getProvider } = await import("../shared/providers/index.js");
    expect(getProvider).toBeDefined();
    expect(typeof getProvider).toBe("function");
  });

  it("openrouter provider has chat function", async () => {
    const openrouter = await import("../shared/providers/openrouter.js");
    expect(openrouter.chat).toBeDefined();
    expect(typeof openrouter.chat).toBe("function");
  });
});

describe("extractJson", () => {
  it("parses clean JSON", async () => {
    const { extractJson } = await import("../shared/extractJson.js");
    const result = extractJson('{"a":1,"b":"two"}');
    expect(result).toEqual({ a: 1, b: "two" });
  });

  it("parses JSON with leading text", async () => {
    const { extractJson } = await import("../shared/extractJson.js");
    const result = extractJson('Here is my analysis: {"angle":"test","points":["a","b"]}');
    expect(result).toEqual({ angle: "test", points: ["a", "b"] });
  });

  it("parses JSON with trailing text", async () => {
    const { extractJson } = await import("../shared/extractJson.js");
    const result = extractJson('{"key":"value"} I hope this helps.');
    expect(result).toEqual({ key: "value" });
  });

  it("strips markdown code fences", async () => {
    const { extractJson } = await import("../shared/extractJson.js");
    const result = extractJson('```json\n{"a":1}\n```');
    expect(result).toEqual({ a: 1 });
  });

  it("handles text before and after code fences", async () => {
    const { extractJson } = await import("../shared/extractJson.js");
    const result = extractJson('Here:\n```json\n{"a":1}\n```\nHope this helps.');
    expect(result).toEqual({ a: 1 });
  });

  it("throws on invalid input", async () => {
    const { extractJson } = await import("../shared/extractJson.js");
    expect(() => extractJson("not json at all")).toThrow();
  });
});
