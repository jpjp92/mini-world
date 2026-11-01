'use client';

import { useStore } from 'zustand';
import { gameStore } from '@/store/gameStore';
import type { DockActions } from '@/store/journal';
import Portrait from './Portrait';

// 월드 아래 영역: 내 캐릭터, 섬 여행·지도·꾸미기 버튼, 조작 도움말
export default function Dock({ actions }: { actions: DockActions | null }) {
  const dock = useStore(gameStore, (s) => s.dock);
  if (!dock) return null;
  const disabled = !actions;

  return (
    <>
      <button type="button" id="characterBtn" className="character-btn" disabled={disabled} onClick={() => actions?.openCharacter()}>
        <Portrait src={dock.player.img} name="현재 캐릭터" />
        <div>
          <small id="rosterCountLabel">나의 캐릭터{dock.rosterCount > 1 ? ` · ${dock.rosterCount}명` : ''} &nbsp;▾</small>
          <b id="playerName">{dock.player.name}</b>
        </div>
      </button>
      <div className="quick-actions">
        <button type="button" id="ferryBtn" className="soft-btn" disabled={disabled} onClick={() => actions?.openFerry()}>⛴ 섬 여행</button>
        <button type="button" id="travelBtn" className="soft-btn" disabled={disabled} onClick={() => actions?.openTravel()}>🧭 섬 지도</button>
        <button
          type="button"
          id="decorateBtn"
          className={dock.decorating ? 'soft-btn primary' : 'soft-btn'}
          aria-pressed={dock.decorating}
          disabled={disabled}
          onClick={() => actions?.toggleDecorate()}
        >
          {dock.decorating ? '✓ 꾸미기 종료' : '🪴 꾸미기'}
        </button>
      </div>
      <div className="control-help">
        <kbd>WASD / 방향키</kbd> 이동 &nbsp; <kbd>Shift</kbd> 달리기
        <br />
        <kbd>E / Space</kbd> 상호작용·가구 체험 &nbsp; <kbd>클릭</kbd> 이동
      </div>
    </>
  );
}
