import { test, expect } from '@playwright/test';

test.describe('Parenting Moments SPA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load landing and start the journey', async ({ page }) => {
    await expect(page.locator('text=Parenting Moments')).toBeVisible();
    await page.click('button:has-text("Start")');
    await expect(page.locator('text=Scenario 1')).toBeVisible();
  });

  test('should complete three scenarios', async ({ page }) => {
    await page.click('button:has-text("Start")');
    for (let i = 0; i < 3; i++) {
      await page.click('button:has-text("Get down to their level")');
      await page.click('button:has-text("Next Scenario"), button:has-text("See My Results")');
    }
    await expect(page.locator('text=Your Parenting Journey')).toBeVisible();
  });

  test('should show parenting tip and status bars', async ({ page }) => {
    await page.click('button:has-text("Start")');
    await expect(page.locator('text=Parenting Tip:')).toBeVisible();
    await expect(page.locator('#mood-meter')).toBeVisible();
    await expect(page.locator('#patience-meter')).toBeVisible();
    await expect(page.locator('#timer-bar')).toBeVisible();
  });
});
