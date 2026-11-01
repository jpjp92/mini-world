import GameRoot from '@/ui/GameRoot';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.stage}>
      <GameRoot />
    </main>
  );
}
