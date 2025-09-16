'use client';

import { useState } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { clsx } from 'clsx';

// Import JSON data
import forestsData from '@/data/forests.json';

interface SidebarProps {
  selectedForest: string | null;
  setSelectedForest: (forest: string | null) => void;
}

export function Sidebar({ selectedForest, setSelectedForest }: SidebarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const forests = forestsData.forests;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Forest Selection */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Forests</h3>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Filter options would go here</p>
          </div>
        )}

        <div className="space-y-2">
          {forests.map((forest) => (
            <button
              key={forest.id}
              onClick={() => setSelectedForest(forest.id === selectedForest ? null : forest.id)}
              className={clsx(
                'w-full text-left p-4 rounded-lg border transition-colors',
                selectedForest === forest.id
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{forest.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{forest.area}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={clsx('w-2 h-2 rounded-full', getHealthColor(forest.health))} />
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
