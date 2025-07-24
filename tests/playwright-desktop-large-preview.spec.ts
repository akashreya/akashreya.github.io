import { test, expect } from '@playwright/test';

test('Preview site in Desktop Large (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1400); // Wait for animations to finish
    await page.pause();
}); 