import { expect, test } from '@playwright/test';

const seed = (save: string) => localStorage.setItem('mini-world-save', save);

test.describe('월드 아래 영역 (React)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(seed, JSON.stringify({ version: 4, tutorial: 5, tutorialDone: true, sound: false }));
    await page.goto('/');
    await expect(page.locator('#playerName')).toHaveText('아띠');
  });

  test('내 캐릭터 카드로 캐릭터 선택 창을 열어요', async ({ page }) => {
    await page.locator('#characterBtn').click();
    await expect(page.locator('#modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#characterBtn')).toBeFocused();
  });

  test('섬 여행·섬 지도 버튼이 각각 창을 열어요', async ({ page }) => {
    for (const id of ['#ferryBtn', '#travelBtn']) {
      await page.locator(id).click();
      await expect(page.locator('#modal')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#modal')).toBeHidden();
    }
  });

  test('꾸미기 버튼으로 꾸미기 모드를 켜고 끄며, 모험 노트 탭과 함께 바뀌어요', async ({ page }) => {
    const btn = page.locator('#decorateBtn');
    await expect(btn).toHaveText('🪴 꾸미기');
    await btn.click();
    await expect(btn).toHaveText('✓ 꾸미기 종료');
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#decorBanner')).toBeVisible();
    await expect(page.locator('#journalMount').getByRole('tab', { name: '꾸미기' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-decor="flower"]')).toHaveAttribute('aria-pressed', 'true');

    await btn.click();
    await expect(btn).toHaveText('🪴 꾸미기');
    await expect(page.locator('#decorBanner')).toBeHidden();
  });
});
