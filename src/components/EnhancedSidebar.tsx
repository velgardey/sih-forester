'use client';

import { useState } from 'react';
import { Search, Filter, X, MapPin, BarChart3, Bookmark } from 'lucide-react';
import InfoCards from './map/InfoCards';

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
  fraProgress: any;
  landUse: any;
  dataLayers: any;
  risk: any;
  schemes: any;
}

interface EnhancedSidebarProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location | null) => void;
  locations: Location[];
  allLocations?: Location[];
  onShowProgress?: () => void;
  onFilterChange?: (filters: any) => void;
}

export default function EnhancedSidebar({
  selectedLocation,
  onLocationSelect,
  locations,
  allLocations,
  onShowProgress,
  onFilterChange
}: EnhancedSidebarProps) {
  // Use allLocations for filter options, locations for display
  const locationsForFilters = allLocations || locations;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTribalGroup, setSelectedTribalGroup] = useState('');

  // Get unique values for filters from all locations
  const states = Array.from(new Set(locationsForFilters.map(loc => loc.state))).sort();
  const districts = selectedState
    ? Array.from(new Set(locationsForFilters.filter(loc => loc.state === selectedState).map(loc => loc.district))).sort()
    : [];
  const tribalGroups = Array.from(new Set(locationsForFilters.flatMap(loc => loc.tribalGroups))).sort();

  // Filter locations based on search only (filters are applied at parent level)
  const filteredLocations = locations.filter(loc => {
    const matchesSearch = !searchQuery || 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.villages.some(v => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
      loc.tribalGroups.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location);
    setIsExpanded(true);
  };

  const handleViewInfo = () => {
    if (selectedLocation) {
      setIsExpanded(true);
    }
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        state: selectedState,
        district: selectedDistrict,
        tribalGroup: selectedTribalGroup,
        village: ''
      });
    }
  };

  const clearFilters = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedTribalGroup('');
    setSearchQuery('');
    if (onFilterChange) {
      onFilterChange({
        state: '',
        district: '',
        tribalGroup: '',
        village: ''
      });
    }
  };

  return (
    <>
      {/* Floating Action Buttons */}
      {!isExpanded && (
        <div className="absolute top-4 left-4 flex flex-col gap-3 z-[1000]">
          {/* Search & Filter Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              showSearch ? 'bg-green-600 text-white shadow-green-200' : 'bg-white text-black hover:bg-green-50'
            }`}
            title="Search & Filter Locations"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* View Info Button (when location selected) */}
          {selectedLocation && (
            <button
              onClick={handleViewInfo}
              className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-all hover:scale-105 active:scale-95 shadow-blue-200"
              title="View Location Info"
            >
              <MapPin className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Unified Search & Filter Panel */}
      {showSearch && !isExpanded && (
        <div className="absolute top-4 left-20 w-full md:w-[420px] max-w-[420px] bg-white rounded-xl shadow-lg border border-gray-200 z-[1000] max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black">Search & Filter</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={() => setShowSearch(false)}
                className="p-1.5 text-black hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, district, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-black placeholder:text-gray-400"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                showFilters || selectedState || selectedDistrict || selectedTribalGroup
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Filters</span>
              </div>
              <div className="flex items-center gap-2">
                {(selectedState || selectedDistrict || selectedTribalGroup) && (
                  <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
                <svg
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {/* State Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedDistrict('');
                      applyFilters();
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-black"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      applyFilters();
                    }}
                    disabled={!selectedState}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black"
                  >
                    <option value="">All Districts</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Tribal Group Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tribal Group</label>
                  <select
                    value={selectedTribalGroup}
                    onChange={(e) => {
                      setSelectedTribalGroup(e.target.value);
                      applyFilters();
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-black"
                  >
                    <option value="">All Tribal Groups</option>
                    {tribalGroups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                {(selectedState || selectedDistrict || selectedTribalGroup || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-5">
            {filteredLocations.length > 0 ? (
              <div className="space-y-2.5">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationClick(location)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedLocation?.id === location.id
                        ? 'border-green-500 bg-green-50 shadow-sm'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50 hover:shadow-sm'
                    }`}
                  >
                    <h4 className="font-semibold text-black text-sm">{location.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {location.district}, {location.state}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className="text-xs text-green-600 font-semibold">
                        {location.fraProgress.coverage}% Coverage
                      </span>
                      <span className="text-xs text-gray-600">
                        {location.fraProgress.households.toLocaleString()} households
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No locations found</p>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search</p>
              </div>
            )}
          </div>
        </div>
      )}



      {/* Expanded Sidebar */}
      {isExpanded && selectedLocation && (
        <div className="absolute top-4 left-4 bottom-4 w-full md:w-[450px] max-w-[450px] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden z-[1000]">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedLocation.district}, {selectedLocation.state}
                </p>
              </div>
              <div className="flex gap-2">
                {onShowProgress && (
                  <button
                    onClick={onShowProgress}
                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors shadow-sm"
                    title="View Progress Dashboard"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-lg transition-colors shadow-sm ${
                    isBookmarked
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                  title="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-gray-600 text-xs mb-1">FRA Coverage</p>
                <p className="font-bold text-green-600 text-lg">{selectedLocation.fraProgress.coverage}%</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Households</p>
                <p className="font-bold text-gray-900 text-lg">
                  {selectedLocation.fraProgress.households.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <InfoCards location={selectedLocation} />
          </div>
        </div>
      )}
    </>
  );
}
