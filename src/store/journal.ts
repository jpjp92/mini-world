// 모험 노트(사이드바) 화면 데이터. 레거시가 계산해 넣고 React Journal 이 그려요.
export type JournalTab = 'quests' | 'decor' | 'upgrades';

export interface MissionView {
  step: string;
  title: string;
  desc: string;
  /** 0~100 */
  percent: number;
  progress: string;
  reward: string;
}

export interface QuestView {
  id: string;
  name: string;
  img: string;
  questTitle: string;
  progress: number;
  target: number;
  rewardCoins: number;
  rewardCP: number;
  /** 다음 심부름까지 남은 초 (0이면 바로 가능) */
  wait: number;
  claimable: boolean;
}

export interface DecorView {
  id: string;
  icon: string;
  name: string;
  cost: number;
  appeal: number;
  actionDesc: string;
  active: boolean;
}

export interface UpgradeView {
  id: string;
  icon: string;
  name: string;
  level: number;
  tierName: string;
  features: string[];
  look: string;
  /** 다음 단계 비용, 최고 단계면 null */
  cost: { coins: number; trophies: number } | null;
  bestNormal: string;
  bestChamp: string;
}

export interface PassportView {
  count: number;
  total: number;
  stamps: { id: string; icon: string; name: string; earned: boolean }[];
  caption: string;
  overviewLabel: string;
}

export interface JournalView {
  discovery: string;
  mission: MissionView;
  tab: JournalTab;
  quests: QuestView[];
  decor: { items: DecorView[]; removing: boolean };
  upgrades: UpgradeView[];
  passport: PassportView;
}

export interface JournalActions {
  setTab(tab: JournalTab): void;
  questAction(npcId: string): void;
  selectDecor(id: string | 'remove'): void;
  openUpgrade(id: string): void;
  openOverview(): void;
}
