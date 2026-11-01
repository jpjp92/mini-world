import { expect, test } from '@playwright/test';

test('효과음·도움말은 v23처럼 설정 화면에서 쓰고, 헤더 상태와 동기화돼요', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');

  // v23 디자인: 헤더의 효과음·도움말 버튼은 숨김 (#audioBtn,#helpBtn{display:none})
  const audio = page.locator('#audioBtn');
  await expect(audio).toBeHidden();
  await expect(page.locator('#helpBtn')).toBeHidden();
  await expect(audio).toHaveAttribute('aria-pressed', 'true');

  const settings = page.getByRole('button', { name: '설정과 저장', exact: true });
  await expect(settings).toBeEnabled();
  await settings.click();
  await expect(page.locator('#soundToggle')).toHaveText('효과음 · 켜짐');
  await page.locator('#soundToggle').click();
  await expect(page.locator('#soundToggle')).toHaveText('효과음 · 꺼짐');
  await expect(audio).toHaveAttribute('aria-pressed', 'false');
  await expect(audio).toHaveText('♩');
  await page.locator('#saveNow').click();
  await expect(page.locator('#saveStatus')).toHaveText('✓ 자동 저장됨');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('mini-world-save')!).sound)).toBe(false);

  await page.locator('#modalClose').click();
  await expect(settings).toBeFocused();

  // 도움말은 설정 화면 안에서 열어요 (v23 동작: 닫으면 모달이 사라지고 포커스는 설정 화면에서 연 요소로 돌아가요)
  await settings.click();
  await page.locator('#openHelp').click();
  await expect(page.locator('#modalTitle')).toHaveText('간단 도움말');
  await page.keyboard.press('Escape');
  await expect(page.locator('#modal')).toBeHidden();
  expect(errors).toEqual([]);
});

test('저장된 재화를 표시하고 새 모험을 시작하면 헤더도 초기화해요', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mini-world-save', JSON.stringify({
      version: 4, coins: 4321, cp: 987, trophies: 1234, sound: false,
      tutorial: 5, tutorialDone: true,
    }));
  });
  await page.goto('/');
  await expect(page.locator('#coins')).toHaveText('4,321');
  await expect(page.locator('#cp')).toHaveText('987');
  await expect(page.locator('#trophies')).toHaveText('1,234');
  await expect(page.locator('#audioBtn')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: '설정과 저장', exact: true }).click();
  await page.locator('#resetSave').click();
  await page.locator('#resetSave').click();
  await expect(page.locator('#coins')).toHaveText('120');
  await expect(page.locator('#cp')).toHaveText('30');
  await expect(page.locator('#trophies')).toHaveText('0');
  await expect(page.locator('#audioBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#saveStatus')).toHaveText('✓ 자동 저장됨');
});

test('저장 실패를 헤더와 설정에 표시해요', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#saveStatus')).toHaveText('✓ 자동 저장됨');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'mini-world-save') throw new DOMException('저장 공간 부족', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: '설정과 저장', exact: true }).click();
  await page.locator('#saveNow').click();
  await expect(page.locator('#saveStatus')).toHaveText('저장 불가 · 설정에서 내보내기');
  await expect(page.locator('#settingsMessage')).toContainText('저장이 차단되어 있어요.');
});

test('경기 시작으로 CP를 사용하면 헤더에 즉시 반영해요', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mini-world-save', JSON.stringify({
      version: 4, player: { x: 350, y: 470 }, sound: false,
      tutorial: 5, tutorialDone: true,
    }));
  });
  await page.goto('/');
  await expect(page.locator('#audioBtn')).toBeEnabled();
  await page.locator('#world').focus();
  await page.keyboard.press('KeyE');
  await page.locator('#npcGame').click();
  await page.locator('#startGame').click();
  await expect(page.locator('#cp')).toHaveText('30');
  await page.locator('#beginArcade').click();
  await expect(page.locator('#cp')).toHaveText('20');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('mini-world-save')!).cp)).toBe(20);
});
