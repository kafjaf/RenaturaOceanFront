// src/app/models/create-observation.dto.ts

export interface CreateObservationDto {
  latitude: number;
  longitude: number;
  description?: string;
  photo: File; // Le fichier image provenant de l'input HTML
}