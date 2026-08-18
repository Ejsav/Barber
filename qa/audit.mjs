/* ============================================================================
 * QA AUDIT
 * ----------------------------------------------------------------------------
 * The checks behind the "Verified" section of the README, in one runnable
 * file. It drives the real production build in a real browser rather than
 * asserting against component internals, because the things it is looking for
 * — a console error, a page that scrolls sideways on a small phone, a heading
 * a screen reader cannot reach, a headline that does not paint until React
 * hydrates — only exist once everything is assembled.
 *
 *   npm run build
 *   npx next start -p 3100
 *   npm i --no-save playwright @axe-core/playwright     # not project deps
 *   node qa/audit.mjs
 *
 * Playwright and axe are deliberately NOT in package.json: they are ~50MB of
 * tooling for a site whose entire JavaScript payload is smaller than their
 * changelog, and nothing in the build depends on them.
 * ========================================================================== */

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = process.env.QA_BASE ?? 'http://localhost:3100';

const ROUTES = [
  '/', '/services', '/services/the-fade', '/barbers', '/barbers/marcus-reyes',
  '/work', '/find-your-cut', '/visit', '/reviews', '/faq', '/locations',
  '/locations/whitney-avenue', '/weddings', '/careers', '/privacy',
];

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-pro-max', width: 430, height: 932 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'desktop', width: 1440, height: 900 },
];

/** A mid-tier phone on a poor connection — the audience this site is for. */
const PHONE_PROFILE = {
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
  cpuRate: 4,
};

const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };

/** Scroll-triggered reveals must settle, or contrast is measured at opacity 0. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

/* -- 1. Console errors, overflow and status codes, every route × viewport --- */
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });
  for (const route of [...ROUTES, '/definitely-not-a-page']) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

    const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const expect404 = route === '/definitely-not-a-page';
    ok(
      res?.status() === (expect404 ? 404 : 200),
      `${vp.name} ${route}: status ${res?.status()}`,
    );

    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    ok(scrollW <= clientW + 1, `${vp.name} ${route}: scrolls sideways (${scrollW} > ${clientW})`);

    /* The 404 route's own 404 response is the point of the test. */
    if (!expect404) {
      ok(errors.length === 0, `${vp.name} ${route}: console — ${errors.slice(0, 2).join(' | ')}`);
    }
    await page.close();
  }
  await ctx.close();
}

/* -- 2. axe-core, WCAG 2.1 A/AA + best practice ---------------------------- */
for (const vp of [VIEWPORTS[0], VIEWPORTS[3]]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'reduce',
  });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await settle(page);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();
    for (const v of violations) {
      ok(false, `axe ${vp.name} ${route}: ${v.id} (${v.impact}) — ${v.nodes[0]?.target.join(' ')}`);
    }
    await page.close();
  }
  await ctx.close();
}

/* -- 3. Keyboard and interaction ------------------------------------------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const before = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--announce-h'));
  await page.getByRole('button', { name: 'Dismiss announcement' }).click();
  await page.waitForTimeout(200);
  const after = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--announce-h'));
  ok(before.trim() !== after.trim(), 'announcement height did not collapse on dismiss');

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(800);
  ok(await page.locator('#mobile-menu').isVisible(), 'mobile menu did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
  ok(!(await page.locator('#mobile-menu').count()), 'Escape did not close the mobile menu');

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
  await page.waitForTimeout(700);
  /* Scoped to the bar itself: the header carries its own phone link, hidden
   * at this width, and `.first()` would find that one instead. */
  const actionBar = page.locator('div.fixed.bottom-0 a[href^="tel:"]');
  ok(await actionBar.first().isVisible(), 'no tap-to-call in the mobile action bar');

  await page.locator('button:has-text("Book")').last().click();
  await page.waitForTimeout(900);
  ok(await page.locator('[role="dialog"][aria-modal="true"]').count() === 1, 'booking surface did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  ok(await page.locator('[role="dialog"]').count() === 0, 'booking surface did not close on Escape');
  await ctx.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(BASE + '/find-your-cut', { waitUntil: 'networkidle' });
  const tabs = page.locator('[role="tab"]');
  const count = await tabs.count();
  ok(count > 0, 'cut explorer rendered no looks');
  await tabs.first().focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(400);
  ok(await tabs.nth(1).getAttribute('aria-selected') === 'true', 'arrow keys do not move the explorer');
  await page.keyboard.press('End');
  await page.waitForTimeout(400);
  ok(await tabs.nth(count - 1).getAttribute('aria-selected') === 'true', 'End does not jump to the last look');

  await page.getByRole('button', { name: /Not sure what to book/i }).click();
  await page.waitForTimeout(300);
  const unsure = page.locator('button:has-text("The sides have got heavy")');
  ok(await unsure.isVisible(), 'the "not sure" branch did not expand');
  await unsure.click();
  await page.waitForTimeout(500);
  ok(await page.locator('text=That is weight, not length').count() > 0, 'no reason given for the recommendation');

  await page.goto(BASE + '/faq', { waitUntil: 'networkidle' });
  const question = page.getByRole('button', { name: /Do you take walk-ins/i });
  ok(await question.getAttribute('aria-expanded') === 'false', 'FAQ starts expanded');
  await question.click();
  await page.waitForTimeout(200);
  ok(await question.getAttribute('aria-expanded') === 'true', 'FAQ did not expand');

  await page.goto(BASE + '/reviews', { waitUntil: 'networkidle' });
  const all = await page.locator('main li figure').count();
  await page.getByRole('button', { name: 'Fade quality' }).click();
  await page.waitForTimeout(200);
  const filtered = await page.locator('main li figure').count();
  ok(filtered > 0 && filtered < all, `review filter did not narrow results (${all} → ${filtered})`);
  await ctx.close();
}

/* -- 4. Reduced motion must never leave content invisible ------------------ */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(900);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return false;
      return parseFloat(getComputedStyle(el).opacity) < 0.9;
    }).length);
  ok(hidden === 0, `${hidden} elements still hidden under reduced motion`);
  await ctx.close();
}

/* -- 5. Core Web Vitals on a throttled phone ------------------------------- */
console.log('\nCore Web Vitals — 4× CPU throttle, 1.6Mbps, 150ms RTT:');
for (const route of ['/', '/find-your-cut', '/services/the-fade', '/work', '/barbers/marcus-reyes']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const client = await ctx.newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', { offline: false, ...PHONE_PROFILE });
  await client.send('Emulation.setCPUThrottlingRate', { rate: PHONE_PROFILE.cpuRate });

  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  const v = await page.evaluate(() => new Promise((resolve) => {
    let lcp = 0, cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => {
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      resolve({ lcp: Math.round(lcp), cls: +cls.toFixed(4), fcp: Math.round(fcp?.startTime ?? 0) });
    }, 600);
  }));
  console.log(`  ${route.padEnd(26)} FCP ${String(v.fcp).padStart(4)}ms   LCP ${String(v.lcp).padStart(4)}ms   CLS ${v.cls}`);
  ok(v.lcp < 2500, `${route}: LCP ${v.lcp}ms is over the 2.5s threshold`);
  ok(v.cls < 0.1, `${route}: CLS ${v.cls} is over the 0.1 threshold`);
  await ctx.close();
}

await browser.close();

console.log('');
if (failures.length) {
  console.log(`${failures.length} problem(s):`);
  for (const f of failures) console.log('  · ' + f);
  process.exitCode = 1;
} else {
  console.log('All checks passed.');
}
