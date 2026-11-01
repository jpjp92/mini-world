// Phase 0 엔진 셸: rAF 루프, 입력, 카메라, 월드 배경, 플레이어 이동.
// React 밖에서 돌고, React는 start/stop만 호출해요.
import { getCharacter, ROSTER } from '@/config/roster';
import { PLAYER_SPEED, PLAYER_START, REGIONS, WORLD_H, WORLD_W } from '@/config/world';
import { drawCharacter, type Dir } from '@/world/character';
import { ellipse, rr, text } from './draw';
import { createInput, moveAxis } from './input';

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  playerId: string;
  imageBaseUrl?: string;
}

export interface Engine {
  stop(): void;
}

export function startEngine({ canvas, playerId, imageBaseUrl }: EngineOptions): Engine {
  const ctx = canvas.getContext('2d')!;
  const input = createInput();
  const images = loadImages(imageBaseUrl);
  const player = { x: PLAYER_START.x, y: PLAYER_START.y, dir: 'down' as Dir, walking: false };
  const camera = { x: player.x, y: player.y };
  const view = { w: 0, h: 0, dpr: 1 };

  const resize = () => {
    view.dpr = Math.min(2, window.devicePixelRatio || 1);
    view.w = canvas.clientWidth;
    view.h = canvas.clientHeight;
    canvas.width = Math.round(view.w * view.dpr);
    canvas.height = Math.round(view.h * view.dpr);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let raf = 0;
  let last = performance.now();
  const frame = (t: number) => {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    update(dt);
    draw(t / 1000);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  function update(dt: number) {
    const { dx, dy } = moveAxis(input.keys);
    player.walking = dx !== 0 || dy !== 0;
    if (player.walking) {
      player.x = clamp(player.x + dx * PLAYER_SPEED * dt, 40, WORLD_W - 40);
      player.y = clamp(player.y + dy * PLAYER_SPEED * dt, 60, WORLD_H - 40);
      player.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
    }
    const halfW = view.w / 2, halfH = view.h / 2;
    const tx = clamp(player.x, Math.min(halfW, WORLD_W / 2), Math.max(WORLD_W - halfW, WORLD_W / 2));
    const ty = clamp(player.y, Math.min(halfH, WORLD_H / 2), Math.max(WORLD_H - halfH, WORLD_H / 2));
    camera.x += (tx - camera.x) * Math.min(1, dt * 8);
    camera.y += (ty - camera.y) * Math.min(1, dt * 8);
  }

  function draw(now: number) {
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    ctx.fillStyle = '#9fd3e0';
    ctx.fillRect(0, 0, view.w, view.h);
    ctx.save();
    ctx.translate(Math.round(view.w / 2 - camera.x), Math.round(view.h / 2 - camera.y));

    // 임시 섬 바닥 (Phase 1에서 v23 ground로 교체)
    rr(ctx, 60, 60, WORLD_W - 120, WORLD_H - 140, 120, '#cfe3a8');
    rr(ctx, 120, 120, WORLD_W - 240, WORLD_H - 260, 100, '#b9d98e');

    for (const r of REGIONS) {
      ellipse(ctx, r.x, r.y, 120, 70, '#e8efc9');
      text(ctx, r.icon, r.x, r.y - 10, 34);
      text(ctx, r.name, r.x, r.y + 34, 14, '#5c6b45');
    }

    // NPC 자리 표시: 종목 코치들을 지역 주변에 배치
    const coaches = ROSTER.filter((c) => c.id !== playerId).slice(0, 4);
    REGIONS.slice(1).forEach((r, i) => {
      const n = coaches[i];
      if (n) drawCharacter(ctx, n, images.get(n.id), r.arrival.x + 70, r.arrival.y, 58, 'down', false, now, false, true);
    });

    drawCharacter(ctx, getCharacter(playerId), images.get(playerId), player.x, player.y, 64, player.dir, player.walking, now, true, true);
    ctx.restore();
  }

  return {
    stop() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      input.dispose();
    },
  };
}

function loadImages(base?: string) {
  const map = new Map<string, HTMLImageElement>();
  if (!base) return map;
  for (const c of ROSTER) {
    const img = new Image();
    img.decoding = 'async';
    img.src = `${base.replace(/\/$/, '')}/${c.id}.webp`;
    map.set(c.id, img);
  }
  return map;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
