'use client';

import React from 'react';
import { ProgressSummary } from '@/types/claim';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressMetricsProps {
  data: ProgressSummary;
  comparisonData?: ProgressSummary;
  showComparison?: boolean;
}

export default function ProgressMetrics({ 
  data, 
  comparisonData, 
  showComparison = false 
}: ProgressMetricsProps) {
  const { totalClaims, grantedClaims, pendingClaims, coverage } = data;

  const calculateTrend = (current: number, previous?: number) => {
    if (!previous || !showComparison) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const getTrendIcon = (trend: number | null) => {
    if (trend === null) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number | null) => {
    if (trend === null) return 'text-gray-600';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const metrics = [
    {
      label: 'Total Claims',
      value: totalClaims,
      previousValue: comparisonData?.totalClaims,
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Granted Claims',
      value: grantedClaims,
      previousValue: comparisonData?.grantedClaims,
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Pending Claims',
      value: pendingClaims,
      previousValue: comparisonData?.pendingClaims,
      format: (val: number) => val.toLocaleString(),
    },
    {
      label: 'Coverage',
      value: coverage,
      previousValue: comparisonData?.coverage,
      format: (val: number) => `${val}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const trend = calculateTrend(metric.value, metric.previousValue);
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{metric.format(metric.value)}</p>
              {trend !== null && (
                <div className="flex items-center gap-1">
                  {getTrendIcon(trend)}
                  <span className={`text-xs font-medium ${getTrendColor(trend)}`}>
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
