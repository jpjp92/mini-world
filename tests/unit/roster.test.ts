import { describe, expect, it } from 'vitest';
import { DEFAULT_PLAYER_ID, getCharacter, normalizePlayerId, ROSTER } from '@/config/roster';

describe('roster', () => {
  it('12명, id 중복 없음', () => {
    expect(ROSTER).toHaveLength(12);
    expect(new Set(ROSTER.map((c) => c.id)).size).toBe(12);
  });

  it('v23 옛 id를 새 id로 바꿔요', () => {
    expect(normalizePlayerId('barca')).toBe('kicko');
    expect(normalizePlayerId('chelsea')).toBe('curvy');
    expect(normalizePlayerId('atletico')).toBe('atti');
  });

  it('모르는 값은 기본 캐릭터로', () => {
    expect(normalizePlayerId('nobody')).toBe(DEFAULT_PLAYER_ID);
    expect(normalizePlayerId(undefined)).toBe(DEFAULT_PLAYER_ID);
    expect(getCharacter('nobody').id).toBe(DEFAULT_PLAYER_ID);
  });
});
