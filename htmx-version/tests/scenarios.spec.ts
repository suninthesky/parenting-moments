import { test, expect } from '@playwright/test';

test.describe('Parenting Scenarios Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load initial scenario', async ({ page }) => {
    // Wait for initial scenario to load
    await expect(page.locator('#scenario')).not.toContainText('Loading scenario...');
    
    // Check if meters are initialized correctly
    await expect(page.locator('#mood-meter')).toHaveAttribute('style', /width: 100%/);
    await expect(page.locator('#patience-meter')).toHaveAttribute('style', /width: 100%/);
  });

  test('should complete three scenarios successfully', async ({ page }) => {
    // Track completed scenarios
    let completedScenarios = 0;
    const scenariosToComplete = 3;

    while (completedScenarios < scenariosToComplete) {
      // Wait for scenario to load
      await page.waitForSelector('button[hx-post="/make-choice"]');

      // Get initial situation text
      const initialSituation = await page.locator('h3.text-xl').textContent();

      // Make a choice (always select first option for test)
      await page.click('button[hx-post="/make-choice"]:first-child');

      // Verify outcome is shown
      await expect(page.locator('h3:text("Outcome Analysis")')).toBeVisible();

      // Move to next scenario
      await page.click('button:text("Continue to Next Situation")');

      // Verify new scenario is loaded (different from previous)
      await page.waitForSelector('h3.text-xl');
      const newSituation = await page.locator('h3.text-xl').textContent();
      expect(newSituation).not.toBe(initialSituation);

      completedScenarios++;
    }

    // Verify we completed the expected number of scenarios
    expect(completedScenarios).toBe(scenariosToComplete);
  });

  test('should show parenting tip halfway through timer', async ({ page }) => {
    // Initially tip should be hidden
    await expect(page.locator('#parenting-tip')).toHaveClass(/opacity-0/);

    // Wait for tip to become visible (around 5 seconds with 10 second timer)
    await expect(page.locator('#parenting-tip')).toHaveClass(/opacity-100/, { timeout: 6000 });
  });

  test('should update meters when choice is made', async ({ page }) => {
    // Get initial meter values
    const initialMoodWidth = await page.locator('#mood-meter').getAttribute('style');

    // Make a choice
    await page.click('button[hx-post="/make-choice"]:first-child');

    // Wait for meters to update
    await page.waitForTimeout(500); // Allow for animation

    // Get new meter values
    const newMoodWidth = await page.locator('#mood-meter').getAttribute('style');

    // Verify meters changed
    expect(newMoodWidth).not.toBe(initialMoodWidth);
  });

  test('should handle timeout correctly', async ({ page }) => {
    // Wait for initial scenario
    await page.waitForSelector('#timer-bar');

    // Wait for timeout (11 seconds to be safe)
    await page.waitForTimeout(11000);

    // Verify timeout notice is visible
    await expect(page.locator('#timeout-notice')).toHaveClass(/opacity-100/);

    // Verify mood meter is decreasing
    const initialWidth = await page.locator('#mood-meter').getAttribute('style');
    await page.waitForTimeout(2000);
    const newWidth = await page.locator('#mood-meter').getAttribute('style');
    
    expect(parseFloat(newWidth.match(/width: ([\d.]+)%/)[1]))
      .toBeLessThan(parseFloat(initialWidth.match(/width: ([\d.]+)%/)[1]));
  });
}); 