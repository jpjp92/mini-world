import { getCharacter } from '@/config/roster';

// 캐릭터 이미지가 없을 때 쓰는 SVG 초상화. 캔버스 도형 캐릭터(world/character.ts)와 같은 모양이에요.
export function portraitDataUrl(id: string): string {
  const { colors } = getCharacter(id);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" rx="22" fill="#f1f3e6"/>
<rect x="30" y="14" width="40" height="72" rx="20" fill="${colors.body}"/>
<rect x="27" y="34" width="46" height="13" rx="5" fill="#b3bdb6"/>
<ellipse cx="42" cy="40" rx="7" ry="6" fill="#fff"/><ellipse cx="58" cy="40" rx="7" ry="6" fill="#fff"/>
<circle cx="42" cy="40" r="2.6" fill="#3a3a3a"/><circle cx="58" cy="40" r="2.6" fill="#3a3a3a"/>
<rect x="30" y="62" width="40" height="24" rx="6" fill="${colors.outfit}"/>
${colors.stripes ? `<rect x="40" y="62" width="5" height="24" fill="${colors.stripes}"/><rect x="55" y="62" width="5" height="24" fill="${colors.stripes}"/>` : ''}
${colors.hat ? `<rect x="30" y="12" width="40" height="12" rx="6" fill="${colors.hat}"/>` : ''}
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// <img src=".../<id>.webp"> 에서 캐릭터 id를 꺼내요.
export function characterIdFromSrc(src: string): string | null {
  const m = /\/([a-z]+)\.webp(?:\?.*)?$/.exec(src);
  return m ? m[1] : null;
}
