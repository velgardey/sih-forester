export interface ForestData {
  locationId: string;
  locationName: string;
  state: string;
  district: string;
  protectedAreaType: 'National Park' | 'Biosphere Reserve' | 'Wildlife Sanctuary' | 'Tiger Reserve' | 'Tribal Area';
  establishedYear?: number;
  totalArea: number;
  unit: string;
  forestTypes: ForestType[];
  forestDensity: ForestDensity;
  canopyCover: number;
  biodiversity: Biodiversity;
  keySpecies: string[];
  conservationStatus: 'Excellent' | 'Good' | 'Stable' | 'Moderate' | 'Critical';
  threats: string[];
  lastSurvey: string;
}

export interface ForestType {
  type: string;
  percentage: number;
  area: number;
}

export interface ForestDensity {
  veryDense: number;
  moderatelyDense: number;
  openForest: number;
  scrub: number;
}

export interface Biodiversity {
  floraSpecies: number;
  faunaSpecies: number;
  endangeredSpecies: number;
  threatenedSpecies: number;
}

export interface ForestDataCollection {
  forestData: ForestData[];
}
