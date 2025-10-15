'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DocumentFiltersProps {
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
}

export interface FilterState {
  documentType: string;
  state: string;
  district: string;
  dateFrom: string;
  dateTo: string;
}

export type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'location';

interface ConstantsData {
  documentTypes: string[];
  states: string[];
  districts: Record<string, string[]>;
}

export default function DocumentFilters({ onSearchChange, onFilterChange, onSortChange }: DocumentFiltersProps) {
  const [constantsData, setConstantsData] = useState<ConstantsData | null>(null);

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    documentType: '',
    state: '',
    district: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Update districts when state changes
    if (key === 'state' && constantsData) {
      setAvailableDistricts(constantsData.districts[value] || []);
      newFilters.district = '';
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      documentType: '',
      state: '',
      district: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    setAvailableDistricts([]);
    onFilterChange(emptyFilters);
    onSearchChange('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '') || searchTerm !== '';

  if (!constantsData) {
    return <div className="text-center py-4">Loading filters...</div>;
  }

  const DOCUMENT_TYPES = constantsData.documentTypes;
  const STATES = constantsData.states;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by name, type, location..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all font-medium ${
            showFilters || hasActiveFilters
              ? 'bg-green-50 border-green-300 text-green-700 shadow-sm'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              •
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Filter Options</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Document Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Document Type
              </label>
              <select
                value={filters.documentType}
                onChange={(e) => handleFilterChange('documentType', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
              >
                <option value="">All types</option>
                {DOCUMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                State
              </label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
              >
                <option value="">All states</option>
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                District
              </label>
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                disabled={!filters.state}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All districts</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
              >
                <option value="date-desc">Date (Newest first)</option>
                <option value="date-asc">Date (Oldest first)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="location">Location</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
