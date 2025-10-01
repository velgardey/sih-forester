'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { MapView } from '@/components/MapView';
import { Header } from '@/components/Header';

type View = 'overview' | 'monitoring' | 'alerts' | 'analytics';

export default function Dashboard() {
  const pathname = usePathname();

  const [selectedForest, setSelectedForest] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<View>('overview');

  // Sync active view with URL
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/monitoring')) setActiveView('monitoring');
    else if (pathname.startsWith('/alerts')) setActiveView('alerts');
    else if (pathname.startsWith('/analytics')) setActiveView('analytics');
    else setActiveView('overview');
  }, [pathname]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation/Header */}
      <Header activeView={activeView} setActiveView={setActiveView} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedForest={selectedForest}
          setSelectedForest={setSelectedForest}
        />

        {/* Main Content */}
        <main className="flex-1 relative">
          <MapView selectedForest={selectedForest} activeView={activeView} />
        </main>
      </div>
    </div>
  );
}
