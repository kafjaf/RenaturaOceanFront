// src/app/components/map-view/map-view.component.ts

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationDto } from '../../models/observation.dto';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ObservationService } from '../../services/obersation-service.service'; // CORRIGÉ
import { FilterService } from '../../services/filter.service';
import { MatIconModule } from '@angular/material/icon'; //  CORRECT
import { MatButtonModule } from '@angular/material/button'; // AJOUTÉ
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // AJOUTÉ
import { ReportFormComponent } from '../report-form/report-form.component';

// Importe la librairie pour activer L.heatLayer
import 'leaflet.heat';

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
  imports: [
    CommonModule,
    MatButtonModule, // AJOUTÉ
    MatProgressSpinnerModule, // AJOUTÉ
    MatIconModule,
    ReportFormComponent
  ],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private map!: L.Map;
  private observations: ObservationDto[] = [];
  private observationSub!: Subscription;
  private filterSub!: Subscription;
  private heatLayer?: any;
  public isLoading = true; // Propriété pour le spinner

  constructor(
    public dialog: MatDialog,
    private observationService: ObservationService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.observationSub = this.observationService.observationCreated$.subscribe(() => {
      this.loadObservations();
    });

    this.filterSub = this.filterService.filters$.subscribe(filters => {
      this.applyFilters(filters);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadObservations();
  }

  ngOnDestroy(): void {
    this.observationSub.unsubscribe();
    this.filterSub.unsubscribe();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-4.783333, 11.866667],
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
    this.isLoading = true;
    this.observationService.getObservations().subscribe({
      next: (data: ObservationDto[]) => {
        this.observations = data;
        this.applyFilters(this.filterService.filters.value);
      },
      error: (err) => {
        console.error(err);
        // TODO: Afficher un message d'erreur avec MatSnackBar
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private applyFilters(filters: { species: string }): void {
    let observationsToShow = this.observations;

    if (filters.species && filters.species !== 'all') {
      observationsToShow = this.observations.filter(obs => obs.species === filters.species);
    }
    
    this.renderMarkers(observationsToShow);
  }

  private renderMarkers(observationsToRender: ObservationDto[] = this.observations): void {
    // Nettoyer les anciens marqueurs
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    // Ajouter les nouveaux marqueurs
    observationsToRender.forEach(obs => {
      const marker = L.marker([obs.latitude, obs.longitude]);
      
      const speciesInfo = obs.species
        ? `<strong>Espèce :</strong> ${obs.species} 
          <br>
          <i>(Confiance : ${Math.round((obs.speciesConfidence ?? 0) * 100)}%)</i>`
        : '<em>Espèce non identifiée</em>';

      const popupContent = `
        <div class="popup-content">
          <img src="${obs.photoUrl}" alt="Observation de tortue" width="150">
          <p>${obs.description || 'Aucune description'}</p>
          <hr>
          <p>${speciesInfo}</p>
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.addTo(this.map);
    });
  }

  public onToggleHeatmap(isVisible: boolean): void {
    if (isVisible) {
      this.renderHeatmap();
    } else {
      if (this.heatLayer) {
        this.map.removeLayer(this.heatLayer);
      }
    }
  }

  private renderHeatmap(): void {
    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
    }

    const heatPoints = this.observations.map(obs => [obs.latitude, obs.longitude, 0.5] as [number, number, number]);

    this.heatLayer = L.heatLayer(heatPoints, { radius: 25 });
    this.heatLayer.addTo(this.map);
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