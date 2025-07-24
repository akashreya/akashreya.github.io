import { test, expect } from '@playwright/test';

test('Preview site in Mobile Portrait (360x800)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1400); // Wait for animations to finish
    // Pause for manual inspection in Playwright Inspector
    await page.pause();
}); 