'use client';

import dynamic from 'next/dynamic';

const LegacyGame = dynamic(() => import('./LegacyGame'), { ssr: false });

export default function LegacyRoot() {
  return <LegacyGame />;
}
