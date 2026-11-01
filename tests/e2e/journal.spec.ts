import { expect, test } from '@playwright/test';

const seed = (save: string) => localStorage.setItem('mini-world-save', save);

test.describe('모험 노트 (React)', () => {
  test('미션·심부름·여권이 저장 상태대로 보이고 보상을 받으면 반영돼요', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(
      seed,
      JSON.stringify({ version: 4, coins: 100, cp: 30, stamps: ['space'], tutorial: 1, history: { banana: 3 }, sound: false }),
    );
    await page.goto('/');

    const journal = page.locator('#journalMount');
    await expect(journal.getByRole('heading', { name: '우리, 먼저 인사할까요?' })).toBeVisible();
    await expect(journal.getByText('1 / 11')).toBeVisible();

    const tabs = journal.getByRole('tab');
    await expect(tabs).toHaveText(['심부름', '꾸미기', '업그레이드']);
    await expect(journal.getByRole('tab', { name: '심부름' })).toHaveAttribute('aria-selected', 'true');

    // 킥코 심부름: 바나나 3번 채집 → 보상 받기 가능
    const kicko = journal.locator('[data-npc="kicko"]');
    await expect(kicko).toHaveText('보상 받기');
    await kicko.click();
    await expect(page.locator('#coins')).toHaveText('145');
    await expect(journal.locator('[data-quest-wait="kicko"]')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('꾸미기 탭에서 가구를 고르고 회수 모드로 바꿀 수 있어요', async ({ page }) => {
    await page.addInitScript(seed, JSON.stringify({ version: 4, tutorial: 5, tutorialDone: true, sound: false }));
    await page.goto('/');
    const journal = page.locator('#journalMount');
    await journal.getByRole('tab', { name: '꾸미기' }).click();
    await expect(journal.getByRole('tab', { name: '꾸미기' })).toHaveAttribute('aria-selected', 'true');

    const bench = journal.locator('[data-decor="bench"]');
    await bench.click();
    await expect(bench).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#decorBanner')).toBeVisible();

    const remove = journal.locator('#removeFurniture');
    await remove.click();
    await expect(remove).toHaveAttribute('aria-pressed', 'true');
    await expect(bench).toHaveAttribute('aria-pressed', 'false');
  });

  test('업그레이드 미리보기와 기록 수첩을 열어요', async ({ page }) => {
    await page.addInitScript(seed, JSON.stringify({ version: 4, tutorial: 5, tutorialDone: true, sound: false }));
    await page.goto('/');
    const journal = page.locator('#journalMount');
    await journal.getByRole('tab', { name: '업그레이드' }).click();
    await expect(journal.locator('[data-upgrade-preview]')).toHaveCount(4);
    await journal.locator('[data-upgrade-preview="soccer"]').click();
    await expect(page.locator('#modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).toBeHidden();

    await journal.locator('#plazaOverviewBtn').click();
    await expect(page.locator('#modal')).toBeVisible();
  });
});
