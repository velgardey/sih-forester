'use client';

import React from 'react';
import { ProgressSummary } from '@/types/claim';
import ProgressCard from './ProgressCard';
import ProgressChart from './ProgressChart';
import ProgressMetrics from './ProgressMetrics';

interface ProgressDashboardProps {
  data: ProgressSummary;
  level: 'village' | 'block' | 'district' | 'state';
  name: string;
  showChart?: boolean;
  showMetrics?: boolean;
}

export default function ProgressDashboard({ 
  data, 
  level, 
  name,
  showChart = true,
  showMetrics = true
}: ProgressDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      {showMetrics && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Overview</h2>
          <ProgressMetrics data={data} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Card */}
        <ProgressCard data={data} level={level} name={name} />

        {/* Progress Chart */}
        {showChart && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Claims Distribution</h3>
            <ProgressChart data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
