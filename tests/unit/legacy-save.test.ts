import { describe, expect, it } from 'vitest';
import { importLegacySave, LEGACY_SAVE_KEY, renameLegacyIds, SAVE_KEY } from '@/config/legacy';

function memoryStorage(init: Record<string, string> = {}): Storage {
  const m = new Map(Object.entries(init));
  return {
    get length() { return m.size; },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

describe('v23 저장 가져오기', () => {
  it('옛 id를 키와 값 모두 바꿔요', () => {
    const raw = JSON.stringify({ char: 'atletico', friendship: { barca: 2, chelsea: 1 }, quizDone: ['atletico'] });
    const out = JSON.parse(renameLegacyIds(raw));
    expect(out).toEqual({ char: 'atti', friendship: { kicko: 2, curvy: 1 }, quizDone: ['atti'] });
  });

  it('새 키가 비어 있을 때만 가져오고, 옛 키는 남겨요', () => {
    const s = memoryStorage({ [LEGACY_SAVE_KEY]: '{"char":"barca"}', [LEGACY_SAVE_KEY + '-backup']: '{"char":"chelsea"}' });
    expect(importLegacySave(s)).toBe(true);
    expect(s.getItem(SAVE_KEY)).toBe('{"char":"kicko"}');
    expect(s.getItem(SAVE_KEY + '-backup')).toBe('{"char":"curvy"}');
    expect(s.getItem(LEGACY_SAVE_KEY)).not.toBeNull();
  });

  it('새 저장이 있으면 덮어쓰지 않아요', () => {
    const s = memoryStorage({ [SAVE_KEY]: '{"coins":1}', [LEGACY_SAVE_KEY]: '{"coins":999}' });
    expect(importLegacySave(s)).toBe(false);
    expect(s.getItem(SAVE_KEY)).toBe('{"coins":1}');
  });
});
