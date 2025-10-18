import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationDto } from '../../models/observation.dto';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ObservationService } from '../../services/observation.service'; // <-- LIGNE CORRIGÉE
import { MatIcon } from '@angular/material/icon';
import { ReportFormComponent } from '../report-form/report-form.component';
import 'leaflet.markercluster'; // <-- AJOUTEZ CET IMPORT pour activer le plugin
import { SpeciesData } from '../../models/species.model';
import { SpeciesInfoComponent } from '../species-info/species-info.component';
import { SPECIES_DB } from '../../data/species.db';



// Correction pour l'icône par défaut de Leaflet
const iconDefault = L.icon({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MatIcon], // <-- IMPORTS AJOUTÉS
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css' // <-- CHANGÉ DE .scss À .css AU CAS OÙ
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {

   // NOUVELLE MÉTHODE pour ouvrir la modale
      // openSpeciesInfo(speciesName: string): void {
      //   const speciesData = SPECIES_DB[speciesName] || SPECIES_DB['Turtle']; // Fallback

      //   if (speciesData) {
      //     this.dialog.open(SpeciesInfoComponent, {
      //       width: '450px',
      //       data: speciesData
      //     });
      //   }
      // }

       openSpeciesInfo(speciesKey: string): void { // La méthode reçoit maintenant la clé
    const speciesDataToShow = SPECIES_DB[speciesKey]; // On cherche directement avec la clé

    if (speciesDataToShow) {
      this.dialog.open(SpeciesInfoComponent, {
        width: '450px',
        data: speciesDataToShow // On envoie l'objet complet à la modale
      });
    }
  }

  private map!: L.Map;
  private observations: ObservationDto[] = [];
  private observationSub!: Subscription;
  private markersLayer = L.layerGroup(); // Utiliser un layer group pour gérer les marqueurs facilement

  constructor(
    public dialog: MatDialog,
    private observationService: ObservationService // <-- LIGNE CORRIGÉE
  ) {}



  ngOnInit(): void {
    // S'abonne à l'événement de création pour rafraîchir la carte
    this.observationSub = this.observationService.observationCreated$.subscribe(() => {
      // AJOUTEZ CE LOG
      console.log('%c[MapViewComponent] Signal "observationCreated" REÇU ! Déclenchement de loadObservations()...', 'color: blue; font-weight: bold;');
      this.loadObservations(true); // true = un nouveau marqueur a été ajouté
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadObservations();
  }

  ngOnDestroy(): void {
    this.observationSub.unsubscribe();
  }

  private initMap(): void {
    // 1. Définir nos différentes couches de base (base layers)
    const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    });

        // NOUVEAU : La couche de vue satellite de Esri (excellente qualité et gratuite)
    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18
    });

     // 2. Initialiser la carte
    this.map = L.map('map', {
      center: [-4.783333, 11.866667], // Centre sur Pointe-Noire
      zoom: 13,
      layers: [streetMap] // MODIFIÉ : La couche par défaut est la vue "Plan"
    });

        // 3. Créer l'objet qui sera utilisé par le contrôle des couches
    const baseMaps = {
      "Vue Plan": streetMap,
      "Vue Satellite": satelliteMap
    };
    L.control.layers(baseMaps).addTo(this.map); // Ajouter le contrôle des couches à la carte

     // 4. Ajouter la couche de tuiles OpenStreetMap
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    tiles.addTo(this.map);

    this.markersLayer.addTo(this.map); // Ajouter le groupe de calques à la carte
  }



   private loadObservations(isNewObservationAdded: boolean = false): void {
    this.observationService.getObservations().subscribe(data => {
      // AJOUTEZ CES LOGS
      console.log(`[MapViewComponent] Données reçues de l'API : ${data.length} observations.`);
      console.log('Nouvelle liste :', data);

      this.observations = data;
      this.renderMarkers();
    });
  }

  private renderMarkers(): void {
     if (this.map.hasLayer(this.markersLayer)) {
      this.map.removeLayer(this.markersLayer);
    }   // Nettoyer tous les anciens marqueurs d'un coup

    // 2. On crée une NOUVELLE instance de MarkerClusterGroup à chaque fois
    this.markersLayer = L.markerClusterGroup();
  

    this.observations.forEach((obs, index) => {
      console.log(`Clé reçue de l'API pour l'observation ${obs.id}: `, obs.species);
      // Création de l'icône personnalisée avec L.divIcon
      const iconHtml = `<i class="material-icons">pets</i>`; // Utilisez 'pets', 'eco', ou une autre icône pertinente

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker-icon', // Ajoute la classe de pulsation si c'est le dernier
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([obs.latitude, obs.longitude], { icon: customIcon });

      // ---- Reconstruction complète et propre du contenu du popup ----
      const speciesData = obs.species ? SPECIES_DB[obs.species] : null;
      const speciesLinkId = `species-link-${obs.id}`;

      const speciesHtml = speciesData
        ? `<div class="species-info">
             <i class="material-icons">verified</i>
             <span>Espèce : <a href="#" id="${speciesLinkId}" class="species-link">${speciesData.name}</a></span>
           </div>`
        : '';
      
      const threatHtml = obs.threatType && obs.threatType !== 'Aucune'
        ? `<div class="threat-info">
             <i class="material-icons">warning</i>
             <span>Menace : <strong>${obs.threatType}</strong></span>
           </div>`
        : '';

      const descriptionHtml = `<p>${obs.description || 'Aucune description'}</p>`;
      
      const popupContent = `
        <div class="popup-content">
          <img src="${obs.photoUrl}" alt="Observation de tortue">
          ${speciesHtml}
          ${threatHtml}
          ${descriptionHtml}
        </div>
      `;
      // ---- Fin de la reconstruction ----
      marker.bindPopup(popupContent);

        // ATTACHEZ L'ÉVÉNEMENT ICI
        marker.on('popupopen', () => {
          setTimeout(() => { // Un petit délai pour s'assurer que le DOM est prêt
            const link = document.getElementById(speciesLinkId);
            if (link) {
              link.addEventListener('click', (e) => {
                e.preventDefault(); // Empêche le lien de remonter la page
                this.openSpeciesInfo(obs.species!);
              });
            }
          }, 0);
        });

       // 4. On AJOUTE le marqueur au GROUPE, et non à la carte directement
      this.markersLayer.addLayer(marker);
    });

     // 5. On AJOUTE le GROUPE entier à la carte
    this.map.addLayer(this.markersLayer);

  }

  openReportDialog(): void {
    navigator.geolocation.getCurrentPosition(
      position => {
        const dialogRef = this.dialog.open(ReportFormComponent, {
          width: '400px',
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      error => {
        console.error('Erreur de géolocalisation', error);
        alert('Impossible de récupérer votre position GPS. Veuillez activer la géolocalisation.');
      }
    );
  }
}