'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the map to avoid SSR issues
const DynamicMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        <span className="text-gray-600">Loading interactive map...</span>
      </div>
    </div>
  ),
});

interface MapViewProps {
  selectedForest: string | null;
  activeView: 'overview' | 'monitoring' | 'alerts' | 'analytics';
}

export function MapView({ selectedForest, activeView }: MapViewProps) {
  return (
    <div className="h-full w-full relative">
      <DynamicMap selectedForest={selectedForest} activeView={activeView} />
    </div>
  );
}
