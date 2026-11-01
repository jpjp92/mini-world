import type { Character } from '@/config/roster';
import { ellipse, rr, text, type Ctx } from '@/engine/draw';

export type Dir = 'left' | 'right' | 'up' | 'down';

// v23 drawCharacter 기준. 이미지가 없으면 도형 캐릭터로 그려요.
export function drawCharacter(
  c: Ctx,
  n: Character,
  img: HTMLImageElement | undefined,
  x: number,
  y: number,
  size: number,
  dir: Dir,
  walking: boolean,
  now: number,
  isPlayer = false,
  label = false,
) {
  const bob = Math.sin(now * (walking ? 11 : 2.8) + (isPlayer ? 0 : x)) * (walking ? 3 : 1.3);
  ellipse(c, x, y + 3, size * 0.27, size * 0.085, '#33583a2b');
  if (isPlayer) {
    c.strokeStyle = '#fff5ba';
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(x, y + 2, size * 0.32, size * 0.11, 0, 0, Math.PI * 2);
    c.stroke();
  }
  c.save();
  c.translate(x, y - size * 0.49 + bob);
  if (dir === 'left') c.scale(-1, 1);
  if (walking) c.rotate(Math.sin(now * 11) * 0.025);
  if (img?.complete && img.naturalWidth) {
    c.drawImage(img, -size / 2, -size * 0.52, size, size);
  } else {
    rr(c, -size * 0.2, -size * 0.38, size * 0.4, size * 0.65, size * 0.2, n.colors.body);
    rr(c, -size * 0.23, -size * 0.19, size * 0.46, size * 0.13, 5, '#b3bdb6');
    ellipse(c, -size * 0.08, -size * 0.12, size * 0.07, size * 0.06, '#fff');
    ellipse(c, size * 0.08, -size * 0.12, size * 0.07, size * 0.06, '#fff');
    rr(c, -size * 0.2, size * 0.06, size * 0.4, size * 0.21, 5, n.colors.outfit);
  }
  c.restore();
  if (label) {
    const w = Math.min(180, n.name.length * 10 + 18);
    rr(c, x - w / 2, y - size - 23, w, 22, 9, isPlayer ? '#fff3c9ee' : '#fffdf1ed');
    text(c, n.name, x, y - size - 12, 10, isPlayer ? '#7b6a3b' : '#627052');
  }
}
