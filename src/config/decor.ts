// v23에서 옮긴 데이터. 값(좌표·목표 점수·비용)은 v23과 같게 유지해요.
export interface DecorItem { id: string; name: string; cost: number; appeal: number; icon: string; actionDesc: string; [extra: string]: unknown }

export const DECOR_CATALOG: DecorItem[] = [
  {
    "id": "flower",
    "name": "작은 꽃밭",
    "cost": 25,
    "appeal": 15,
    "icon": "🌼",
    "actionDesc": "향기 맡기 (+8 🍌)"
  },
  {
    "id": "lamp",
    "name": "숲속 가로등",
    "cost": 40,
    "appeal": 25,
    "icon": "🏮",
    "actionDesc": "따스한 불빛 감상 (+5 ⚡)"
  },
  {
    "id": "bench",
    "name": "피크닉 벤치",
    "cost": 55,
    "appeal": 35,
    "icon": "🪑",
    "actionDesc": "잠시 쉬어가기 (+12 ⚡ 회복)"
  },
  {
    "id": "goal",
    "name": "우리 동네 골대",
    "cost": 70,
    "appeal": 45,
    "icon": "🥅",
    "actionDesc": "미니 슈팅 연습 (+15 🍌)"
  },
  {
    "id": "arcade",
    "name": "레트로 오락기",
    "cost": 90,
    "appeal": 60,
    "icon": "🕹️",
    "actionDesc": "섬 지도 & 그랜드 랭킹 열기"
  },
  {
    "id": "fountain",
    "name": "바나나 분수",
    "cost": 130,
    "appeal": 90,
    "icon": "⛲",
    "actionDesc": "행운의 동전 던지기 (+25 🍌)"
  },
  {
    "id": "trophy_stand",
    "name": "챔피언 단상",
    "cost": 160,
    "appeal": 120,
    "icon": "🏆",
    "actionDesc": "챔피언의 기운 받기 (+15 ⚡)"
  },
  {
    "id": "hammock",
    "name": "해변 파라솔",
    "cost": 65,
    "appeal": 40,
    "icon": "⛱️",
    "actionDesc": "바닷바람 휴식 (+10 ⚡ · +10 🍌)"
  }
];
