'use client';

import { useEffect, useRef } from 'react';
import { DEFAULT_PLAYER_ID } from '@/config/roster';
import { startEngine } from '@/engine/engine';
import styles from './GameCanvas.module.css';

export default function GameCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const engine = startEngine({
      canvas: ref.current,
      playerId: DEFAULT_PLAYER_ID,
      imageBaseUrl: process.env.NEXT_PUBLIC_CHARACTER_BASE_URL,
    });
    return () => engine.stop();
  }, []);

  return <canvas ref={ref} className={styles.canvas} data-testid="world-canvas" aria-label="미니 월드" />;
}
