'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MapView } from '@/components/MapView';
import { Header } from '@/components/Header';

export default function Dashboard() {
  const [selectedForest, setSelectedForest] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'monitoring' | 'alerts' | 'analytics'>('overview');

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedForest={selectedForest}
          setSelectedForest={setSelectedForest}
          activeView={activeView}
        />

        <main className="flex-1 relative">
          <MapView selectedForest={selectedForest} activeView={activeView} />
        </main>
      </div>
    </div>
  );
}
