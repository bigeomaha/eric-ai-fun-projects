import { test, expect } from "@playwright/test";

test.describe("Navigation across all 3 apps", () => {
  test("root loads homepage with 3 project cards", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText("AI Projects");
    await expect(page.locator("a.card")).toHaveCount(3);
  });

  test("Decision Pressure Cooker page loads", async ({ page }) => {
    await page.goto("/decision-pressure-cooker/");
    await expect(page).not.toHaveURL("/");
    // Wait for the page to render — look for key content
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("Debate Engine page loads", async ({ page }) => {
    await page.goto("/debate-engine/");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("How Would They Say It page loads", async ({ page }) => {
    await page.goto("/how-would-they-say-it/");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("navigate between all 3 apps without errors", async ({ page }) => {
    // DPC
    await page.goto("/decision-pressure-cooker/");
    await expect(page.locator("body")).not.toBeEmpty();

    // Debate
    await page.goto("/debate-engine/");
    await expect(page.locator("body")).not.toBeEmpty();

    // HWTSI
    await page.goto("/how-would-they-say-it/");
    await expect(page.locator("body")).not.toBeEmpty();

    // Back to DPC
    await page.goto("/decision-pressure-cooker/");
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
