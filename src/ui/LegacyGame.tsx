'use client';

import { useEffect, useRef } from 'react';
import { importLegacySave, SAVE_KEY } from '@/config/legacy';
import { MARKUP } from '@/legacy/v23/markup';
import '@/legacy/v23/v23.css';

// v23 스크립트는 window/document에 리스너를 걸고 정리 함수가 없어요.
// 페이지당 한 번만 부팅해요 (StrictMode 이중 실행 방지).
let booted = false;

const imageBase = process.env.NEXT_PUBLIC_CHARACTER_BASE_URL?.replace(/\/$/, '');

export default function LegacyGame() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (booted || !ref.current) return;
    booted = true;
    importLegacySave(window.localStorage);
    import('@/legacy/v23/game.js').then(({ bootV23 }) => {
      bootV23({
        saveKey: SAVE_KEY,
        imageUrl: (id: string) => (imageBase ? `${imageBase}/${id}.webp` : ''),
      });
    });
  }, []);

  return <div ref={ref} className="legacy-root" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
