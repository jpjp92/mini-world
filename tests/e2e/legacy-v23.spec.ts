// v23 원본 기준 테스트: 로컬 전용. 원본은 저장소에 없으므로 V23_PATH 가 없으면 건너뛰어요.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

const v23 = process.env.V23_PATH ? resolve(process.env.V23_PATH) : '';
test.skip(!v23 || !existsSync(v23), 'V23_PATH 미설정 (로컬 전용 테스트)');

test('v23 원본이 오류 없이 뜨고 저장 키를 써요', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(pathToFileURL(v23).href);
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.some((k) => k.startsWith('minion-world-explorer-v2'))).toBe(true);
});
