// v23 상수 그대로 (W, H, T, regions)
export const WORLD_W = 1920;
export const WORLD_H = 1280;
export const TILE = 64;

export interface Region {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  arrival: { x: number; y: number };
}

export const REGIONS: Region[] = [
  { id: 'plaza', name: '바나나 중앙 광장', icon: '🌿', x: 960, y: 690, arrival: { x: 960, y: 760 } },
  { id: 'soccer', name: '챔피언스 축구 마을', icon: '⚽', x: 480, y: 360, arrival: { x: 500, y: 470 } },
  { id: 'racket', name: '선샤인 라켓 클럽', icon: '🎾', x: 490, y: 980, arrival: { x: 500, y: 1030 } },
  { id: 'racing', name: '에메랄드 코스트', icon: '🏊', x: 1430, y: 970, arrival: { x: 1400, y: 1050 } },
  { id: 'space', name: '스타라이트 연구소', icon: '🚀', x: 1450, y: 350, arrival: { x: 1450, y: 480 } },
];

export const PLAYER_START = { x: 960, y: 760 };
export const PLAYER_SPEED = 260; // px/s (Phase 1에서 v23 값과 맞춰요)
