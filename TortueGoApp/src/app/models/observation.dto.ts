export interface ObservationDto {
  id?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  description?: string;
  photoName?: string;
  photo?: any;
  photoUrl?: string;
  species?: string;
  speciesConfidence?: number; // attendu en 0..1
  observedAt?: string; // ISO date string
  createdAt?: string;
}