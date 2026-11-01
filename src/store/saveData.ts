// 저장 데이터: 기본값, 불러온 저장 검사·정리, 직렬화.
// v23 load()/defaults()/serializeSave() 규칙을 그대로 옮겼어요. 브라우저 API에 의존하지 않아요.
import { DECOR_CATALOG } from '@/config/decor';
import { GAMES } from '@/config/games';
import { ISLANDS, REGIONS, WEATHER_MODES, type IslandId } from '@/config/islands';
import { DEFAULT_PLAYER_ID, ROSTER } from '@/config/roster';
import { WORLD_H, WORLD_W } from '@/config/world';

export const SAVE_VERSION = 4;
/** v23은 2·3을 썼어요. 형식은 같고 버전 표시만 4로 올렸어요. */
export const ACCEPTED_VERSIONS = [2, 3, 4];

export interface Placed { id: string; x: number; y: number; island?: IslandId }
export interface ArcadeRecord { best: number; plays: number; wins: number; maxCombo: number; lastScore: number }
export interface QuestClaim { at: number; base: number }
export interface QuizRecord { best: number; rounds: number; claimed: boolean; mastered: string[]; recent: string[] }

export const HISTORY_KEYS = ['banana', 'shell', 'star', 'decor', 'talk', 'any_harvest', 'played', 'passed', 'decor_use'] as const;
export type HistoryKey = (typeof HISTORY_KEYS)[number];

export interface GameState {
  version: number;
  coins: number;
  cp: number;
  trophies: number;
  char: string;
  coveIntroduced: boolean;
  snowIntroduced: boolean;
  island: IslandId;
  player: { x: number; y: number };
  levels: Record<string, number>;
  friendship: Record<string, number>;
  history: Record<HistoryKey, number>;
  arcadeRecords: Record<string, ArcadeRecord>;
  questClaims: Record<string, QuestClaim>;
  quizDone: string[];
  quizRecords: Record<string, QuizRecord>;
  discovered: string[];
  stamps: string[];
  best: Record<string, number>;
  decors: Placed[];
  tutorial: number;
  tutorialDone: boolean;
  sound: boolean;
  zoom: number;
  weatherIdx: number;
  savedAt: number;
}

const GAME_IDS = Object.keys(GAMES);
const ROSTER_IDS = ROSTER.map((c) => c.id);

const DEFAULT_DECORS: Placed[] = [
  { id: 'flower', x: 850, y: 680 },
  { id: 'lamp', x: 1080, y: 830 },
  { id: 'bench', x: 865, y: 850 },
  { id: 'bench', x: 690, y: 1000, island: 'cove' },
  { id: 'hammock', x: 535, y: 1070, island: 'cove' },
  { id: 'bench', x: 690, y: 1010, island: 'snow' },
  { id: 'lamp', x: 550, y: 980, island: 'snow' },
];

export function createDefaultState(): GameState {
  return {
    version: SAVE_VERSION,
    coins: 120,
    cp: 30,
    trophies: 0,
    char: DEFAULT_PLAYER_ID,
    coveIntroduced: true,
    snowIntroduced: true,
    island: 'banana',
    player: { x: 960, y: 760 },
    levels: Object.fromEntries(GAME_IDS.map((id) => [id, 1])),
    friendship: Object.fromEntries(ROSTER_IDS.map((id) => [id, 1])),
    history: Object.fromEntries(HISTORY_KEYS.map((k) => [k, 0])) as Record<HistoryKey, number>,
    arcadeRecords: {},
    questClaims: {},
    quizDone: [],
    quizRecords: {},
    discovered: ['plaza'],
    stamps: [],
    best: {},
    decors: DEFAULT_DECORS.map((d) => ({ ...d })),
    tutorial: 0,
    tutorialDone: false,
    sound: true,
    zoom: 1,
    weatherIdx: 0,
    savedAt: 0,
  };
}

/** 레거시 쪽 규칙이 필요한 부분 (캐릭터 해금, 퀴즈 문제 은행)은 주입받아요. */
export interface SanitizeDeps {
  normalizeChar(id: unknown): string;
  cleanQuizRecords(raw: unknown, quizDone: string[]): Record<string, QuizRecord>;
  now?: number;
}

export interface LoadedSave {
  state: GameState;
  /** 나무·채집물 재생성 시각 (id → ms) */
  cooldowns: Record<string, number>;
  decorCooldowns: Record<string, number>;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
const islandOf = (o: { island?: unknown }): IslandId => (typeof o.island === 'string' && o.island in ISLANDS ? (o.island as IslandId) : 'banana');

const ARCADE_KEY = new RegExp(`^(${GAME_IDS.join('|')}):[123]:(normal|champ)$`);

export function cleanArcadeRecords(raw: unknown): Record<string, ArcadeRecord> {
  const out: Record<string, ArcadeRecord> = {};
  if (!isObj(raw)) return out;
  for (const [key, r] of Object.entries(raw)) {
    if (!ARCADE_KEY.test(key) || !isObj(r)) continue;
    const n = (f: string) => Math.max(0, Math.floor(Number(r[f]) || 0));
    out[key] = { best: n('best'), plays: n('plays'), wins: n('wins'), maxCombo: n('maxCombo'), lastScore: n('lastScore') };
  }
  return out;
}

/** 버전이 맞지 않거나 객체가 아니면 예외를 던져요. 나머지 값은 범위를 맞춰 정리해요. */
export function sanitizeSave(raw: unknown, deps: SanitizeDeps): LoadedSave {
  if (!isObj(raw) || !ACCEPTED_VERSIONS.includes(raw.version as number)) throw new Error('버전 불일치');
  const s = raw;
  const now = deps.now ?? Date.now();
  const d = createDefaultState();

  d.island = typeof s.island === 'string' && s.island in ISLANDS ? (s.island as IslandId) : 'banana';
  for (const k of ['coins', 'cp', 'trophies'] as const) {
    const v = s[k];
    if (typeof v === 'number' && Number.isFinite(v) && v >= 0) d[k] = Math.floor(v);
  }
  d.char = deps.normalizeChar(s.char);
  d.arcadeRecords = cleanArcadeRecords(s.arcadeRecords);

  const levels = isObj(s.levels) ? s.levels : {};
  const best = isObj(s.best) ? s.best : {};
  for (const id of GAME_IDS) {
    d.levels[id] = clamp(Math.floor(Number(levels[id]) || 1), 1, 3);
    const b = best[id];
    if (typeof b === 'number' && Number.isFinite(b)) d.best[id] = Math.max(0, b);
  }
  const history = isObj(s.history) ? s.history : {};
  for (const k of HISTORY_KEYS) d.history[k] = Math.max(0, Number(history[k]) || 0);
  const friendship = isObj(s.friendship) ? s.friendship : {};
  for (const id of ROSTER_IDS) d.friendship[id] = clamp(Number(friendship[id]) || 1, 1, 9999);

  d.discovered = [...new Set(['plaza', ...asArray(s.discovered).filter((id): id is string => REGIONS.some((r) => r.id === id))])];
  d.stamps = [...new Set(asArray(s.stamps).filter((id): id is string => typeof id === 'string' && id in GAMES))];
  d.quizDone = asArray(s.quizDone).filter((id): id is string => ROSTER_IDS.includes(id as string));
  d.quizRecords = deps.cleanQuizRecords(s.quizRecords, d.quizDone);

  if (Array.isArray(s.decors)) {
    d.decors = s.decors.filter(
      (v): v is Placed =>
        isObj(v) && DECOR_CATALOG.some((c) => c.id === v.id) &&
        Number.isFinite(v.x) && Number.isFinite(v.y) &&
        (v.x as number) > 170 && (v.x as number) < WORLD_W - 170 &&
        (v.y as number) > 160 && (v.y as number) < WORLD_H - 120,
    );
  }
  d.decors = d.decors.map((v) => ({ ...v, island: islandOf(v) }));
  if (!s.coveIntroduced && !d.decors.some((v) => v.island === 'cove')) d.decors.push(...DEFAULT_DECORS.filter((v) => v.island === 'cove').map((v) => ({ ...v })));
  if (!s.snowIntroduced && !d.decors.some((v) => v.island === 'snow')) d.decors.push(...DEFAULT_DECORS.filter((v) => v.island === 'snow').map((v) => ({ ...v })));

  if (isObj(s.questClaims)) {
    for (const id of ROSTER_IDS) {
      const q = s.questClaims[id];
      if (isObj(q)) d.questClaims[id] = { at: Math.max(0, Number(q.at) || 0), base: Math.max(0, Number(q.base) || 0) };
    }
  }

  const decorCooldowns: Record<string, number> = {};
  if (isObj(s.decorCooldowns)) {
    for (const [k, v] of Object.entries(s.decorCooldowns)) if (Number(v) > now) decorCooldowns[k] = Math.min(now + 20000, Number(v));
  }

  d.tutorial = clamp(Number(s.tutorial) || 0, 0, 5);
  d.tutorialDone = Boolean(s.tutorialDone);
  d.sound = s.sound !== false;
  d.zoom = clamp(Number(s.zoom) || 1, 0.7, 1.4);
  d.weatherIdx = clamp(Number(s.weatherIdx) || 0, 0, WEATHER_MODES.length - 1);
  const p = isObj(s.player) ? s.player : {};
  if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
    d.player = { x: clamp(p.x as number, 180, WORLD_W - 180), y: clamp(p.y as number, 180, WORLD_H - 140) };
  }

  const cooldowns: Record<string, number> = {};
  if (isObj(s.cooldowns)) for (const [k, v] of Object.entries(s.cooldowns)) cooldowns[k] = Number(v) || 0;

  return { state: d, cooldowns, decorCooldowns };
}

export function serializeSave(state: GameState, cooldowns: Record<string, number>, decorCooldowns: Record<string, number>, now = Date.now(), space?: number): string {
  const activeDecor = Object.fromEntries(Object.entries(decorCooldowns).filter(([, v]) => v > now));
  return JSON.stringify({ ...state, version: SAVE_VERSION, cooldowns, decorCooldowns: activeDecor }, null, space);
}
