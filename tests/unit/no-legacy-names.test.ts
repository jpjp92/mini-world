// 공개 저장소 원칙(docs/plans/plan_2026-11-01.md §10): 원작·실제 구단 이름이 코드에 들어가지 않게 막아요.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';

const BANNED = /minion|미니언|바르샤|첼시|아틀레티|캄프 누|메트로폴리타노/i;
// 옛 id → 새 id 매핑은 저장 호환에 필요해서 예외
const ALLOW = new Set(['src/config/roster.ts', 'src/config/legacy.ts']);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

it('src/ 에 금지된 이름이 없어요', () => {
  const hits = walk('src')
    .filter((p) => !ALLOW.has(p.replaceAll('\\', '/')))
    .filter((p) => BANNED.test(readFileSync(p, 'utf8')));
  expect(hits).toEqual([]);
});
