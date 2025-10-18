import { SpeciesData } from "../models/species.model";

export const SPECIES_DB: Record<string, SpeciesData> = {
  'green_turtle': { 
    name: 'Tortue Verte', 
    imageUrl: '/assets/images/green-turtle.jpg', 
    description: 'Espèce menacée et protégée, elle est particulièrement touchée par la fibropapillomatose, une maladie tumorale virale. Les côtes du Congo sont un site d\'alimentation important pour ses juvéniles.'
  },
  'loggerhead_turtle': { 
    name: 'Tortue Caouanne', 
    imageUrl: '/assets/images/loggerhead-turtle.jpg', 
    description: 'La plus grande des tortues marines. Avec la tortue olivâtre, c\'est l\'une des deux principales espèces qui viennent pondre sur les plages du Congo. Son suivi est essentiel pour évaluer l\'état des populations.'
  },
  'leatherback_turtle': { 
    name: 'Tortue Luth', 
    imageUrl: '/assets/images/leatherback-turtle.jpg', 
    description: 'Avec la tortue luth, c\'est la deuxième espèce la plus observée lors des pontes au Congo. Elle est menacée par les captures accidentelles dans les filets de pêche artisanale'
  },
  'hawksbill_turtle': { 
    name: 'Tortue Imbriquée', 
    imageUrl: '/assets/images/hawksbill-turtle.jpg', 
    description: 'Bien que moins fréquente pour la ponte au Congo, cette tortue carnivore est présente dans les eaux et reste vulnérable aux activités de pêche'
  },
  'generic_turtle': { 
    name: 'Tortue Marine', 
    imageUrl: '/assets/images/generic-turtle.jpg', 
    description: 'Les tortues marines sont de grands reptiles qui peuplent tous les océans du monde à l\'exception de l\'Arctique.'
  }
};