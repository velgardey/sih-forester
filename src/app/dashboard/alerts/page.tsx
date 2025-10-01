'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MapView } from '@/components/MapView';
import { Header } from '@/components/Header';

export default function MonitoringPage() {
    type View = 'overview' | 'monitoring' | 'alerts' | 'analytics';
  const [selectedForest, setSelectedForest] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<View>("alerts");

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedForest={selectedForest}
          setSelectedForest={setSelectedForest}
        />

        <main className="flex-1 relative">
          <MapView selectedForest={selectedForest} activeView="monitoring" />
        </main>
      </div>
    </div>
  );
}
