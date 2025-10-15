'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Map, CheckCircle2, XCircle,
  Layers, Handshake, Tent, ChevronRight, X,
  AlertTriangle,
  UserCheck,
  Leaf,
  Users
} from 'lucide-react';

// --- DATA STRUCTURE (No changes needed) ---
interface ForestData {
  name: string;
  schemeEligibility: {
    pmKisan: boolean;
    jalJeevan: boolean;
    mgnrega: boolean;
    dajgua: boolean;
  };
  landUse: {
    forestCover: number;
    agriculturalLand: number;
    waterBodies: number;
    homesteads: number;
    totalArea: number;
  };
  dataLayers: {
    classificationModel: string;
    groundwaterLevel: string;
    infrastructureScore: number;
  };
  fra: {
    coverage: string;
    granted: number;
    claims: number;
    status: string;
  };
  conservation: {
    biodiversityIndex: number;
    endangeredSpecies: number;
    status: string;
  };
  risk: {
    fireLevel: string;
    firePercentage: number;
    lastIncident: string;
  };
  community: {
    households: number;
    dependence: string;
    trend: string;
  };
}

interface StatCardProps {
  forest: ForestData;
  onClose: () => void; // Add a prop to handle closing the panel
}

// --- REFACTORED COLLAPSIBLE COMPONENT ---
export default function ForestDashboardSidebar({ forest, onClose }: StatCardProps) {
  const [activeTab, setActiveTab] = useState('Land Use');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const wrapperRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsCollapsed(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);


  // Helper components and functions remain the same
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': case 'stable': return 'text-green-600 bg-green-100';
      case 'ongoing': case 'at risk': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  const SchemeStatus = ({ name, isEligible }: { name: string; isEligible: boolean }) => (
    <div className={`flex items-center gap-2 p-2 rounded-md ${isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
      {isEligible ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
      <div>
        <p className="text-xs font-semibold text-gray-700">{name}</p>
        <p className={`text-xs font-bold ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
          {isEligible ? 'Eligible' : 'Not Eligible'}
        </p>
      </div>
    </div>
  );
  const LandUseBar = ({ value, total, label, color }: { value: number, total: number, label: string, color: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-medium text-gray-600">{label}</p>
          <p className="text-xs font-bold text-gray-800">{value} sq km</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2"><div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div></div>
      </div>
    );
  };
  const TABS = ['Land Use', 'FRA & Community', 'Risk & Conservation'];

  return (
    <div ref={wrapperRef} className={`absolute top-4 left-4 bottom-4 z-[1999] pointer-events-auto transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-[450px]'}`}>
      <div onClick={() => setIsCollapsed(false)} className={`relative h-full ${isCollapsed ? 'bg-white/25' : 'bg-white'} backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden`}>

        {/* --- TOGGLE BUTTON --- */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-4 z-10 p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-transform"
          style={{ transform: isCollapsed ? 'translateX(calc(450px - 5rem))' : 'translateX(0)' }} // Moves button when collapsed
        >
          <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>

        {/* --- COLLAPSED VIEW --- */}
        <div  className={`transition-opacity flex flex-col w-fit justify-center items-center duration-300 ease-in-out ${isCollapsed ? 'opacity-100' : 'opacity-0'}`}>
          <button
        onClick={() => setIsCollapsed(false)}
        className="mt-4 p-2  text-slate-400 hover:bg-slate-400 hover:text-white rounded-4xl transition-colors"
          >
        <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          <h3 className="text-slate-100 font-semibold [writing-mode:vertical-rl] rotate-180 p-4 whitespace-nowrap">
        {forest.name}
          </h3>
        </div>

        {/* --- EXPANDED VIEW --- */}
        <div className={`flex-grow p-5 transition-opacity duration-300 ease-in-out absolute inset-0 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800 mb-3 pr-8">{forest.name}</h2>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800"><X size={20} /></button>
          </div>

          {/* Scheme Eligibility Section */}
          <div className="mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-2">
          <Handshake className="h-4 w-4 text-blue-600" />
          Scheme Eligibility
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <SchemeStatus name="PM-KISAN" isEligible={forest.schemeEligibility.pmKisan} />
          <SchemeStatus name="Jal Jeevan" isEligible={forest.schemeEligibility.jalJeevan} />
          <SchemeStatus name="MGNREGA" isEligible={forest.schemeEligibility.mgnrega} />
          <SchemeStatus name="DAJGUA" isEligible={forest.schemeEligibility.dajgua} />
        </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4" aria-label="Tabs">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
          className={`${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >{tab}</button>
          ))}
        </nav>
          </div>

          {/* Tab Content */}
          <div className="pt-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 220px)' }}> {/* Makes content scrollable */}
        {activeTab === 'Land Use' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center"><Map size={14} className="mr-2" />Land Use Breakdown</h4>
          <LandUseBar value={forest.landUse.forestCover} total={forest.landUse.totalArea} label="Forest Cover" color="bg-green-500" />
          <LandUseBar value={forest.landUse.agriculturalLand} total={forest.landUse.totalArea} label="Agricultural Land" color="bg-yellow-500" />
          <LandUseBar value={forest.landUse.waterBodies} total={forest.landUse.totalArea} label="Water Bodies" color="bg-blue-500" />
          <div className="flex items-center gap-2 pt-2"><Tent size={14} className="text-gray-500" /><p className="text-xs text-gray-600"><span className="font-bold">{forest.landUse.homesteads}</span> Homesteads recorded</p></div>
            </div>
            <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center"><Layers size={14} className="mr-2" />Data Layers & Insights</h4>
          <p className="text-xs text-gray-600">Classification Model: <span className="font-bold text-gray-800">{forest.dataLayers.classificationModel}</span></p>
          <p className="text-xs text-gray-600">Groundwater Level: <span className={`font-bold px-2 py-0.5 rounded-full ${getStatusColor(forest.dataLayers.groundwaterLevel)}`}>{forest.dataLayers.groundwaterLevel}</span></p>
          <p className="text-xs text-gray-600">PM Gati Shakti Score: <span className="font-bold text-gray-800">{forest.dataLayers.infrastructureScore}/100</span></p>
            </div>
          </div>
        )}

        {activeTab === 'FRA & Community' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* FRA Details */}
            <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center">
            <UserCheck size={14} className="mr-2" /> FRA Status
          </h4>
          <p className="text-xs text-gray-600">Coverage: <span className="font-bold">{forest.fra.coverage}</span></p>
          <p className="text-xs text-gray-600">Granted Claims: <span className="font-bold">{forest.fra.granted}</span> out of <span className="font-bold">{forest.fra.claims}</span></p>
          <p className="text-xs text-gray-600">Current Status: <span className="font-bold">{forest.fra.status}</span></p>
            </div>

            {/* Community Details */}
            <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center">
            <Users size={14} className="mr-2" /> Community Insights
          </h4>
          <p className="text-xs text-gray-600">Households: <span className="font-bold">{forest.community.households}</span></p>
          <p className="text-xs text-gray-600">Dependence on Forest: <span className="font-bold">{forest.community.dependence}</span></p>
          <p className="text-xs text-gray-600">Population Trend: <span className="font-bold">{forest.community.trend}</span></p>
            </div>
          </div>
        )}

        {activeTab === 'Risk & Conservation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Risk Details */}
            <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center">
            <AlertTriangle size={14} className="mr-2" /> Risk Assessment
          </h4>
          <p className="text-xs text-gray-600">Fire Risk Level: <span className="font-bold">{forest.risk.fireLevel}</span></p>
          <p className="text-xs text-gray-600">Area Affected by Fire: <span className="font-bold">{forest.risk.firePercentage}%</span></p>
          <p className="text-xs text-gray-600">Last Fire Incident: <span className="font-bold">{forest.risk.lastIncident}</span></p>
            </div>

            {/* Conservation Details */}
            <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center">
            <Leaf size={14} className="mr-2" /> Conservation Status
          </h4>
          <p className="text-xs text-gray-600">Biodiversity Index: <span className="font-bold">{forest.conservation.biodiversityIndex}</span></p>
          <p className="text-xs text-gray-600">Endangered Species Count: <span className="font-bold">{forest.conservation.endangeredSpecies}</span></p>
          <p className="text-xs text-gray-600">Conservation Status: <span className="font-bold">{forest.conservation.status}</span></p>
            </div>
          </div>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}