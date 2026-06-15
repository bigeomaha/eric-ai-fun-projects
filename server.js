import "dotenv/config";
import express from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// ── App route imports ─────────────────────────────────────────────────────────
import analyzeRouter   from "./apps/decision-pressure-cooker/backend/routes/analyze.js";
import voicesRouter    from "./apps/decision-pressure-cooker/backend/routes/voices.js";
import debateRouter    from "./apps/debate-engine/backend/routes/debate.js";
import translateRouter from "./apps/how-would-they-say-it/backend/routes/translate.js";

const app = express();

app.use(cors());
app.use(express.json());

// ── API Routes (sub-path prefixed) ────────────────────────────────────────────
app.use("/decision-pressure-cooker/api/analyze", analyzeRouter);
app.use("/decision-pressure-cooker/api/voices", voicesRouter);
app.use("/debate-engine/api/debate", debateRouter);
app.use("/how-would-they-say-it/api/translate", translateRouter);

// Legacy health endpoint (root-level convenience)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    provider: process.env.AI_PROVIDER || "openrouter",
    model: process.env.AI_MODEL || "(provider default)",
  });
});

// ── Static frontend serving ───────────────────────────────────────────────────
const APPS = [
  { name: "decision-pressure-cooker", port: 5173 },
  { name: "debate-engine",            port: 5175 },
  { name: "how-would-they-say-it",    port: 5174 },
];

for (const appCfg of APPS) {
  const distPath = join(__dirname, "apps", appCfg.name, "frontend", "dist");
  if (existsSync(distPath)) {
    app.use(`/${appCfg.name}`, express.static(distPath));
    // Serve index.html for client-side routing fallback at sub-path
    app.get(`/${appCfg.name}/*`, (_req, res) => {
      res.sendFile(join(distPath, "index.html"));
    });
    console.log(`  ✓ ${appCfg.name} → ${distPath}`);
  } else {
    console.log(`  ⚠ ${appCfg.name} — no dist found at ${distPath}`);
  }
}

// ── Root — serve homepage ──────────────────────────────────────────────────────
app.use(express.static(join(__dirname, "public")));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 AI Projects server running on port ${PORT}`);
  console.log(`   Provider : ${process.env.AI_PROVIDER || "openrouter"}`);
  console.log(`   Model    : ${process.env.AI_MODEL || "(provider default)"}`);
  console.log(`\n   Apps:`);
  console.log(`   • http://localhost:${PORT}/decision-pressure-cooker`);
  console.log(`   • http://localhost:${PORT}/debate-engine`);
  console.log(`   • http://localhost:${PORT}/how-would-they-say-it\n`);
});
