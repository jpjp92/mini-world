'use client';

import { useStore } from 'zustand';
import { gameStore } from '@/store/gameStore';
import type { JournalActions, JournalTab, JournalView } from '@/store/journal';
import { characterIdFromSrc, portraitDataUrl } from '@/world/portrait';
import styles from './Journal.module.css';

const TABS: { id: JournalTab; label: string }[] = [
  { id: 'quests', label: '심부름' },
  { id: 'decor', label: '꾸미기' },
  { id: 'upgrades', label: '업그레이드' },
];

export default function Journal({ actions }: { actions: JournalActions | null }) {
  const view = useStore(gameStore, (s) => s.journal);
  if (!view) return null;
  const disabled = !actions;

  return (
    <div className={styles.journal}>
      <div className={styles.titleRow}>
        <h2>모험 노트</h2>
        <span className={styles.meta}>{view.discovery}</span>
      </div>

      <Mission mission={view.mission} />

      <section className={styles.card}>
        <div className={styles.tabs} role="tablist" aria-label="모험 노트 탭">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              data-tab={t.id}
              aria-selected={view.tab === t.id}
              className={view.tab === t.id ? styles.tabActive : styles.tab}
              disabled={disabled}
              onClick={() => actions?.setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.panel} role="tabpanel">
          {view.tab === 'quests' && <Quests view={view} actions={actions} />}
          {view.tab === 'decor' && <Decor view={view} actions={actions} />}
          {view.tab === 'upgrades' && <Upgrades view={view} actions={actions} />}
        </div>
      </section>

      <Passport view={view} actions={actions} />
    </div>
  );
}

function Mission({ mission }: { mission: JournalView['mission'] }) {
  return (
    <section className={`${styles.card} ${styles.mission}`}>
      <div className={styles.label}>
        <span>YOUR NEXT ADVENTURE</span>
        <span>{mission.step}</span>
      </div>
      <h3 className={styles.missionTitle}>{mission.title}</h3>
      <p className={styles.missionDesc}>{mission.desc}</p>
      <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(mission.percent)}>
        <i style={{ width: `${mission.percent}%` }} />
      </div>
      <div className={styles.missionMeta}>
        <span>{mission.progress}</span>
        <span className={styles.reward}>{mission.reward}</span>
      </div>
    </section>
  );
}

function Portrait({ src, name }: { src: string; name: string }) {
  return (
    // 작은 외부 초상화라 next/image 최적화 대신 onError 폴백이 필요해요
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.portrait}
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

function Quests({ view, actions }: { view: JournalView; actions: JournalActions | null }) {
  return (
    <ul className={styles.list}>
      {view.quests.map((q) => (
        <li key={q.id} className={styles.questRow}>
          <Portrait src={q.img} name={q.name} />
          <div className={styles.questInfo}>
            <b>{q.name}</b>
            <small>{q.questTitle}</small>
            {q.wait ? (
              <span className={styles.chipMuted} data-quest-wait={q.id}>{q.wait}초 후 새 심부름</span>
            ) : (
              <span className={styles.questProgress}>
                <span className={styles.miniBar}><i style={{ width: `${(q.progress / q.target) * 100}%` }} /></span>
                {q.progress} / {q.target} · 🍌{q.rewardCoins} ⚡{q.rewardCP}
              </span>
            )}
          </div>
          <button
            type="button"
            data-npc={q.id}
            className={q.claimable ? styles.btnPrimary : styles.btnGhost}
            disabled={!actions}
            onClick={() => actions?.questAction(q.id)}
          >
            {q.claimable ? '보상 받기' : '찾아가기'}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Decor({ view, actions }: { view: JournalView; actions: JournalActions | null }) {
  return (
    <>
      <p className={styles.hint}>
        빈 곳을 누르면 배치, 놓인 가구를 누르면 회수해요. 가구 앞에서 <kbd>E</kbd> / <kbd>Space</kbd>를 누르면 보너스를 받아요.
      </p>
      <div className={styles.grid}>
        {view.decor.items.map((d) => (
          <button
            key={d.id}
            type="button"
            data-decor={d.id}
            aria-pressed={d.active}
            className={d.active ? styles.tileActive : styles.tile}
            disabled={!actions}
            onClick={() => actions?.selectDecor(d.id)}
          >
            <span className={styles.tileIcon}>{d.icon}</span>
            <b>{d.name}</b>
            <small>🍌 {d.cost} · 매력 +{d.appeal}</small>
            <small className={styles.tileDesc}>{d.actionDesc}</small>
          </button>
        ))}
      </div>
      <button
        type="button"
        id="removeFurniture"
        aria-pressed={view.decor.removing}
        className={view.decor.removing ? styles.btnWideActive : styles.btnWide}
        disabled={!actions}
        onClick={() => actions?.selectDecor('remove')}
      >
        가구 회수 모드
      </button>
    </>
  );
}

function Upgrades({ view, actions }: { view: JournalView; actions: JournalActions | null }) {
  return (
    <>
      <p className={styles.hint}>업그레이드하면 새로운 스킬과 기믹이 열려요. 일반·챔피언 기록은 레벨별로 따로 저장해요.</p>
      <ul className={styles.list}>
        {view.upgrades.map((u) => (
          <li key={u.id} className={styles.upgrade}>
            <div className={styles.upgradeHead}>
              <span className={styles.upgradeIcon}>{u.icon}</span>
              <div>
                <b>{u.name}</b>
                <small>Lv.{u.level} · {u.tierName}</small>
              </div>
              <span className={styles.levelDots} aria-label={`레벨 ${u.level} / 3`}>
                {[1, 2, 3].map((n) => <i key={n} data-on={n <= u.level} />)}
              </span>
            </div>
            <p>{u.features.join(' · ')}</p>
            <p className={styles.muted}>외형 · {u.look}</p>
            <div className={styles.upgradeFoot}>
              <small>
                {u.cost ? `다음 단계 🍌 ${u.cost.coins} + 🏆 ${u.cost.trophies}` : `일반 ${u.bestNormal} · 챔피언 ${u.bestChamp}`}
              </small>
              <button
                type="button"
                data-upgrade-preview={u.id}
                className={styles.btnGhost}
                disabled={!actions}
                onClick={() => actions?.openUpgrade(u.id)}
              >
                {u.cost ? '미리보기' : '기록 보기'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Passport({ view, actions }: { view: JournalView; actions: JournalActions | null }) {
  const p = view.passport;
  return (
    <section className={styles.card}>
      <div className={styles.label}>
        <span>MY ISLAND PASSPORT</span>
        <span>{p.count} / {p.total}</span>
      </div>
      <h3 className={styles.missionTitle}>작은 도전, 반짝이는 추억</h3>
      <div className={styles.stamps}>
        {p.stamps.map((s) => (
          <div key={s.id} className={s.earned ? styles.stampEarned : styles.stamp} title={`${s.name}${s.earned ? ' 클리어' : ' 미완료'}`}>
            {s.icon}
          </div>
        ))}
      </div>
      <p className={styles.caption}>{p.caption}</p>
      <button type="button" id="plazaOverviewBtn" className={styles.btnWide} disabled={!actions} onClick={() => actions?.openOverview()}>
        {p.overviewLabel}
      </button>
    </section>
  );
}
