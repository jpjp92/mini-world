import GameRoot from '@/ui/GameRoot';
import styles from './page.module.css';

// 새 엔진 실험용 페이지. v23 기능을 떼어 옮기면서 여기서 먼저 확인해요.
export default function Lab() {
  return (
    <main className={styles.stage}>
      <GameRoot />
    </main>
  );
}
