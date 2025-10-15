'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, ExternalLink, Building2, Calendar, CheckCircle2, Info } from 'lucide-react';
import { Header } from '@/components/Header';

interface Scheme {
  id: string;
  name: string;
  fullName: string;
  description: string;
  ministry: string;
  eligibility: string;
  benefits: string;
  icon: string;
  launchYear: number;
  website: string;
}

interface SchemesData {
  schemes: Scheme[];
}

export default function SchemesPage() {
  const [schemesData, setSchemesData] = useState<SchemesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'year'>('name');

  useEffect(() => {
    async function loadData() {
      try {
        const schemesModule = await import('@/data/schemes.json');
        setSchemesData(schemesModule.default);
      } catch (error) {
        console.error('Error loading schemes data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header activeView="schemes" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <p className="mt-6 text-lg text-black font-medium">Loading schemes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!schemesData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header activeView="schemes" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <p className="text-red-600 text-lg font-semibold">Error loading data</p>
            <p className="text-black mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  // Get unique ministries for filter
  const ministries = Array.from(new Set(schemesData.schemes.map(s => s.ministry))).sort();

  // Filter and sort schemes
  const filteredSchemes = schemesData.schemes
    .filter(scheme => {
      const matchesSearch = 
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMinistry = selectedMinistry === 'all' || scheme.ministry === selectedMinistry;
      
      return matchesSearch && matchesMinistry;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.launchYear - a.launchYear;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header activeView="schemes" />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Government Schemes</h1>
              <p className="text-green-100 mt-1">
                Explore Indian government schemes available for forest rights beneficiaries
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">
                Search Schemes
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, description, or eligibility..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Ministry Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Filter by Ministry
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                <select
                  value={selectedMinistry}
                  onChange={(e) => setSelectedMinistry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="all" className="bg-white text-black">All Ministries</option>
                  {ministries.map(ministry => (
                    <option key={ministry} value={ministry} className="bg-white text-black">{ministry}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-black">
              Showing <span className="font-semibold text-black">{filteredSchemes.length}</span> of{' '}
              <span className="font-semibold text-black">{schemesData.schemes.length}</span> schemes
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-black">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'year')}
                className="px-3 py-1.5 bg-white text-black border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name" className="bg-white text-black">Name</option>
                <option value="year" className="bg-white text-black">Launch Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schemes Grid */}
        {filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Scheme Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black">{scheme.name}</h3>
                      <p className="text-sm text-black mt-0.5">{scheme.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">{scheme.launchYear}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-black mb-4 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Ministry */}
                <div className="flex items-start gap-2 mb-3 bg-blue-50 p-3 rounded-lg">
                  <Building2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 uppercase tracking-wide">Ministry</p>
                    <p className="text-sm text-blue-700 font-medium">{scheme.ministry}</p>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="flex items-start gap-2 mb-3 bg-purple-50 p-3 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-purple-900 uppercase tracking-wide">Eligibility</p>
                    <p className="text-sm text-purple-700">{scheme.eligibility}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="flex items-start gap-2 mb-4 bg-orange-50 p-3 rounded-lg">
                  <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-orange-900 uppercase tracking-wide">Benefits</p>
                    <p className="text-sm text-orange-700">{scheme.benefits}</p>
                  </div>
                </div>

                {/* Website Link */}
                <a
                  href={scheme.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
