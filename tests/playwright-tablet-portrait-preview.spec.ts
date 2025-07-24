import { test, expect } from '@playwright/test';

test('Preview site in Tablet Portrait (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1400); // Wait for animations to finish
    await page.pause();
}); 