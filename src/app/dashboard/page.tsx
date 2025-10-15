'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MapView } from '@/components/MapView';
import { Header } from '@/components/Header';

export default function Dashboard() {
  const [selectedForest, setSelectedForest] = useState<number | null>(null);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation/Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedForest={selectedForest}
          setSelectedForest={setSelectedForest}
        />

        {/* Main Content */}
        <main className="flex-1 relative">
          <MapView selectedForest={selectedForest} activeView="overview" />
        </main>
      </div>
    </div>
  );
}
