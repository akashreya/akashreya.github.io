// playwright-viewport.spec.ts
import { test, expect } from '@playwright/test';

const viewports = [
    { name: 'Mobile Portrait', width: 360, height: 800 },
    { name: 'Mobile Landscape', width: 800, height: 360 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1366, height: 768 },
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: 'Desktop XL', width: 2560, height: 1440 },
];

const sections = [
    { id: 'home', label: 'Home', uniqueSelector: 'section#home .hero-title' },
    { id: 'about', label: 'About', uniqueSelector: 'section#about .about-details' },
    { id: 'portfolio', label: 'Portfolio', uniqueSelector: 'section#portfolio .projects-list-inner' },
    { id: 'skills', label: 'Skills', uniqueSelector: 'section#skills .main-content, section#skills .component, section#skills' },
];

test.describe('Responsive viewport and section tests', () => {
    test.describe.configure({ mode: 'serial' });

    for (const viewport of viewports) {
        test(`should render all main sections and projects at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
            await test.step(`Set viewport to ${viewport.name}`, async () => {
                await page.setViewportSize({ width: viewport.width, height: viewport.height });
            });
            await test.step('Go to home page', async () => {
                await page.goto('http://localhost:5173');
                // Aggressively disable all animations and transitions for consistent screenshots
                await page.addStyleTag({
                    content: `
                        /* Disable all CSS animations */
                        *, *::before, *::after {
                            animation-duration: 0s !important;
                            animation-delay: 0s !important;
                            animation-iteration-count: 1 !important;
                            animation-play-state: paused !important;
                            transition-duration: 0s !important;
                            transition-delay: 0s !important;
                            transform: none !important;
                        }
                        
                        /* Disable specific motion components */
                        [data-framer-component-type] {
                            animation: none !important;
                            transition: none !important;
                        }
                        
                        /* Set reduced motion preference globally */
                        * {
                            --motion-reduce: reduce;
                        }
                    `
                });

                // Set reduced motion preference programmatically
                await page.evaluate(() => {
                    // Mock matchMedia for reduced motion
                    Object.defineProperty(window, 'matchMedia', {
                        writable: true,
                        value: (query: string) => ({
                            matches: query === '(prefers-reduced-motion: reduce)',
                            media: query,
                            onchange: null,
                            addListener: () => { },
                            removeListener: () => { },
                            addEventListener: () => { },
                            removeEventListener: () => { },
                            dispatchEvent: () => false,
                        }),
                    });
                });
            });

            for (const section of sections) {
                await test.step(`Check section: ${section.label}`, async () => {
                    const sectionLocator = page.locator(`#${section.id}`);
                    await sectionLocator.scrollIntoViewIfNeeded();
                    // Wait for unique content in the section
                    await expect(page.locator(section.uniqueSelector)).toBeVisible();
                    await page.waitForTimeout(3000); // Wait for all animations to fully stop
                    //await page.screenshot({ path: `screenshots/${viewport.name.replace(/ /g, '-')}/${section.id}-${viewport.name}.png`, fullPage: false });
                    await expect(page).toHaveScreenshot(`${viewport.name.replace(/ /g, '-')}-${section.id}-${viewport.name}.png`, { fullPage: false });

                });
            }

            // Portfolio: dynamically check all project titles
            await test.step('Check all project titles in Portfolio', async () => {
                const portfolioSection = page.locator('#portfolio');
                await portfolioSection.scrollIntoViewIfNeeded();
                // Wait for at least one project to be rendered
                const projectTitleLocators = page.locator('.project-box h3');
                await expect(projectTitleLocators.first()).toBeVisible();
                const count = await projectTitleLocators.count();
                const titles: string[] = [];
                for (let i = 0; i < count; i++) {
                    const title = await projectTitleLocators.nth(i).innerText();
                    titles.push(title);
                    await expect(projectTitleLocators.nth(i)).toBeVisible();
                }
                // eslint-disable-next-line no-console
                console.log(`[${viewport.name}] Found project titles:`, titles);
                await page.waitForTimeout(3000); // Wait for all animations to fully stop
                //await page.screenshot({ path: `screenshots/${viewport.name.replace(/ /g, '-')}/portfolio-projects-${viewport.name}.png`, fullPage: false });
                await expect(page).toHaveScreenshot(`${viewport.name.replace(/ /g, '-')}-portfolio-projects-${viewport.name}.png`, { fullPage: false });
            });
        });
    }
});





