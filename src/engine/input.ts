export interface InputState {
  keys: Set<string>;
  dispose(): void;
}

const TRACKED = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'KeyE', 'ShiftLeft', 'ShiftRight',
]);

export function createInput(target: Window = window): InputState {
  const keys = new Set<string>();
  const down = (e: KeyboardEvent) => {
    if (!TRACKED.has(e.code)) return;
    keys.add(e.code);
    e.preventDefault();
  };
  const up = (e: KeyboardEvent) => keys.delete(e.code);
  const blur = () => keys.clear();
  target.addEventListener('keydown', down);
  target.addEventListener('keyup', up);
  target.addEventListener('blur', blur);
  return {
    keys,
    dispose() {
      target.removeEventListener('keydown', down);
      target.removeEventListener('keyup', up);
      target.removeEventListener('blur', blur);
    },
  };
}

export function moveAxis(keys: Set<string>): { dx: number; dy: number } {
  const dx = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
  const dy = (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('KeyW') ? 1 : 0);
  if (dx && dy) return { dx: dx * Math.SQRT1_2, dy: dy * Math.SQRT1_2 };
  return { dx, dy };
}
