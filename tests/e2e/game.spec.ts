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

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('mini-world-save') ?? '{}'));
    expect(saved.version).toBe(4);
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

test('캐릭터 이미지가 없으면 SVG 초상화로 대체해요', async ({ page }) => {
  await page.route(/\.webp(\?.*)?$/, (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('#playerName')).toHaveText('아띠');
  const portrait = page.locator('#playerPortrait');
  await expect(portrait).toHaveAttribute('src', /^data:image\/svg\+xml/);
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLImageElement>('.legacy-root img')].filter((i) => i.complete && i.naturalWidth === 0).length,
  );
  expect(broken).toBe(0);
});

test('저장 → 다시 접속하면 같은 상태로 이어져요', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.locator('#coins')).toHaveText('120');
  await page.waitForFunction(() => localStorage.getItem('mini-world-save') !== null);
  const raw = JSON.parse((await page.evaluate(() => localStorage.getItem('mini-world-save')))!);
  await page.close();

  // 게임은 페이지를 떠날 때도 저장하므로, 다음 접속 직전에 저장을 바꿔 넣어요
  raw.coins = 4321;
  raw.stamps = ['soccer'];
  await context.addInitScript((data) => localStorage.setItem('mini-world-save', data), JSON.stringify(raw));
  const next = await context.newPage();
  await next.goto('/');
  await expect(next.locator('#coins')).toHaveText('4,321');
  const saved = await next.evaluate(() => JSON.parse(localStorage.getItem('mini-world-save')!));
  expect(saved.stamps).toEqual(['soccer']);
  expect(saved.version).toBe(4);
});
