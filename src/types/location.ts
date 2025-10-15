export interface Location {
  id: string;
  name: string;
  type: 'national_park' | 'biosphere_reserve' | 'wildlife_sanctuary' | 'tiger_reserve' | 'tribal_area';
  state: string;
  district: string;
  villages: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  boundary: [number, number][];
  tribalGroups: string[];
  fraProgress: FRAProgress;
  landUse: LandUse;
  dataLayers: DataLayers;
  risk: RiskMetrics;
  schemes: SchemeEligibility;
}

export interface FRAProgress {
  coverage: number;
  totalClaims: number;
  grantedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  households: number;
  status: 'Active' | 'Ongoing' | 'Pending';
  dependency: 'High' | 'Medium' | 'Low';
  populationTrend: 'Increasing' | 'Stable' | 'Decreasing';
}

export interface LandUse {
  agriculturalLand: number;
  forestCover: number;
  waterBodies: number;
  homesteads: number;
}

export interface DataLayers {
  classificationModel: 'CNN' | 'Random Forest';
  groundwaterLevel: 'High' | 'Moderate' | 'Low' | 'Stable';
  pmGatiShaktiScore: number;
}

export interface RiskMetrics {
  fireLevel: 'High' | 'Medium' | 'Low';
  firePercentage: number;
  biodiversityIndex: number;
  endangeredSpecies: number;
  conservationStatus: 'Excellent' | 'Good' | 'Stable' | 'Moderate' | 'Critical';
}

export interface SchemeEligibility {
  pmKisan: boolean;
  mgnrega: boolean;
  jalJeevan: boolean;
  pmay: boolean;
}
