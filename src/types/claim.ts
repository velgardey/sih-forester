export interface Claim {
  id: string;
  type: 'IFR' | 'CR';
  locationId: string;
  locationName: string;
  state: string;
  district: string;
  village: string;
  block: string;
  claimNumber: string;
  submissionDate: string;
  status: 'Granted' | 'Pending' | 'Under Review' | 'Rejected';
  claimants: number;
  households: number;
  landArea: number;
  unit: string;
  tribalGroup: string;
  boundary: [number, number][];
  rightsType?: string[];
  approvalDate?: string;
  titleIssued: boolean;
  titleNumber?: string;
}

export interface ProgressSummary {
  state?: string;
  district?: string;
  totalClaims: number;
  grantedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  coverage: number;
  households?: number;
}

export interface ClaimData {
  claims: Claim[];
  progressSummary: {
    byState: ProgressSummary[];
    byDistrict: ProgressSummary[];
  };
}
