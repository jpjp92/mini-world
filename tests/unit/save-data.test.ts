import { describe, expect, it } from 'vitest';
import { createDefaultState, sanitizeSave, SAVE_VERSION, serializeSave, type SanitizeDeps } from '@/store/saveData';

const deps: SanitizeDeps = {
  normalizeChar: (id) => (id === 'kicko' ? 'kicko' : 'atti'),
  cleanQuizRecords: () => ({}),
  now: 1_000_000,
};

describe('saveData', () => {
  it('기본 상태: v23 기본값 + 버전 4', () => {
    const d = createDefaultState();
    expect(d.version).toBe(SAVE_VERSION);
    expect([d.coins, d.cp, d.trophies]).toEqual([120, 30, 0]);
    expect(Object.keys(d.levels)).toHaveLength(11);
    expect(Object.keys(d.friendship)).toHaveLength(12);
    expect(d.decors).toHaveLength(7);
  });

  it('v2·v3·v4 저장을 받고, 그 밖의 버전은 거부해요', () => {
    for (const version of [2, 3, 4]) expect(() => sanitizeSave({ version }, deps)).not.toThrow();
    expect(() => sanitizeSave({ version: 1 }, deps)).toThrow();
    expect(() => sanitizeSave(null, deps)).toThrow();
  });

  it('범위 밖 값을 정리해요', () => {
    const { state } = sanitizeSave(
      {
        version: 2, coins: 12.7, cp: -5, island: 'nowhere', char: 'kicko',
        levels: { soccer: 9, racket: 0 }, friendship: { kicko: 99999 },
        stamps: ['soccer', 'soccer', 'fake'], discovered: ['soccer', 'fake'],
        decors: [{ id: 'flower', x: 500, y: 500 }, { id: 'flower', x: 10, y: 10 }, { id: 'nope', x: 500, y: 500 }],
        zoom: 9, player: { x: -100, y: 99999 },
        arcadeRecords: { 'soccer:1:normal': { best: 50.9 }, 'bad:9:x': { best: 1 } },
      },
      deps,
    );
    expect(state.coins).toBe(12);
    expect(state.cp).toBe(30);
    expect(state.island).toBe('banana');
    expect(state.char).toBe('kicko');
    expect(state.levels.soccer).toBe(3);
    expect(state.levels.racket).toBe(1);
    expect(state.friendship.kicko).toBe(9999);
    expect(state.stamps).toEqual(['soccer']);
    expect(state.discovered).toEqual(['plaza', 'soccer']);
    expect(state.decors.filter((d) => (d.island ?? 'banana') === 'banana')).toEqual([{ id: 'flower', x: 500, y: 500, island: 'banana' }]);
    expect(state.zoom).toBe(1.4);
    expect(state.player).toEqual({ x: 180, y: 1140 });
    expect(state.arcadeRecords).toEqual({ 'soccer:1:normal': { best: 50, plays: 0, wins: 0, maxCombo: 0, lastScore: 0 } });
  });

  it('직렬화 → 다시 불러오기가 같은 상태를 만들어요', () => {
    const d = createDefaultState();
    d.coins = 777;
    d.stamps = ['space'];
    const raw = serializeSave(d, { tree0: 5 }, { 'decor:1': 2_000_000, 'decor:old': 1 }, 1_000_000);
    const parsed = JSON.parse(raw);
    expect(parsed.version).toBe(4);
    expect(parsed.decorCooldowns).toEqual({ 'decor:1': 2_000_000 });
    const back = sanitizeSave(parsed, deps);
    // v23과 같게, 불러올 때 장식에 island 가 채워져요
    expect(back.state).toEqual({ ...d, decors: d.decors.map((v) => ({ ...v, island: v.island ?? 'banana' })) });
    expect(back.cooldowns).toEqual({ tree0: 5 });
    expect(back.decorCooldowns).toEqual({ 'decor:1': 1_020_000 });
  });
});
