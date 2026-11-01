// 게임 상태 스토어 (Zustand vanilla).
// 레거시 코드가 state 객체를 직접 바꾸기 때문에, 스토어는 같은 객체를 들고 있고
// 변경이 있을 때 rev 를 올려 구독자(React UI)에 알려요. 레거시 분리가 끝나면 불변 업데이트로 바꿔요.
import { createStore } from 'zustand/vanilla';
import { createDefaultState, type GameState } from './saveData';

export interface GameStore {
  game: GameState;
  /** 변경 카운터. 구독자는 이 값으로 다시 그려요. */
  rev: number;
  saveStatus: 'idle' | 'saved' | 'blocked';
  /** 상태 객체를 통째로 바꿀 때 (불러오기, 새로 시작) */
  replace(game: GameState): void;
  /** 상태 객체 안의 값을 직접 바꾼 뒤 호출 */
  touch(): void;
  setSaveStatus(status: GameStore['saveStatus']): void;
}

export const gameStore = createStore<GameStore>()((set) => ({
  game: createDefaultState(),
  rev: 0,
  saveStatus: 'idle',
  replace: (game) => set((s) => ({ game, rev: s.rev + 1 })),
  touch: () => set((s) => ({ rev: s.rev + 1 })),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
}));
