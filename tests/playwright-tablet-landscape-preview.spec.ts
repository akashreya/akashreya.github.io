import { test, expect } from '@playwright/test';

test('Preview site in Tablet Landscape (1024x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1400); // Wait for animations to finish
    await page.pause();
}); 