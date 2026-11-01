// v23에서 옮긴 데이터. 값(좌표·목표 점수·비용)은 v23과 같게 유지해요.
import type { Point } from './games';

export type IslandId = 'banana' | 'cove' | 'snow';

export interface Island { name: string; icon: string; tag: string; port: Point; arrival: Point }

export const ISLANDS: Record<IslandId, Island> = {
  "banana": {
    "name": "바나나 아일랜드",
    "icon": "🌿",
    "tag": "축구·테니스·바나나런·점프",
    "port": {
      "x": 1477,
      "y": 1110
    },
    "arrival": {
      "x": 1477,
      "y": 1080
    }
  },
  "cove": {
    "name": "챔피언 코브",
    "icon": "⛵",
    "tag": "사이클·야구·프리킥·양궁",
    "port": {
      "x": 400,
      "y": 1080
    },
    "arrival": {
      "x": 400,
      "y": 1040
    }
  },
  "snow": {
    "name": "스노우 피크",
    "icon": "🏔️",
    "tag": "스키·피겨·태권도",
    "port": {
      "x": 400,
      "y": 1080
    },
    "arrival": {
      "x": 400,
      "y": 1040
    }
  }
};

export interface Region { id: string; name: string; icon: string; x: number; y: number; arrival: Point; island?: IslandId }
export const REGIONS: Region[] = [
  {
    "id": "plaza",
    "name": "바나나 중앙 광장",
    "icon": "🌿",
    "x": 960,
    "y": 690,
    "arrival": {
      "x": 960,
      "y": 760
    }
  },
  {
    "id": "soccer",
    "name": "챔피언스 축구 마을",
    "icon": "⚽",
    "x": 480,
    "y": 360,
    "arrival": {
      "x": 500,
      "y": 470
    }
  },
  {
    "id": "racket",
    "name": "선샤인 라켓 클럽",
    "icon": "🎾",
    "x": 490,
    "y": 980,
    "arrival": {
      "x": 500,
      "y": 1030
    }
  },
  {
    "id": "racing",
    "name": "에메랄드 코스트",
    "icon": "🏊",
    "x": 1430,
    "y": 970,
    "arrival": {
      "x": 1400,
      "y": 1050
    }
  },
  {
    "id": "space",
    "name": "스타라이트 연구소",
    "icon": "🚀",
    "x": 1450,
    "y": 350,
    "arrival": {
      "x": 1450,
      "y": 480
    }
  },
  {
    "id": "harbor",
    "island": "cove",
    "name": "코브 선착장",
    "icon": "⛵",
    "x": 400,
    "y": 1040,
    "arrival": {
      "x": 400,
      "y": 1040
    }
  },
  {
    "id": "cycling",
    "island": "cove",
    "name": "코브 사이클 레이스",
    "icon": "🚲",
    "x": 530,
    "y": 355,
    "arrival": {
      "x": 530,
      "y": 535
    }
  },
  {
    "id": "baseball",
    "island": "cove",
    "name": "슬러거 홈런 더비",
    "icon": "⚾",
    "x": 1405,
    "y": 395,
    "arrival": {
      "x": 1400,
      "y": 585
    }
  },
  {
    "id": "freekick",
    "island": "cove",
    "name": "프리킥 타깃 챌린지",
    "icon": "🎯",
    "x": 960,
    "y": 900,
    "arrival": {
      "x": 960,
      "y": 1075
    }
  },
  {
    "id": "snowharbor",
    "island": "snow",
    "name": "스노우 선착장",
    "icon": "⛴",
    "x": 400,
    "y": 1040,
    "arrival": {
      "x": 400,
      "y": 1040
    }
  },
  {
    "id": "archery",
    "island": "cove",
    "name": "포레스트 양궁",
    "icon": "🏹",
    "x": 957.5,
    "y": 335,
    "arrival": {
      "x": 960,
      "y": 520
    }
  },
  {
    "id": "ski",
    "island": "snow",
    "name": "스노우 슬라럼",
    "icon": "⛷️",
    "x": 510,
    "y": 375,
    "arrival": {
      "x": 510,
      "y": 580
    }
  },
  {
    "id": "figure",
    "island": "snow",
    "name": "아이스 리듬",
    "icon": "⛸️",
    "x": 1400,
    "y": 395,
    "arrival": {
      "x": 1400,
      "y": 590
    }
  },
  {
    "id": "taekwondo",
    "island": "snow",
    "name": "태권 콤보",
    "icon": "🥋",
    "x": 960,
    "y": 905,
    "arrival": {
      "x": 960,
      "y": 1075
    }
  }
];

export interface Station { id: string; npcId: string; gameId: string; label: string; position: Point; island?: IslandId; [extra: string]: unknown }
export const STATIONS: Station[] = [
  {
    "id": "soccer",
    "npcId": "kicko",
    "gameId": "soccer",
    "label": "챔피언스 축구 구장",
    "position": {
      "x": 350,
      "y": 470
    }
  },
  {
    "id": "racket",
    "npcId": "tennis",
    "gameId": "racket",
    "label": "선샤인 테니스 코트",
    "position": {
      "x": 420,
      "y": 1030
    }
  },
  {
    "id": "racing",
    "npcId": "swimmer",
    "gameId": "racing",
    "label": "에메랄드 코스트",
    "position": {
      "x": 1530,
      "y": 1060
    }
  },
  {
    "id": "space",
    "npcId": "astro",
    "gameId": "space",
    "label": "스타라이트 연구소",
    "position": {
      "x": 1620,
      "y": 485
    }
  },
  {
    "id": "cycling",
    "island": "cove",
    "npcId": "cyclist",
    "gameId": "cycling",
    "label": "코브 사이클 클럽",
    "position": {
      "x": 385,
      "y": 535
    }
  },
  {
    "id": "baseball",
    "island": "cove",
    "npcId": "baseball",
    "gameId": "baseball",
    "label": "코브 야구장",
    "position": {
      "x": 1550,
      "y": 565
    }
  },
  {
    "id": "freekick",
    "island": "cove",
    "npcId": "curvy",
    "gameId": "freekick",
    "label": "타깃 프리킥 필드",
    "position": {
      "x": 1165,
      "y": 1045
    }
  },
  {
    "id": "archery",
    "npcId": "archer",
    "gameId": "archery",
    "island": "cove",
    "label": "포레스트 양궁",
    "position": {
      "x": 1130,
      "y": 500
    }
  },
  {
    "id": "ski",
    "npcId": "skier",
    "gameId": "ski",
    "island": "snow",
    "label": "스노우 슬라럼",
    "position": {
      "x": 350,
      "y": 570
    }
  },
  {
    "id": "figure",
    "npcId": "skater",
    "gameId": "figure",
    "island": "snow",
    "label": "아이스 리듬",
    "position": {
      "x": 1590,
      "y": 570
    }
  },
  {
    "id": "taekwondo",
    "npcId": "taek",
    "gameId": "taekwondo",
    "island": "snow",
    "label": "태권 콤보",
    "position": {
      "x": 1160,
      "y": 1055
    }
  }
];

export interface WeatherMode { id: string; name: string; desc: string; tint: string; bonusType: string; mult: number }
export const WEATHER_MODES: WeatherMode[] = [
  {
    "id": "sunny",
    "name": "☀ 맑은 낮",
    "desc": "바나나 채집 코인 +10%",
    "tint": "rgba(255,248,210,0.04)",
    "bonusType": "banana",
    "mult": 1.1
  },
  {
    "id": "sunset",
    "name": "🌇 노을빛 저녁",
    "desc": "아케이드 경기 보상 코인 +20%",
    "tint": "rgba(235,140,85,0.16)",
    "bonusType": "arcade",
    "mult": 1.2
  },
  {
    "id": "night",
    "name": "🌙 별빛 밤",
    "desc": "별 조각 채집 보상 +50%",
    "tint": "rgba(25,42,78,0.34)",
    "bonusType": "star",
    "mult": 1.5
  },
  {
    "id": "rain",
    "name": "🌧 산들비",
    "desc": "조개 채집 보상 +40% · 나무 회복 가속",
    "tint": "rgba(70,115,145,0.18)",
    "bonusType": "shell",
    "mult": 1.4
  }
];
