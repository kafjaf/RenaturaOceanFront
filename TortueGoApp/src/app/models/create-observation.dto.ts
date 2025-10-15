// src/app/models/observation.dto.ts

export interface ObservationDto {
  id: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  description?: string;
  observedAt: string;
  // --- NOUVEAUX CHAMPS ---
  species?: string;        // Ex: "Tortue Luth", "Tortue Verte", etc.
  speciesConfidence?: number; // Ex: 0.95 (pour 95% de confiance)
}