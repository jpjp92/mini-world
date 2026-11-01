'use client';

import dynamic from 'next/dynamic';

// 엔진은 브라우저 전용이라 SSR에서 불러오지 않아요.
const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false });

export default function GameRoot() {
  return <GameCanvas />;
}
