import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
});

test("shop page loads", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
