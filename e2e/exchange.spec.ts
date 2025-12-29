import { test, expect } from "@playwright/test";

test.describe("Exchange Rates Tab", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/units");

    // Switch to Exchange Rates tab
    await page.getByRole("tab", { name: "Exchange Rates" }).click();

    // Get active panel (AntD marks inactive with aria-hidden="true")
    const panel = page.locator('[role="tabpanel"][aria-hidden="false"]').first();

    await expect(panel).toBeVisible();

    // Wait for the + Add Unit button INSIDE THIS TAB
    // (Units tab has the same button name — so MUST scope to panel)
    await panel.getByRole("button", { name: "+ Add Unit" }).waitFor();
  });

  //
  // ADD RATE
  //
  test("should add a new exchange rate", async ({ page }) => {
    const panel = page.locator('[role="tabpanel"][aria-hidden="false"]').first();

    await panel.getByRole("button", { name: "+ Add Unit" }).click();

    await expect(page.getByText("Add New Rate")).toBeVisible();

    await page.getByPlaceholder("USD").fill("USD");
    await page.getByPlaceholder("EUR").fill("EUR");
    await page.getByPlaceholder("1.00").fill("1.23");

    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(panel.getByText("USD → EUR")).toBeVisible();
  });

  //
  // CANCEL ADD
  //
  test("canceling add should NOT create a new rate", async ({ page }) => {
    const panel = page.locator('[role="tabpanel"][aria-hidden="false"]').first();

    await panel.getByRole("button", { name: "+ Add Unit" }).click();

    await page.getByPlaceholder("USD").fill("TEMP");

    await page.getByRole("button", { name: "Cancel", exact: true }).click();

    await expect(page.getByText("Add New Rate")).not.toBeVisible();
    await expect(panel.getByText("TEMP")).not.toBeVisible();
  });

  //
  // DELETE RATE
  //
  test("should delete an exchange rate", async ({ page }) => {
    const panel = page.locator('[role="tabpanel"][aria-hidden="false"]').first();

    const cards = panel.locator(".ant-card");
    const before = await cards.count();

    const firstCard = cards.first();
    await firstCard.locator('svg[data-icon="delete"]').click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    await modal.getByRole("button", { name: /delete/i }).click();

    await expect(modal).not.toBeVisible();

    const after = await cards.count();
    expect(after).toBe(before - 1);
  });

  //
  // EDIT RATE
  //
  test("should edit an exchange rate", async ({ page }) => {
    const panel = page.locator('[role="tabpanel"][aria-hidden="false"]').first();

    const card = panel.locator(".ant-card").first();
    await card.locator('svg[data-icon="edit"]').click();

    await expect(page.getByText("Edit Rate")).toBeVisible();

    await page.getByPlaceholder("USD").fill("USDX");
    await page.getByPlaceholder("EUR").fill("EURX");
    await page.getByPlaceholder("1.00").fill("9.99");

    await page.getByRole("button", { name: "Update", exact: true }).click();

    await expect(panel.getByText("USDX → EURX")).toBeVisible();
    await expect(panel.getByText("9.99")).toBeVisible();
  });

  //
  // CANCEL EDIT
  //
  test("canceling edit should NOT update the rate", async ({ page }) => {
    const panel = page.locator('[role="tabpanel"][aria-hidden="false"]').first();

    const card = panel.locator(".ant-card").first();
    await card.locator('svg[data-icon="edit"]').click();

    await page.getByPlaceholder("USD").fill("NO_SAVE");

    await page.getByRole("button", { name: "Cancel", exact: true }).click();

    await expect(panel.getByText("NO_SAVE")).not.toBeVisible();
  });
});
