import { expect, test } from '@playwright/test';

test('월드 캔버스가 뜨고 방향키로 움직여요', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/미니 월드/);
  const canvas = page.getByTestId('world-canvas');
  await expect(canvas).toBeVisible();

  const before = await canvas.screenshot();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(600);
  await page.keyboard.up('ArrowRight');
  const after = await canvas.screenshot();

  expect(before.equals(after)).toBe(false);
  expect(errors).toEqual([]);
});
