'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, FileCheck, MapPin, Award, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import PieChart from '@/components/shared/PieChart';
import ProgressBar from '@/components/shared/ProgressBar';
import { Header } from '@/components/Header';

interface ClaimsData {
  claims: any[];
  progressSummary: {
    byState: Array<{
      state: string;
      totalClaims: number;
      grantedClaims: number;
      pendingClaims: number;
      rejectedClaims: number;
      coverage: number;
      households: number;
    }>;
    byDistrict: Array<{
      state: string;
      district: string;
      totalClaims: number;
      grantedClaims: number;
      pendingClaims: number;
      rejectedClaims: number;
      coverage: number;
    }>;
  };
}

interface LocationsData {
  locations: Array<{
    id: string;
    name: string;
    state: string;
    district: string;
    tribalGroups: string[];
    fraProgress: {
      coverage: number;
      totalClaims: number;
      grantedClaims: number;
      pendingClaims: number;
      rejectedClaims: number;
      households: number;
    };
    schemes: {
      pmKisan: boolean;
      mgnrega: boolean;
      jalJeevan: boolean;
      pmay: boolean;
    };
  }>;
}

interface SchemesData {
  schemes: Array<{
    id: string;
    name: string;
    fullName: string;
    description: string;
    ministry: string;
  }>;
}

export default function StatisticsPage() {
  const [claimsData, setClaimsData] = useState<ClaimsData | null>(null);
  const [locationsData, setLocationsData] = useState<LocationsData | null>(null);
  const [schemesData, setSchemesData] = useState<SchemesData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Focus states
  const FOCUS_STATES = ['Madhya Pradesh', 'Tripura', 'Odisha', 'Telangana'];

  useEffect(() => {
    async function loadData() {
      try {
        // Import filtered data for focus states
        const claimsModule = await import('@/data/claims-filtered.json');
        const locationsModule = await import('@/data/locations-filtered.json');
        const schemesModule = await import('@/data/schemes.json');
        
        setClaimsData(claimsModule.default);
        setLocationsData(locationsModule.default);
        setSchemesData(schemesModule.default);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header activeView="statistics" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <p className="mt-6 text-lg text-black font-medium">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!claimsData || !locationsData || !schemesData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header activeView="statistics" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <p className="text-red-600 text-lg font-semibold">Error loading data</p>
            <p className="text-black mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  // Data is already filtered for focus states
  const focusStatesData = claimsData.progressSummary.byState;

  // Calculate overall statistics for focus states
  const totalClaims = focusStatesData.reduce((sum, state) => sum + state.totalClaims, 0);
  const totalGranted = focusStatesData.reduce((sum, state) => sum + state.grantedClaims, 0);
  const totalPending = focusStatesData.reduce((sum, state) => sum + state.pendingClaims, 0);
  const totalRejected = focusStatesData.reduce((sum, state) => sum + state.rejectedClaims, 0);
  const totalHouseholds = focusStatesData.reduce((sum, state) => sum + state.households, 0);
  const avgCoverage = Math.round(
    focusStatesData.reduce((sum, state) => sum + state.coverage, 0) / 
    focusStatesData.length
  );

  // Prepare data for charts
  const claimStatusData = [
    { name: 'Granted', value: totalGranted, color: '#10b981' },
    { name: 'Pending', value: totalPending, color: '#f59e0b' },
    { name: 'Rejected', value: totalRejected, color: '#ef4444' }
  ];

  const stateChartData = focusStatesData.map(state => ({
    state: state.state,
    Granted: state.grantedClaims,
    Pending: state.pendingClaims,
    Rejected: state.rejectedClaims,
    Coverage: state.coverage
  }));

  const coverageTrendData = focusStatesData
    .sort((a, b) => a.coverage - b.coverage)
    .map(state => ({
      state: state.state.length > 10 ? state.state.substring(0, 10) + '...' : state.state,
      coverage: state.coverage
    }));

  // Locations are already filtered for focus states
  const focusLocations = locationsData.locations;

  // Calculate scheme eligibility statistics for focus states
  const schemeStats = schemesData.schemes.map(scheme => {
    const eligibleLocations = focusLocations.filter(loc => {
      const schemeKey = scheme.id.replace(/_/g, '') as keyof typeof loc.schemes;
      return loc.schemes[schemeKey as keyof typeof loc.schemes];
    }).length;
    
    return {
      name: scheme.name,
      eligible: eligibleLocations,
      total: focusLocations.length,
      percentage: focusLocations.length > 0 ? Math.round((eligibleLocations / focusLocations.length) * 100) : 0
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header activeView="statistics" />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">FRA Statistics Dashboard</h1>
              <p className="text-green-100 mt-1">
                Focus States: Madhya Pradesh, Tripura, Odisha, and Telangana
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <p className="text-xs text-green-100 uppercase tracking-wide">Focus States</p>
              <p className="text-2xl font-bold">{FOCUS_STATES.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black uppercase tracking-wide">Total Claims</p>
                <p className="text-3xl font-bold text-black mt-2">{totalClaims.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-semibold">All submissions</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-md">
                <FileCheck className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black uppercase tracking-wide">Granted Claims</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{totalGranted.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-green-600 font-semibold">
                    {Math.round((totalGranted / totalClaims) * 100)}% success rate
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-md">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black uppercase tracking-wide">Avg Coverage</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{avgCoverage}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-600 font-semibold">Across states</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-md">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black uppercase tracking-wide">Households</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{totalHouseholds.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-orange-600 font-semibold">Beneficiaries</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-md">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Claims Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-black">Claims Status Distribution</h2>
            </div>
            <PieChart data={claimStatusData} height={250} showLegend={true} />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-black">Granted</span>
                <span className="font-semibold text-green-600">{totalGranted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-black">Pending</span>
                <span className="font-semibold text-orange-600">{totalPending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-black">Rejected</span>
                <span className="font-semibold text-red-600">{totalRejected.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-black">FRA Coverage by State</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={coverageTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis label={{ value: 'Coverage %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="coverage" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Individual State Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {focusStatesData.map((state, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-6 border-2 border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-700">{state.state}</h3>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {state.coverage}% Coverage
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900">{state.totalClaims.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Households</p>
                  <p className="text-2xl font-bold text-gray-900">{state.households.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Granted</span>
                  <span className="text-sm font-bold text-green-600">{state.grantedClaims.toLocaleString()} ({Math.round((state.grantedClaims / state.totalClaims) * 100)}%)</span>
                </div>
                <ProgressBar value={state.grantedClaims} max={state.totalClaims} color="bg-green-500" height="h-2.5" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                  <span className="text-sm font-bold text-orange-600">{state.pendingClaims.toLocaleString()} ({Math.round((state.pendingClaims / state.totalClaims) * 100)}%)</span>
                </div>
                <ProgressBar value={state.pendingClaims} max={state.totalClaims} color="bg-orange-500" height="h-2.5" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                  <span className="text-sm font-bold text-red-600">{state.rejectedClaims.toLocaleString()} ({Math.round((state.rejectedClaims / state.totalClaims) * 100)}%)</span>
                </div>
                <ProgressBar value={state.rejectedClaims} max={state.totalClaims} color="bg-red-500" height="h-2.5" />
              </div>
            </div>
          ))}
        </div>

        {/* State-wise Claims Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-black">Focus States Claims Comparison</h2>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Granted" fill="#10b981" />
                <Bar dataKey="Pending" fill="#f59e0b" />
                <Bar dataKey="Rejected" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State-wise Progress Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-black">Focus States Progress Details</h2>
            </div>
            <div className="flex gap-2">
              {FOCUS_STATES.map((state, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  {state}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-green-50 to-green-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Total Claims
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Granted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Coverage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Households
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {focusStatesData.map((state, index) => (
                  <tr key={index} className="hover:bg-green-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                      {state.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-semibold">
                      {state.totalClaims.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {state.grantedClaims.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                      {state.pendingClaims.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      {state.rejectedClaims.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <ProgressBar value={state.coverage} max={100} color="bg-green-500" height="h-2" />
                        </div>
                        <span className="text-sm font-bold text-black">{state.coverage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-semibold">
                      {state.households.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheme Eligibility Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-black">Government Scheme Eligibility - Focus States</h2>
          </div>
          <p className="text-sm text-black mb-6 ml-11">
            Scheme eligibility across {focusLocations.length} locations in Madhya Pradesh, Tripura, Odisha, and Telangana
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemeStats.slice(0, 6).map((scheme, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                  <span className="text-xl font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{scheme.percentage}%</span>
                </div>
                <ProgressBar 
                  value={scheme.eligible} 
                  max={scheme.total} 
                  color="bg-gradient-to-r from-green-500 to-green-600" 
                  height="h-2.5"
                />
                <p className="text-xs text-gray-600 mt-2 font-medium">
                  {scheme.eligible} out of {scheme.total} locations eligible
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
