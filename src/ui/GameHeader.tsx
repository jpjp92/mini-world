'use client';

import { useStore } from 'zustand';
import { gameStore } from '@/store/gameStore';

export interface GameHeaderActions {
  toggleSound(): void;
  openHelp(): void;
  openSettings(): void;
}

const SAVE_LABELS = {
  idle: '자동 저장 준비',
  saved: '✓ 자동 저장됨',
  blocked: '저장 불가 · 설정에서 내보내기',
};

export default function GameHeader({ actions }: { actions: GameHeaderActions | null }) {
  // 레거시는 game 객체를 직접 바꾸므로, 객체 대신 표시할 원시 값을 구독해요.
  const coins = useStore(gameStore, (s) => s.game.coins);
  const cp = useStore(gameStore, (s) => s.game.cp);
  const trophies = useStore(gameStore, (s) => s.game.trophies);
  const sound = useStore(gameStore, (s) => s.game.sound);
  const saveStatus = useStore(gameStore, (s) => s.saveStatus);

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brandmark">🍌</div>
        <div>
          <div className="eyebrow">A LITTLE ISLAND, A BIG ADVENTURE · GRAND EDITION</div>
          <h1>미니 월드</h1>
          <p>세 개의 섬, 열한 가지 스포츠 도전</p>
        </div>
      </div>
      <div className="wallet">
        <div className="currency">
          <span className="icon">🍌</span>
          <div><small>바나나 코인</small><b id="coins">{coins.toLocaleString('ko-KR')}</b></div>
        </div>
        <div className="currency">
          <span className="icon">⚡</span>
          <div><small>챌린지 포인트</small><b id="cp">{cp.toLocaleString('ko-KR')}</b></div>
        </div>
        <div className="currency">
          <span className="icon">🏆</span>
          <div><small>챔피언 트로피</small><b id="trophies">{trophies.toLocaleString('ko-KR')}</b></div>
        </div>
      </div>
      <div className="tools">
        <span id="saveStatus" className="save-status" role="status">{SAVE_LABELS[saveStatus]}</span>
        <button id="audioBtn" className="iconbtn" title="효과음 켜기/끄기" aria-label="효과음 켜기/끄기" aria-pressed={sound} disabled={!actions} onClick={() => actions?.toggleSound()}>{sound ? '♪' : '♩'}</button>
        <button id="helpBtn" className="iconbtn" title="도움말" aria-label="도움말" disabled={!actions} onClick={() => actions?.openHelp()}>?</button>
        <button id="settingsBtn" className="iconbtn" title="설정과 저장" aria-label="설정과 저장" disabled={!actions} onClick={() => actions?.openSettings()}>⚙</button>
      </div>
    </header>
  );
}
