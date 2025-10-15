export interface Document {
  id: string;
  name: string;
  type: string;
  state: string;
  district: string;
  village: string;
  date: string;
  description: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  status: string;
  claimants?: number;
  landArea?: string;
  attendees?: number;
  validUntil?: string;
  scale?: string;
  witnesses?: number;
}

export interface DocumentUpload {
  file: File;
  type: string;
  state: string;
  district: string;
  village: string;
  date: string;
  description: string;
}
