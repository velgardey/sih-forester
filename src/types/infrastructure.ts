export interface Infrastructure {
  locationId: string;
  locationName: string;
  state: string;
  district: string;
  pmGatiShaktiScore: number;
  connectivity: Connectivity;
  lastUpdated: string;
}

export interface Connectivity {
  roads: RoadConnectivity;
  railways: RailwayConnectivity;
  electricity: ElectricityConnectivity;
  telecom: TelecomConnectivity;
  waterways?: WaterwayConnectivity;
}

export interface RoadConnectivity {
  score: number;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Low';
  nearestHighway: string;
  distanceToHighway: number;
  unit: string;
  ruralRoadLength: number;
  ruralRoadCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface RailwayConnectivity {
  score: number;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Low';
  nearestStation: string;
  distanceToStation: number;
  unit: string;
}

export interface ElectricityConnectivity {
  score: number;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Low';
  coverage: number;
  reliability: 'High' | 'Moderate' | 'Low';
  hoursPerDay: number;
}

export interface TelecomConnectivity {
  score: number;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Low';
  mobileCoverage: number;
  internetAvailability: number;
  providers: string[];
}

export interface WaterwayConnectivity {
  score: number;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Low';
  type: string;
  importance: string;
}

export interface InfrastructureData {
  infrastructure: Infrastructure[];
}
