// v23 공통 그리기 헬퍼 (rr, ellipse, text)

export type Ctx = CanvasRenderingContext2D;

export function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fillStyle = fill;
  c.fill();
}

export function ellipse(c: Ctx, x: number, y: number, rx: number, ry: number, fill: string) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
}

export function text(c: Ctx, s: string, x: number, y: number, size: number, fill = '#4d5b3f') {
  c.font = `700 ${size}px "World Sans", system-ui, sans-serif`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillStyle = fill;
  c.fillText(s, x, y);
}
