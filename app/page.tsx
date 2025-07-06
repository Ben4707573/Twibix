"use client";

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false for components that use browser APIs like localStorage
const CubeTimerWithNoSSR = dynamic(
  () => import('./cube-timer'),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      <CubeTimerWithNoSSR />
    </div>
  );
}
