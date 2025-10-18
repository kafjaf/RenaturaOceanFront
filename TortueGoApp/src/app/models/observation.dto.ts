// src/app/models/observation.dto.ts

export interface ObservationDto {
  id: string; // Guid est une string en JSON
  latitude: number;
  longitude: number;
  photoUrl: string;
  description?: string;
  species?: string;
  observedAt: string; // Les dates sont généralement transmises comme des chaînes de caractères au format ISO
  threatType?: string; // NOUVEAU CHAMP

}
/*id: string : Le type Guid de C# est sérialisé en une string en JSON.
observedAt: string : De même, DateTime devient une string. Vous pourrez la convertir en objet Date en TypeScript si nécessaire."*/