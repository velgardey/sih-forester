'use client';

import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Leaf,
  Flame
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Location {
  name: string;
  fraProgress: {
    coverage: number;
    totalClaims: number;
    grantedClaims: number;
    pendingClaims: number;
    rejectedClaims: number;
    households: number;
    status: string;
    dependency: string;
    populationTrend: string;
  };
  landUse: {
    agriculturalLand: number;
    forestCover: number;
    waterBodies: number;
    homesteads: number;
  };
  dataLayers: {
    classificationModel: string;
    groundwaterLevel: string;
    pmGatiShaktiScore: number;
  };
  risk: {
    fireLevel: string;
    firePercentage: number;
    biodiversityIndex: number;
    endangeredSpecies: number;
    conservationStatus: string;
  };
  schemes: {
    pmKisan: boolean;
    mgnrega: boolean;
    jalJeevan: boolean;
    pmay: boolean;
  };
}

interface InfoCardsProps {
  location: Location;
  isAggregated?: boolean;
}

export default function InfoCards({ location }: InfoCardsProps) {
  const [constantsData, setConstantsData] = useState<any>(null);

  useEffect(() => {
    async function loadConstants() {
      try {
        const constants = await import('@/data/constants.json');
        setConstantsData(constants.default);
      } catch (error) {
        console.error('Error loading constants:', error);
      }
    }
    loadConstants();
  }, []);

  if (!constantsData) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const chartColors = constantsData.chartColors;

  // Prepare land use data for pie chart
  const landUseData = [
    { name: 'Agricultural Land', value: location.landUse.agriculturalLand, color: chartColors.agriculturalLand },
    { name: 'Forest Cover', value: location.landUse.forestCover, color: chartColors.forestCover },
    { name: 'Water Bodies', value: location.landUse.waterBodies, color: chartColors.waterBodies },
    { name: 'Homesteads', value: location.landUse.homesteads, color: chartColors.homesteads },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const schemes = constantsData.schemes.map((scheme: { id: string; displayName: string }) => ({
    id: scheme.id,
    name: scheme.displayName,
    eligible: location.schemes[scheme.id as keyof typeof location.schemes]
  }));

  return (
    <div className="space-y-4">
      {/* Land Use Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-black mb-4">Land Use</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={landUseData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {landUseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {landUseData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-black font-medium">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-black">Classification Model:</span>
            <span className="font-semibold text-black">
              {location.dataLayers.classificationModel}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-black">Groundwater Level:</span>
            <span className={`font-semibold px-2.5 py-1 rounded-full text-xs ${
              location.dataLayers.groundwaterLevel.toLowerCase() === 'stable' 
                ? 'bg-green-100 text-green-700'
                : location.dataLayers.groundwaterLevel.toLowerCase() === 'high'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {location.dataLayers.groundwaterLevel}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-black">PM Gati Shakti Score:</span>
            <span className="font-semibold text-black">
              {location.dataLayers.pmGatiShaktiScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* FRA & Community Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-black mb-4">FRA & Community</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Coverage:</span>
            <span className="text-sm font-bold text-green-600">
              {location.fraProgress.coverage}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Granted Claims:</span>
            <span className="text-sm font-semibold text-black">
              {location.fraProgress.grantedClaims}/{location.fraProgress.totalClaims}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Current Status:</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(location.fraProgress.status)}`}>
              {location.fraProgress.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Households:</span>
            <span className="text-sm font-semibold text-black">
              {location.fraProgress.households.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Dependency on Forest:</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              location.fraProgress.dependency.toLowerCase() === 'high'
                ? 'bg-red-100 text-red-700'
                : location.fraProgress.dependency.toLowerCase() === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {location.fraProgress.dependency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Population Trend:</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(location.fraProgress.populationTrend)}
              <span className="text-xs font-semibold text-black">
                {location.fraProgress.populationTrend}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Eligibility Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-black mb-4">Scheme Eligibility</h3>
        <div className="space-y-2.5">
          {schemes.map((scheme: { id: string; name: string; eligible: boolean }) => (
            <div
              key={scheme.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                scheme.eligible ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {scheme.eligible ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs font-medium text-black">
                  {scheme.name}
                </span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  scheme.eligible ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {scheme.eligible ? 'Eligible' : 'Not Eligible'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk & Conservation Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-black mb-4">Risk & Conservation</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-black flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Fire Risk Level:
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRiskColor(location.risk.fireLevel)}`}>
              {location.risk.fireLevel}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Area Affected by Fire:</span>
            <span className="text-sm font-semibold text-black">
              {location.risk.firePercentage}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              Biodiversity Index:
            </span>
            <span className="text-sm font-semibold text-black">
              {location.risk.biodiversityIndex}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Endangered Species:</span>
            <span className="text-sm font-semibold text-black">
              {location.risk.endangeredSpecies}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-black">Conservation Status:</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              location.risk.conservationStatus.toLowerCase() === 'excellent' || 
              location.risk.conservationStatus.toLowerCase() === 'good'
                ? 'bg-green-100 text-green-700'
                : location.risk.conservationStatus.toLowerCase() === 'stable' ||
                  location.risk.conservationStatus.toLowerCase() === 'moderate'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {location.risk.conservationStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
