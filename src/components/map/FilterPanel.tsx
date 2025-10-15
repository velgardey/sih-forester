'use client';

import React, { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  locations: any[];
  tribalGroups: any[];
}

export interface FilterState {
  state: string;
  district: string;
  village: string;
  tribalGroup: string;
}

export default function FilterPanel({ onFilterChange, locations, tribalGroups }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    state: '',
    district: '',
    village: '',
    tribalGroup: '',
  });

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableVillages, setAvailableVillages] = useState<string[]>([]);

  // Extract unique states from locations
  const states = Array.from(new Set(locations.map(loc => loc.state))).sort();

  // Update available districts when state changes
  useEffect(() => {
    if (filters.state) {
      const districts = Array.from(
        new Set(
          locations
            .filter(loc => loc.state === filters.state)
            .map(loc => loc.district)
        )
      ).sort();
      setAvailableDistricts(districts);
      
      // Reset district and village if they're no longer valid
      if (!districts.includes(filters.district)) {
        setFilters(prev => ({ ...prev, district: '', village: '' }));
      }
    } else {
      setAvailableDistricts([]);
      setFilters(prev => ({ ...prev, district: '', village: '' }));
    }
  }, [filters.state, filters.district, locations]);

  // Update available villages when district changes
  useEffect(() => {
    if (filters.district) {
      const villages = locations
        .filter(loc => loc.state === filters.state && loc.district === filters.district)
        .flatMap(loc => loc.villages)
        .sort();
      setAvailableVillages(villages);
      
      // Reset village if it's no longer valid
      if (!villages.includes(filters.village)) {
        setFilters(prev => ({ ...prev, village: '' }));
      }
    } else {
      setAvailableVillages([]);
      setFilters(prev => ({ ...prev, village: '' }));
    }
  }, [filters.district, filters.state, filters.village, locations]);

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      state: e.target.value,
      district: '',
      village: '',
    }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      district: e.target.value,
      village: '',
    }));
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      village: e.target.value,
    }));
  };

  const handleTribalGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      tribalGroup: e.target.value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      district: '',
      village: '',
      tribalGroup: '',
    });
  };

  const hasActiveFilters = filters.state || filters.district || filters.village || filters.tribalGroup;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* State Filter */}
        <div>
          <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            id="state-filter"
            value={filters.state}
            onChange={handleStateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label htmlFor="district-filter" className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <select
            id="district-filter"
            value={filters.district}
            onChange={handleDistrictChange}
            disabled={!filters.state}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">All Districts</option>
            {availableDistricts.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Village Filter */}
        <div>
          <label htmlFor="village-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Village
          </label>
          <select
            id="village-filter"
            value={filters.village}
            onChange={handleVillageChange}
            disabled={!filters.district}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">All Villages</option>
            {availableVillages.map(village => (
              <option key={village} value={village}>
                {village}
              </option>
            ))}
          </select>
        </div>

        {/* Tribal Group Filter (Independent) */}
        <div>
          <label htmlFor="tribal-group-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Tribal Group
          </label>
          <select
            id="tribal-group-filter"
            value={filters.tribalGroup}
            onChange={handleTribalGroupChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Tribal Groups</option>
            {tribalGroups.map(group => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
