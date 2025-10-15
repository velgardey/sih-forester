export interface TribalGroup {
  id: string;
  name: string;
  population: number;
  states: string[];
  language: string;
  primaryOccupation: string;
  description: string;
  fraParticipation: 'High' | 'Medium' | 'Low';
}

export interface TribalGroupData {
  tribalGroups: TribalGroup[];
}
