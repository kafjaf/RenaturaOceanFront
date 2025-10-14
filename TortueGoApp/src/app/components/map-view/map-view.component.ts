// src/app/components/map-view/map-view.component.ts

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationDto } from '../../models/observation.dto';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ObservationService } from '../../services/observation.service'; // <-- LIGNE CORRIGÉE
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
  standalone: true,
  imports: [CommonModule, MatIcon, ReportFormComponent], // <-- IMPORTS AJOUTÉS
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css' // <-- CHANGÉ DE .scss À .css AU CAS OÙ
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private map!: L.Map;
  private observations: ObservationDto[] = [];
  private observationSub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private observationService: ObservationService // <-- LIGNE CORRIGÉE
  ) {}

  ngOnInit(): void {
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
    this.observationService.getObservations().subscribe((data: ObservationDto[]) => { // <-- TYPE AJOUTÉ
      this.observations = data;
      this.renderMarkers();
    });
  }

  private renderMarkers(): void {
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

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
      },
      error => {
        console.error('Erreur de géolocalisation', error);
        alert('Impossible de récupérer votre position GPS. Veuillez activer la géolocalisation.');
      }
    );
  }
}