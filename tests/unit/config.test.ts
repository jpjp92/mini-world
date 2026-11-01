import { describe, expect, it } from 'vitest';
import { GAMES, INTRO_GUIDES, LEVEL_CHALLENGES, STATION_LOOKS, TIER_FEATURES } from '@/config/games';
import { ISLANDS, REGIONS, STATIONS } from '@/config/islands';
import { ROSTER } from '@/config/roster';

const ids = Object.keys(GAMES);

describe('config', () => {
  it('11종목, 섬별 4·4·3', () => {
    expect(ids).toHaveLength(11);
    const count = (i: string) => ids.filter((id) => (GAMES[id as keyof typeof GAMES].island ?? 'banana') === i).length;
    expect([count('banana'), count('cove'), count('snow')]).toEqual([4, 4, 3]);
  });

  it('v23 밸런스 값 유지 (샘플)', () => {
    expect(GAMES.soccer.targets).toEqual([100, 170, 260]);
    expect(GAMES.soccer.champTarget).toBe(360);
    expect(GAMES.racing.targets).toEqual([450, 600, 750]);
  });

  it('종목별 부가 데이터가 빠짐없이 있어요', () => {
    for (const table of [TIER_FEATURES, LEVEL_CHALLENGES, INTRO_GUIDES, STATION_LOOKS]) {
      expect(Object.keys(table).sort()).toEqual([...ids].sort());
    }
  });

  it('스테이션은 종목·NPC와 연결돼요', () => {
    expect(STATIONS).toHaveLength(11);
    for (const s of STATIONS) {
      expect(ids).toContain(s.gameId);
      expect(ROSTER.map((c) => c.id)).toContain(s.npcId);
    }
  });

  it('섬 3개, 지역 id 중복 없음', () => {
    expect(Object.keys(ISLANDS)).toEqual(['banana', 'cove', 'snow']);
    expect(new Set(REGIONS.map((r) => r.id)).size).toBe(REGIONS.length);
  });
});
