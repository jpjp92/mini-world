'use client';

import { characterIdFromSrc, portraitDataUrl } from '@/world/portrait';

// 캐릭터 초상화. 이미지를 못 불러오면 SVG 초상화로 바꿔요.
export default function Portrait({ src, name, className }: { src: string; name: string; className?: string }) {
  return (
    // 작은 외부 초상화라 next/image 최적화 대신 onError 폴백이 필요해요
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt={name}
      onError={(e) => {
        const img = e.currentTarget;
        const id = characterIdFromSrc(img.src);
        if (id && !img.dataset.fallback) {
          img.dataset.fallback = '1';
          img.src = portraitDataUrl(id);
        }
      }}
    />
  );
}
