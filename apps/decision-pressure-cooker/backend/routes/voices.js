/**
 * GET /api/voices
 * Returns the voice catalog — metadata for all 20 selectable voices.
 */

import { Router } from "express";
import { VOICE_CATALOG } from "../agents/voiceRegistry.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(VOICE_CATALOG);
});

export default router;
