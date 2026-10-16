import { test, expect, type Page } from '@playwright/test';
import { PERSONAL_MODE_ENABLED } from '../src/config.js';

// Behavior regression for the /in-the-wild filter swap. The config runs every test under
// reducedMotion: 'reduce', which skips the fade entirely; this spec needs the animated path.
test.use({ reducedMotion: 'no-preference' });

const modes = ['recruiter', 'personal'] as const;

const pill = (page: Page, label: string) =>
  page.locator('.navpill__item', { has: page.locator('.label', { hasText: new RegExp(`^${label}$`) }) });

const gridOpacity = (page: Page) =>
  page.locator('.sd-grid').evaluate(g => getComputedStyle(g).opacity);

// fill: 'forwards' animations still applied to the grid after it settles
const heldAnimations = (page: Page) =>
  page.locator('.sd-grid').evaluate(g =>
    g.getAnimations().filter(a => a.playState === 'finished' && a.effect?.getTiming().fill === 'forwards').length);

async function open(page: Page, mode: string) {
  await page.goto(`http://localhost:5174/in-the-wild?mode=${mode}`, { waitUntil: 'commit', timeout: 30000 });
  await expect(page.locator('.sd-grid .mention').first()).toBeVisible({ timeout: 30000 });
}

test.describe('in-the-wild filter swap', () => {
  for (const mode of modes) {
    test.describe(mode, () => {
      test.skip(mode === 'personal' && !PERSONAL_MODE_ENABLED, 'personal mode requires PERSONAL_MODE_ENABLED=true in src/config.js');

      test('grid fades back in after a filter change', async ({ page }) => {
        await open(page, mode);
        await pill(page, 'Recs').click();
        await expect(page.locator('.sd-grid')).toHaveAttribute('data-filter', 'rec');
        await expect.poll(() => gridOpacity(page)).toBe('1');
        expect(await heldAnimations(page)).toBe(0);
      });

      test('grid fades back in when a click returns to the shown filter mid fade-out', async ({ page }) => {
        await open(page, mode);
        // Second click lands inside the 140ms fade-out, after React has re-rendered the first.
        await page.evaluate(async () => {
          const byLabel = (l: string) => [...document.querySelectorAll<HTMLElement>('.navpill__item')]
            .find(b => b.querySelector('.label')?.textContent === l)!;
          const frame = () => new Promise(r => requestAnimationFrame(() => r(null)));
          byLabel('Recs').click();
          await frame(); await frame();
          byLabel('All').click();
        });
        await expect(page.locator('.sd-grid')).toHaveAttribute('data-filter', 'all');
        await expect.poll(() => gridOpacity(page), { timeout: 2000 }).toBe('1');
        expect(await heldAnimations(page)).toBe(0);
      });
    });
  }
});
