import LegacyRoot from '@/ui/LegacyRoot';

// Phase 1: v23 게임을 레거시 모듈로 그대로 띄워요. 기능을 떼어낼 때마다 새 엔진으로 옮겨요.
export default function Home() {
  return <LegacyRoot />;
}
