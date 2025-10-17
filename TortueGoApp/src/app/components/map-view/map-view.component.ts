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
    this.map = L.map('map', {
      center: [-4.783333, 11.866667], // Centre sur Pointe-Noire
      zoom: 13,
    });

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

      const speciesHtml = obs.species
        ? `<div class="species-info">
             <i class="material-icons">verified</i>
             <span>Espèce identifiée : <strong>${obs.species}</strong></span>
           </div>`
        : ''; // Si species est null, on n'affiche rien


      const popupContent = `
        <div class="popup-content">
          <img src="${obs.photoUrl}" alt="Observation de tortue">
          ${speciesHtml}
          <p>${obs.description || 'Aucune description'}</p>
        </div>
      `;
      marker.bindPopup(popupContent);

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