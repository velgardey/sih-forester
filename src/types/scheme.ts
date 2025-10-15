export interface Scheme {
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

export interface SchemeData {
  schemes: Scheme[];
}
