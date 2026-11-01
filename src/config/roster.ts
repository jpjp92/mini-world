// v23 ROSTER에서 옮김. 실제 구단 연상 이름은 docs/plan_2026-11-01.md §9 기준으로 변경 (barca→kicko, chelsea→curvy, atletico→atti).
// 이미지(img)는 저장소에 넣지 않고 Storage URL로 불러와요. 없으면 도형 캐릭터로 그려요.

export type GameId =
  | 'soccer' | 'racket' | 'racing' | 'space'
  | 'cycling' | 'baseball' | 'freekick' | 'archery'
  | 'ski' | 'figure' | 'taekwondo';

export interface CharacterColors {
  body: string;
  outfit: string;
  accent?: string;
  hat?: string | null;
  stripes?: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  gameId: GameId | null;
  colors: CharacterColors;
}

export const ROSTER: Character[] = [
  { id: 'swimmer', name: '스위미', role: '코스트 챔피언', gameId: 'racing', colors: { body: '#facc15', outfit: '#dc2626', accent: '#fbbf24', hat: '#0284c7' } },
  { id: 'kicko', name: '킥코', role: '축구 코치', gameId: 'soccer', colors: { body: '#facc15', outfit: '#3f8f4a', stripes: '#f4d35e', accent: '#f59e0b' } },
  { id: 'curvy', name: '커비', role: '프리킥 코치', gameId: 'soccer', colors: { body: '#facc15', outfit: '#2a6f97', accent: '#38bdf8' } },
  { id: 'tennis', name: '테니', role: '테니스 코치', gameId: 'racket', colors: { body: '#facc15', outfit: '#f8fafc', accent: '#d97706', hat: '#ffffff' } },
  { id: 'baseball', name: '슬러거', role: '타격 코치', gameId: 'racket', colors: { body: '#facc15', outfit: '#1d4ed8', accent: '#92400e', hat: '#dc2626' } },
  { id: 'atti', name: '아띠', role: '섬 여행자', gameId: null, colors: { body: '#facc15', outfit: '#e07a5f', accent: '#3d405b' } },
  { id: 'astro', name: '아스트로', role: '우주 연구원', gameId: 'space', colors: { body: '#facc15', outfit: '#e2e8f0', accent: '#0284c7' } },
  { id: 'cyclist', name: '라이더', role: '사이클 코치', gameId: 'racing', colors: { body: '#facc15', outfit: '#1d4ed8', accent: '#ef4444', hat: '#f8fafc' } },
  { id: 'archer', name: '아처', role: '양궁 코치', gameId: 'archery', colors: { body: '#facc15', outfit: '#398c76' } },
  { id: 'skier', name: '스키', role: '스키 코치', gameId: 'ski', colors: { body: '#facc15', outfit: '#4984ac' } },
  { id: 'skater', name: '피겨', role: '피겨 코치', gameId: 'figure', colors: { body: '#facc15', outfit: '#e5e6e1' } },
  { id: 'taek', name: '태권', role: '태권도 코치', gameId: 'taekwondo', colors: { body: '#facc15', outfit: '#eee8d9' } },
];

export const DEFAULT_PLAYER_ID = 'atti';

// v2/v3 저장의 옛 id → 새 id
export const LEGACY_ID_MAP: Record<string, string> = {
  barca: 'kicko',
  chelsea: 'curvy',
  atletico: 'atti',
};

export function normalizePlayerId(id: unknown): string {
  if (typeof id !== 'string') return DEFAULT_PLAYER_ID;
  const mapped = LEGACY_ID_MAP[id] ?? id;
  return ROSTER.some((c) => c.id === mapped) ? mapped : DEFAULT_PLAYER_ID;
}

export function getCharacter(id: string): Character {
  return ROSTER.find((c) => c.id === id) ?? ROSTER.find((c) => c.id === DEFAULT_PLAYER_ID)!;
}
