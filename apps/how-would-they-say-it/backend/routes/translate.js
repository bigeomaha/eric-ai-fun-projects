/**
 * POST /api/translate  — runs all 8 persona agents in parallel
 * GET  /api/personas/:id — returns the persona's .md file as plain text
 */

import { Router } from "express";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { passiveAggressiveBoss } from "../agents/passiveAggressiveBoss.js";
import { ragequitCeo }           from "../agents/ragequitCeo.js";
import { enthusiasticIntern }    from "../agents/enthusiasticIntern.js";
import { hrKaren }               from "../agents/hrKaren.js";
import { diplomaticCeo }         from "../agents/diplomaticCeo.js";
import { theLawyer }             from "../agents/theLawyer.js";
import { burnedOutAdmin }        from "../agents/burnedOutAdmin.js";
import { wellnessGirlboss }      from "../agents/wellnessGirlboss.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PERSONAS_DIR = join(__dirname, "../personas");

const ALL_AGENTS = [
  diplomaticCeo,        // 1 — CEO
  ragequitCeo,          // 2 — COO
  hrKaren,              // 3 — HR
  enthusiasticIntern,   // 4 — COO's Chief of Staff Intern
  burnedOutAdmin,       // 5 — Asst to All Executives
  theLawyer,            // 6 — Lawyer
  passiveAggressiveBoss,// 7 — Passive-Aggressive Boss
  wellnessGirlboss,     // 8 — Wellness Girlboss (full-width)
];

const router = Router();

// ── POST /api/translate ──────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { phrase } = req.body;

  if (!phrase || typeof phrase !== "string" || phrase.trim().length < 3) {
    return res.status(400).json({ error: "Please provide a phrase of at least 3 characters." });
  }

  const trimmed = phrase.trim();
  console.log(`[translate] Running ${ALL_AGENTS.length} agents in parallel...`);

  const results = await Promise.all(
    ALL_AGENTS.map((agent) =>
      agent.translate(trimmed).catch((err) => ({
        id: agent.id,
        name: agent.name,
        emoji: agent.emoji,
        age: agent.age,
        title: agent.title,
        color: agent.color,
        rewrite: "⚠️ This persona is temporarily unavailable.",
        signature: err.message,
      }))
    )
  );

  console.log(`[translate] Done.`);
  res.json({ phrase: trimmed, results, timestamp: new Date().toISOString() });
});

// ── GET /api/personas/:id ────────────────────────────────────────────────────
// Returns the raw markdown for a persona's personality file
router.get("/personas/:id", (req, res) => {
  const { id } = req.params;

  // Sanitise — allow only lowercase letters, digits, hyphens
  if (!/^[a-z0-9-]+$/.test(id)) {
    return res.status(400).json({ error: "Invalid persona id." });
  }

  const filePath = join(PERSONAS_DIR, `${id}.md`);
  if (!existsSync(filePath)) {
    return res.status(404).json({ error: `Persona "${id}" not found.` });
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(readFileSync(filePath, "utf8"));
});

export default router;
