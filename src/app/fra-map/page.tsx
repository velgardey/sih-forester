'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import EnhancedSidebar from '@/components/EnhancedSidebar';
import { FilterState } from '@/components/map/FilterPanel';
import { filterLocations, getHierarchicalProgress } from '@/lib/data-utils';
import ProgressDashboard from '@/components/progress/ProgressDashboard';
import locationsData from '@/data/locations-filtered.json';
import claimsData from '@/data/claims-filtered.json';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import LayerControl from '@/components/map/LayerControl';
import layersData from '@/data/layers.json';

// Dynamically import map to avoid SSR issues
const DynamicMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        <span className="text-gray-600">Loading FRA Map...</span>
      </div>
    </div>
  ),
});

interface Location {
  id: string;
  name: string;
  type: string;
  state: string;
  district: string;
  villages: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  boundary: number[][];
  tribalGroups: string[];
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

export default function FRAMapPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    state: '',
    district: '',
    village: '',
    tribalGroup: '',
  });
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  
  // Layer control state
  const [enabledLayers, setEnabledLayers] = useState<string[]>(() => {
    // Initialize with default enabled layers
    return layersData.layers
      .filter(layer => layer.defaultEnabled)
      .map(layer => layer.id);
  });
  const [layerOpacity, setLayerOpacity] = useState<Record<string, number>>({});

  const locations = locationsData.locations;
  const claims = claimsData.claims;

  // Filter locations based on current filters
  const filteredLocations = useMemo(() => {
    return filterLocations(locations, filters);
  }, [locations, filters]);

  // Get hierarchical progress data based on filters
  const progressData = useMemo(() => {
    return getHierarchicalProgress(claims, {
      state: filters.state || undefined,
      district: filters.district || undefined,
      village: filters.village || undefined,
    });
  }, [claims, filters]);

  // Handle location selection
  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
    if (location) {
      // Update filters based on selected location
      setFilters({
        state: location.state,
        district: location.district,
        village: location.villages[0] || '',
        tribalGroup: filters.tribalGroup,
      });
    }
  };

  // Handle filter changes from sidebar
  const handleSidebarFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (selectedLocation && !filteredLocations.find(loc => loc.id === selectedLocation.id)) {
      setSelectedLocation(null);
    }
  };

  // Handle layer toggle
  const handleLayerToggle = (layerId: string) => {
    setEnabledLayers(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      } else {
        return [...prev, layerId];
      }
    });
  };

  // Handle opacity change
  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayerOpacity(prev => ({
      ...prev,
      [layerId]: opacity,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 relative">
        {!showProgressDashboard ? (
          <div className="h-[calc(100vh-64px)] relative">
            <ErrorBoundary>
              <DynamicMap 
                selectedLocation={selectedLocation}
                locations={filteredLocations}
                activeView="overview"
                enabledLayers={enabledLayers}
                layerOpacity={layerOpacity}
              />
            </ErrorBoundary>
            
            {/* Layer Control */}
            <LayerControl
              enabledLayers={enabledLayers}
              layerOpacity={layerOpacity}
              onLayerToggle={handleLayerToggle}
              onOpacityChange={handleOpacityChange}
            />
            
            <EnhancedSidebar
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              locations={filteredLocations}
              allLocations={locations}
              onShowProgress={() => setShowProgressDashboard(true)}
              onFilterChange={handleSidebarFilterChange}
            />
          </div>
        ) : (
          <div className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
              {/* Back to Map Button */}
              <button
                onClick={() => setShowProgressDashboard(false)}
                className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Map
              </button>

              {/* Progress Dashboard */}
              <ProgressDashboard
                data={progressData.data}
                level={progressData.level as 'village' | 'block' | 'district' | 'state'}
                name={progressData.name}
                showChart={true}
                showMetrics={true}
              />

              {/* Child Progress List */}
              {progressData.children && progressData.children.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {progressData.level === 'state' ? 'District Progress' : 
                     progressData.level === 'district' ? 'Block Progress' : 
                     'Village Progress'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {progressData.children.map((child: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">{child.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Claims:</span>
                            <span className="font-semibold text-gray-900">{child.data.totalClaims}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Granted:</span>
                            <span className="font-semibold text-green-600">{child.data.grantedClaims}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pending:</span>
                            <span className="font-semibold text-yellow-600">{child.data.pendingClaims}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Coverage:</span>
                            <span className="font-semibold text-gray-900">{child.data.coverage}%</span>
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${child.data.coverage >= 70 ? 'bg-green-500' : child.data.coverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'} h-2 rounded-full`}
                            style={{ width: `${child.data.coverage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
