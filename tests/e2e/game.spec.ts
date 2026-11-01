import { expect, test } from '@playwright/test';

test.describe('게임 (v23 레거시 모듈)', () => {
  test('오류 없이 뜨고, 이동하고, 새 키로 저장해요', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await expect(page.locator('.topbar h1')).toHaveText('미니 월드');
    const world = page.locator('#world');
    await expect(world).toBeVisible();
    await expect(page.locator('#playerName')).toHaveText('아띠');

    await world.click();
    const before = await world.screenshot();
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(700);
    await page.keyboard.up('ArrowRight');
    expect((await world.screenshot()).equals(before)).toBe(false);

    const keys = await page.evaluate(() => Object.keys(localStorage));
    expect(keys).toContain('mini-world-save');
    expect(errors).toEqual([]);
  });

  test('v23 옛 저장을 가져오고 옛 id를 바꿔요', async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.clear();
      localStorage.setItem(
        'minion-world-explorer-v2',
        JSON.stringify({
          version: 2, coins: 777, cp: 30, trophies: 0, char: 'atletico', island: 'banana',
          player: { x: 960, y: 760 }, levels: {}, friendship: { barca: 2 }, history: {},
          arcadeRecords: {}, questClaims: {}, quizDone: [], quizRecords: {}, discovered: ['plaza'],
          stamps: [], best: {}, decors: [], tutorial: 0, tutorialDone: true, sound: false, zoom: 1, weatherIdx: 0,
        }),
      );
    });
    await page.goto('/');
    await expect(page.locator('#coins')).toHaveText('777');
    await expect(page.locator('#playerName')).toHaveText('아띠');
    const saved = await page.evaluate(() => localStorage.getItem('mini-world-save') ?? '');
    expect(saved).not.toContain('atletico');
    expect(saved).toContain('"kicko"');
  });
});
