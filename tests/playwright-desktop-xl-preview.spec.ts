import { test, expect } from '@playwright/test';

test('Preview site in Desktop XL (2560x1440)', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1400); // Wait for animations to finish
    await page.pause();
}); 