export interface GetPatientsParams {
  case_id: string;
  nationality?: string | null;
  date_confirmed?: string | null;
  date_reported?: string | null;
  age?: number | null;
  sex?: string | null;
  status?: string | null;
  facility?: string | null;
  symptoms?: string | null;
  travel_history: string | null;
}
