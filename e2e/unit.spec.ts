import { test, expect } from "@playwright/test";

test.describe("Units - Add Unit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/units");
  });

  test("should add a new unit", async ({ page }) => {
    // Open add form
    await page.getByRole("button", { name: "+ Add Unit" }).click();
    await expect(page.getByText("Add New Unit")).toBeVisible();

    // Fill fields
    await page.getByPlaceholder("USD, BTC, GOLD").fill("GOLD");
    await page.getByPlaceholder("US Dollar, Bitcoin, Gold Ounce").fill("Gold");
    await page.getByPlaceholder("$,₿").fill("🟡");

    // Click exact Add button
    await page.getByRole("button", { name: "Add", exact: true }).click();

    // Validate the new card appears
    // Code (in a <span>)
    await expect(page.locator("span", { hasText: "GOLD" })).toBeVisible();

    // Name (in <p>)
    await expect(page.locator("p", { hasText: "Gold" })).toBeVisible();
  });

  test("canceling add should NOT add a new unit", async ({ page }) => {
    await page.getByRole("button", { name: "+ Add Unit" }).click();

    await page.getByPlaceholder("USD, BTC, GOLD").fill("TEMP");

    await page.getByRole("button", { name: "Cancel", exact: true }).click();

    // Form hidden
    await expect(page.getByText("Add New Unit")).not.toBeVisible();

    // Should NOT exist in list
    await expect(page.locator("span", { hasText: "TEMP" })).not.toBeVisible();
  });
});

test('deletes a unit when clicking Delete icon and confirming', async ({ page }) => {
  await page.goto('http://localhost:5173/units');

  // Locate the "USD" card or any specific unit you want to test
  const usdCard = page.getByText('US Dollar').locator('..').locator('..');

  // Count units before deletion
  const unitCardsBefore = await page.locator('.ant-card').count();

  // Click the delete icon inside this card
  await usdCard.locator('svg[data-icon="delete"]').click();

  // Wait for AntD confirmation modal to appear
  const modal = page.getByRole('dialog', { name: 'Are you sure you want to delete this unit?' });
  await expect(modal).toBeVisible();

  // Click "Yes, delete" button in modal
  await modal.getByRole('button', { name: 'Yes, delete' }).click();

  // Ensure the modal disappears
  await expect(modal).not.toBeVisible();

  // Count units after deletion
  const unitCardsAfter = await page.locator('.ant-card').count();

  // Expect one less card
  expect(unitCardsAfter).toBe(unitCardsBefore - 1);

  // Also expect USD card to be gone
  await expect(page.getByText('US Dollar')).not.toBeVisible();
});

test.describe("Units - Edit Unit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/units");
  });

  test("editing a unit should update its information", async ({ page }) => {
    // Locate the USD card (unique name ensures correct card)
    const usdCard = page.getByText("US Dollar").locator("..").locator("..");

    // Click the edit icon
    await usdCard.locator('svg[data-icon="edit"]').click();

    // Form should become visible
    await expect(page.getByText("Edit Unit")).toBeVisible();

    // Confirm fields are prefilled correctly
    await expect(page.getByPlaceholder("USD, BTC, GOLD")).toHaveValue("USD");
    await expect(page.getByPlaceholder("US Dollar, Bitcoin, Gold Ounce")).toHaveValue("US Dollar");
    await expect(page.getByPlaceholder("$,₿")).toHaveValue("$");

    // Change values
    await page.getByPlaceholder("USD, BTC, GOLD").fill("USDX");
    await page.getByPlaceholder("US Dollar, Bitcoin, Gold Ounce").fill("US Dollar EX");
    await page.getByPlaceholder("$,₿").fill("💲");

    // Click Update
    await page.getByRole("button", { name: "Update", exact: true }).click();

    // Form disappears
    await expect(page.getByText("Edit Unit")).not.toBeVisible();

    // Check updated card appears
    await expect(page.getByText("US Dollar EX")).toBeVisible();
    await expect(page.getByText("USDX")).toBeVisible();
    await expect(page.getByText("💲")).toBeVisible();

    // Old values must NOT remain
    // Old values must NOT remain
await expect(page.getByText("US Dollar", { exact: true })).not.toBeVisible();
await expect(page.getByText("USD", { exact: true })).not.toBeVisible();

  });


  test("canceling edit should NOT change the unit", async ({ page }) => {
    // Locate USD card
    const usdCard = page.getByText("US Dollar").locator("..").locator("..");

    // Click edit icon
    await usdCard.locator('svg[data-icon="edit"]').click();

    await expect(page.getByText("Edit Unit")).toBeVisible();

    // Change the code (but will cancel)
    await page.getByPlaceholder("USD, BTC, GOLD").fill("SHOULD_NOT_SAVE");

    // Cancel
    await page.getByRole("button", { name: "Cancel", exact: true }).click();

    // Form disappears
    await expect(page.getByText("Edit Unit")).not.toBeVisible();

    // Original unchanged values must remain
    await expect(page.getByText("US Dollar")).toBeVisible();
    await expect(page.getByText("USD")).toBeVisible();

    // New unsaved value must NOT appear
    await expect(page.getByText("SHOULD_NOT_SAVE")).not.toBeVisible();
  });
});
