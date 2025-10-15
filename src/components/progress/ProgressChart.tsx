'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ProgressSummary } from '@/types/claim';

interface ProgressChartProps {
  data: ProgressSummary;
  showLegend?: boolean;
}

export default function ProgressChart({ data, showLegend = true }: ProgressChartProps) {
  const [chartColors, setChartColors] = useState<any>(null);
  const { totalClaims, grantedClaims, pendingClaims, rejectedClaims } = data;
  
  useEffect(() => {
    async function loadConstants() {
      try {
        const constants = await import('@/data/constants.json');
        setChartColors(constants.default.chartColors);
      } catch (error) {
        console.error('Error loading constants:', error);
      }
    }
    loadConstants();
  }, []);

  if (!chartColors) {
    return <div className="text-center py-4">Loading chart...</div>;
  }

  const underReviewClaims = totalClaims - grantedClaims - pendingClaims - rejectedClaims;

  const chartData = [
    { name: 'Granted', value: grantedClaims, color: chartColors.granted },
    { name: 'Pending', value: pendingClaims, color: chartColors.pending },
    { name: 'Under Review', value: underReviewClaims, color: chartColors.waterBodies },
    { name: 'Rejected', value: rejectedClaims, color: chartColors.rejected },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} claims ({Math.round((payload[0].value / totalClaims) * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.name}: ${((entry.value / totalClaims) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
