export interface Groundwater {
  locationId: string;
  locationName: string;
  state: string;
  district: string;
  level: 'High' | 'Moderate' | 'Low' | 'Stable';
  depth: number;
  unit: string;
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  tds: number;
  tdsUnit: string;
  ph: number;
  hardness: number;
  hardnessUnit: string;
  fluoride: number;
  fluorideUnit: string;
  arsenic: number;
  arsenicUnit: string;
  salinity?: number;
  salinityUnit?: string;
  suitability: WaterSuitability;
  rechargeRate: 'Very High' | 'High' | 'Moderate' | 'Low';
  seasonalVariation: 'Very Low' | 'Low' | 'Moderate' | 'High';
  trend: 'Increasing' | 'Stable' | 'Declining';
  concerns?: string[];
  lastMeasured: string;
  monitoringStation: string;
}

export interface WaterSuitability {
  drinking: 'Highly Suitable' | 'Suitable' | 'Marginally Suitable' | 'Not Suitable';
  irrigation: 'Suitable' | 'Marginally Suitable' | 'Not Suitable';
  industrial: 'Suitable' | 'Marginally Suitable' | 'Not Suitable';
}

export interface GroundwaterData {
  groundwater: Groundwater[];
}
