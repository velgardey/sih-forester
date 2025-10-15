export interface Asset {
  id: string;
  type: 'agricultural_land' | 'water_body' | 'forest_cover' | 'homestead';
  locationId: string;
  locationName: string;
  state: string;
  district: string;
  village: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundary: [number, number][];
  area: number;
  unit: string;
  confidence: number;
  detectionDate: string;
  detectionModel: 'CNN' | 'Random Forest';
  modelVersion: string;
  verified: boolean;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  verificationDate?: string;
  imageSource: string;
  imageDate: string;
  resolution: string;
  forestDensity?: string;
  canopyCover?: number;
  cropType?: string;
  waterBodyType?: string;
}

export interface DetectionModel {
  id: string;
  name: string;
  version: string;
  type: 'Deep Learning' | 'Machine Learning';
  accuracy: number;
  supportedAssets: string[];
  trainingDate: string;
  trainingDataSize: string;
}

export interface VerificationStatus {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
}

export interface AssetData {
  assets: Asset[];
  detectionModels: DetectionModel[];
  verificationStatus: VerificationStatus;
}
