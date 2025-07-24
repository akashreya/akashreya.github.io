import { test, expect } from '@playwright/test';

test('Preview site in Mobile Landscape (800x360)', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 360 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1400); // Wait for animations to finish
    await page.pause();
}); 