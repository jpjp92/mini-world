'use client';

import { useEffect, useRef } from 'react';
import { importLegacySave, SAVE_KEY } from '@/config/legacy';
import { MARKUP } from '@/legacy/v23/markup';
import { characterIdFromSrc, portraitDataUrl } from '@/world/portrait';
import '@/legacy/v23/v23.css';
import './result-card.css';

// v23 스크립트는 window/document에 리스너를 걸고 정리 함수가 없어요.
// 페이지당 한 번만 부팅해요 (StrictMode 이중 실행 방지).
let booted = false;

const imageBase = process.env.NEXT_PUBLIC_CHARACTER_BASE_URL?.replace(/\/$/, '');

export default function LegacyGame() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (booted || !root) return;
    booted = true;
    // 캐릭터 이미지가 없거나 못 불러오면 SVG 초상화로 바꿔요. (캔버스는 도형 캐릭터로 따로 대체돼요)
    root.addEventListener(
      'error',
      (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement) || img.dataset.fallback) return;
        const id = img.dataset.char ?? characterIdFromSrc(img.src);
        if (!id) return;
        img.dataset.fallback = '1';
        img.src = portraitDataUrl(id);
      },
      true,
    );
    importLegacySave(window.localStorage);
    import('@/legacy/v23/game.js').then(({ bootV23 }) => {
      bootV23({
        saveKey: SAVE_KEY,
        // 이미지 주소가 없으면 '#<id>.webp' 로 두어 error → SVG 초상화로 대체돼요.
        imageUrl: (id: string) => (imageBase ? `${imageBase}/${id}.webp` : `/missing/${id}.webp`),
      });
    });
  }, []);

  return <div ref={ref} className="legacy-root" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
