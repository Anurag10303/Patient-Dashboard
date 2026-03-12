export interface Contact {
  address: string;
  number: string | null;
  email: string | null;
}

export interface Patient {
  patient_id: number;
  patient_name: string;
  age: number;
  photo_url: string | null;
  contact: Contact[];
  medical_issue: string;
}

export interface PatientsApiResponse {
  data: Patient[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PatientQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  issue?: string;
  minAge?: string;
  maxAge?: string;
  sortBy?: string;
  sortOrder?: string;
}