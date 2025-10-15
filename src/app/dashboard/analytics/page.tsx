'use client';

import { useState } from 'react';
import { MapView } from '@/components/MapView';
import { Header } from '@/components/Header';

export default function MonitoringPage() {
  const [selectedForest] = useState<number | null>(null);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 relative">
          <MapView selectedForest={selectedForest} activeView="monitoring" />
        </main>
      </div>
    </div>
  );
}
