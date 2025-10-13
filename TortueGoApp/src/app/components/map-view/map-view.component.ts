import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ObservationDto } from '../../models/observation.dto';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ObersationServiceService } from '../../services/obersation-service.service';
import { MatIcon } from '@angular/material/icon';
import { ReportFormComponent } from '../report-form/report-form.component';

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
  standalone : true,
  imports: [MatIcon],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private map!: L.Map;
  private observations: ObservationDto[] = [];
  private observationSub!: Subscription;

    constructor(
    public dialog: MatDialog,
    private observationService: ObersationServiceService
  ) {}


   ngOnInit(): void {
    // S'abonne à l'événement de création pour rafraîchir la carte
    this.observationSub = this.observationService.observationCreated$.subscribe(() => {
      this.loadObservations();
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
  }

  private loadObservations(): void {
    this.observationService.getObservations().subscribe(data => {
      this.observations = data;
      this.renderMarkers();
    });
  }

  private renderMarkers(): void {
    // Nettoyer les anciens marqueurs (si nécessaire)
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    // Ajouter les nouveaux marqueurs
    this.observations.forEach(obs => {
      const marker = L.marker([obs.latitude, obs.longitude]);
      const popupContent = `
        <div class="popup-content">
          <img src="${obs.photoUrl}" alt="Observation de tortue" width="150">
          <p>${obs.description || 'Aucune description'}</p>
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.addTo(this.map);
    });
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
        
        // La magie opère ici : le rafraîchissement est géré par le service
        // via `observationCreated$` pour découpler les composants.
      },
      error => {
        console.error('Erreur de géolocalisation', error);
        alert('Impossible de récupérer votre position GPS. Veuillez activer la géolocalisation.');
      }
    );
  }
}
