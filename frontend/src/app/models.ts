// interface for the Doctor data type
export interface Doctor {
  id: number;
  full_name: string;
}

// interface for the Patient data type
export interface Patient {
  id: number;
  full_name: string;
  doctor_id: number;
}
