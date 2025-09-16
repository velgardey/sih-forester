'use client';

import { Shield, CircleGauge, Leaf, Flame, Users } from 'lucide-react';

interface ForestStats {
  protection: {
    coverage: number;
    protectedAreas: number;
    status: string;
  };
  monitoring: {
    activeSensors: number;
    sensorTypes: number;
    coverage: string;
  };
  alerts: {
    active: number;
    resolved: number;
    riskLevel: string;
  };
  conservation: {
    biodiversityIndex: number;
    endangeredSpecies: number;
    status: string;
  };
  fireRisk: {
    level: string;
    percentage: number;
    lastIncident: string;
  };
  visitors: {
    annual: string;
    currentMonth: string;
    trend: string;
  };
}

interface StatCardsProps {
  forestName: string;
  stats: ForestStats;
}

export default function StatCards({ forestName, stats }: StatCardsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'protected':
      case 'excellent':
      case 'thriving':
        return 'bg-green-500';
      case 'stable':
      case 'good':
        return 'bg-blue-500';
      case 'at risk':
      case 'declining':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very low':
        return 'bg-green-500';
      case 'low':
        return 'bg-blue-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'very high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return '';
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-[9999] pointer-events-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Protection Coverage Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg pointer-events-auto border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Protection Coverage
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-800">See all</button>
          </div>
          
          <div className="space-y-3">
            {/* Circular Progress */}
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray={`${stats.protection.coverage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">
                    {stats.protection.coverage}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(stats.protection.status)}`}>
                {stats.protection.status}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 text-center">
              {stats.protection.protectedAreas} protected areas monitoring forest health and wildlife.
            </p>
          </div>
        </div>

        {/* Monitoring & Alerts Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg pointer-events-auto border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CircleGauge className="h-4 w-4 text-blue-600" />
              Monitoring & Alerts
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-800">See all</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.monitoring.activeSensors}</div>
              <div className="text-xs text-blue-700">Active Sensors</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600">{stats.alerts.active}</div>
              <div className="text-xs text-red-700">Active Alerts</div>
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getRiskColor(stats.alerts.riskLevel)}`}>
              {stats.alerts.riskLevel} Risk
            </span>
          </div>
          
          <p className="text-xs text-gray-600 text-center mt-2">
            {stats.monitoring.coverage} sensor coverage with {stats.alerts.resolved} resolved incidents.
          </p>
        </div>

        {/* Conservation & Fire Risk Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg pointer-events-auto border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Conservation Status
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-800">See all</button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Biodiversity Index</span>
              <span className="text-sm font-semibold text-gray-600">{stats.conservation.biodiversityIndex}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-gray-600 flex-1">Fire Risk</span>
              <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getRiskColor(stats.fireRisk.level)}`}>
                {stats.fireRisk.level}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-600 flex-1">Visitors</span>
              <span className="text-sm font-semibold flex items-center gap-1 text-gray-600">
                {stats.visitors.currentMonth}
                <span className="text-xs ">{getTrendIcon(stats.visitors.trend)}</span>
              </span>
            </div>
            
            <p className="text-xs text-gray-600">
              {stats.conservation.endangeredSpecies} endangered species under protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}