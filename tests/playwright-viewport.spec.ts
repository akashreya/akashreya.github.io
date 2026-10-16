import { test, expect } from '@playwright/test';
import { PERSONAL_MODE_ENABLED } from '../src/config.js';

const viewports = [
  { name: 'Mobile Portrait',    width: 360,  height: 800  },
  { name: 'Mobile Landscape',   width: 800,  height: 360  },
  { name: 'Tablet Portrait',    width: 768,  height: 1024 },
  { name: 'Tablet Landscape',   width: 1024, height: 768  },
  { name: 'Desktop Small',      width: 1366, height: 768  },
  { name: 'Desktop Large',      width: 1920, height: 1080 },
  { name: 'Desktop XL',         width: 2560, height: 1440 },
];

const modes = ['recruiter', 'personal'] as const;

const DISABLE_ANIMATIONS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
  .reveal, .reveal.no-anim {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .letter-drop > span {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    filter: none !important;
  }
  .ticker-inner {
    animation: none !important;
    transform: none !important;
  }
  .term__clock { visibility: hidden !important; }
  .term__dot { animation: none !important; box-shadow: none !important; }
  .blob { animation: none !important; }
  .footprints { display: none !important; }
  .chikorita { display: none !important; }
  .mode-iris, .mode-curtain { display: none !important; }
  [data-mode="personal"] .mention {
    opacity: 1 !important;
    transform: none !important;
  }
  .mention.is-dropped {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .sq-node {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
`;

test.describe('v3 visual regression', () => {
  test.describe.configure({ mode: 'serial' });

  for (const mode of modes) {
    for (const vp of viewports) {
      test(`${mode} / ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
        // ?mode=personal is ignored and hard-forced to recruiter when the flag is off
        // (ThemeProvider.jsx), so these baselines only match with PERSONAL_MODE_ENABLED=true.
        test.skip(mode === 'personal' && !PERSONAL_MODE_ENABLED, 'personal mode requires PERSONAL_MODE_ENABLED=true in src/config.js');

        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`http://localhost:5174/?mode=${mode}`, { waitUntil: 'commit', timeout: 30000 });
        // Poll until React mounts — avoids waiting for external fonts which can block 'load'
        await page.waitForFunction(() => document.querySelector('#hero') !== null, { timeout: 30000 });
        await page.addStyleTag({ content: DISABLE_ANIMATIONS });

        const slug = `${mode}-${vp.name.replace(/ /g, '-')}`;

        await page.locator('#hero').scrollIntoViewIfNeeded();
        await expect(page.locator('.hero__name')).toBeVisible();
        await expect(page).toHaveScreenshot(`${slug}-hero.png`, { fullPage: false });

        await page.locator('#projects').scrollIntoViewIfNeeded();
        await expect(page.locator('#projects .card').first()).toBeVisible();
        await expect(page).toHaveScreenshot(`${slug}-projects.png`, { fullPage: false });

        if (mode === 'personal') {
          await page.locator('#sidequests').scrollIntoViewIfNeeded();
          await expect(page.locator('#sidequests')).toBeVisible();
          await expect(page).toHaveScreenshot(`${slug}-sidequests.png`, { fullPage: false });
        }

        await page.locator('#principles').scrollIntoViewIfNeeded();
        await expect(page.locator('#principles')).toBeVisible();
        await expect(page).toHaveScreenshot(`${slug}-principles.png`, { fullPage: false });

        if (mode === 'recruiter') {
          await page.locator('#enterprise').scrollIntoViewIfNeeded();
          await expect(page.locator('#enterprise .ent-card').first()).toBeVisible();
          await expect(page).toHaveScreenshot(`${slug}-enterprise.png`, { fullPage: false });
        } else {
          await page.locator('.enterprise-collapsed').scrollIntoViewIfNeeded();
          await expect(page.locator('.enterprise-collapsed')).toBeVisible();
          await expect(page).toHaveScreenshot(`${slug}-enterprise-collapsed.png`, { fullPage: false });
        }

        await page.locator('#footer').scrollIntoViewIfNeeded();
        await expect(page.locator('#footer')).toBeVisible();
        await expect(page).toHaveScreenshot(`${slug}-footer.png`, { fullPage: false });
      });
    }
  }
});
