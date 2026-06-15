/**
 * roleAssigner — reads the debate claim and decides which group role should
 * argue FOR and which should argue AGAINST.
 *
 * Groups define two roles (e.g. Parent / Teenager), but the "natural" side
 * for each role depends entirely on the topic. A Parent might argue FOR
 * "kids should have a bedtime" but AGAINST "you should get married at 23".
 *
 * This agent makes that call before identities are generated, so the entire
 * debate — names, personality prompts, turn content — is contextually correct.
 */
import { getProvider } from "../providers/index.js";

export async function assignGroupRoles(claim, group) {
  const provider = getProvider();

  const system = "You assign debate roles. Respond with only the letter A or B — no other text.";
  const user   = `You are deciding which debater argues FOR a motion.

Motion: "${claim}"

Role A: ${group.for.role}
Role B: ${group.against.role}

Which role would most naturally and authentically argue FOR this motion based on their typical values, lived experience, and worldview? Reply A or B only.`;

  try {
    const raw    = await provider.chat(system, user);
    const choice = raw.trim().toUpperCase().charAt(0);

    if (choice === "B") {
      // Role B (originally AGAINST) naturally argues FOR — swap sides
      console.log(`[roleAssigner] "${claim.slice(0, 50)}…" → ${group.against.role} FOR, ${group.for.role} AGAINST`);
      return { forPersonality: group.against, againstPersonality: group.for };
    }
  } catch (err) {
    // On any failure, fall back to the group's default ordering
    console.warn(`[roleAssigner] Assignment failed, using defaults:`, err.message);
  }

  console.log(`[roleAssigner] "${claim.slice(0, 50)}…" → ${group.for.role} FOR, ${group.against.role} AGAINST`);
  return { forPersonality: group.for, againstPersonality: group.against };
}
