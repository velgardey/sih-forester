'use client';

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import locationsData from '@/data/locations.json';

interface Location {
  id: string;
  name: string;
  type: string;
  state: string;
  district: string;
  fraProgress: {
    coverage: number;
    households: number;
  };
}

interface LocationSearchProps {
  onLocationSelect: (location: any) => void;
  value?: string;
  filteredLocations?: Location[];
}

export default function LocationSearch({ onLocationSelect, value = '', filteredLocations }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Use filtered locations from parent if provided, otherwise use all locations
  const availableLocations = filteredLocations || locationsData.locations;

  // Filter locations based on search query
  const searchResults = searchQuery.trim()
    ? availableLocations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.district.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8) // Limit to 8 suggestions
    : [];

  const handleLocationClick = (location: any) => {
    onLocationSelect(location);
    setSearchQuery(location.name);
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    
    // Clear selection if search is cleared
    if (!e.target.value.trim()) {
      onLocationSelect(null);
    }
  };

  const getLocationTypeIcon = () => {
    return <MapPin className="h-4 w-4 text-green-600" />;
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {searchResults.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationClick(location)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getLocationTypeIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {location.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {location.district}, {location.state}
                  </p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-xs font-semibold text-green-600">
                      {location.fraProgress.coverage}% FRA Coverage
                    </span>
                    <span className="text-xs text-gray-500">
                      {location.fraProgress.households.toLocaleString()} Households
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && searchQuery.trim() && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-gray-500 text-center">
            No locations found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
