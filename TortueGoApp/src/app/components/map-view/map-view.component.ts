// ...existing code...
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ObservationService } from '../../services/observation.service';
import { FilterService, FilterCriteria } from '../../services/filter.service';
import { ReportFormComponent } from '../report-form/report-form.component';
import { ObservationDto } from '../../models/observation.dto';

import 'leaflet.heat';

// ...iconDefault et L.Marker prototype...
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
;(L as any).Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSlideToggleModule, MatDialogModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private observations: ObservationDto[] = [];
  private observationSub!: Subscription;
  private filterSub!: Subscription;
  private heatLayer?: any;
  isHeatmapActive = false;

  constructor(
    public dialog: MatDialog,
    private observationService: ObservationService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.observationSub = this.observationService.observationCreated$.subscribe(() => {
      this.loadObservations();
    });

    // typage explicite pour éviter implicit any
    this.filterSub = this.filterService.filter$.subscribe((criteria: FilterCriteria) => {
      this.applyFilter(criteria);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadObservations();
  }

  ngOnDestroy(): void {
    this.observationSub?.unsubscribe();
    this.filterSub?.unsubscribe();
    if (this.map) this.map.remove();
  }

  private initMap(): void {
    this.map = L.map('map', { center: [-4.783333, 11.866667], zoom: 13 });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap'
    });
    tiles.addTo(this.map);
  }

  private loadObservations(): void {
    this.observationService.getObservations().subscribe((data: ObservationDto[]) => {
      this.observations = data || [];
      this.renderMarkers(this.observations);
    }, err => {
      console.error('Erreur getObservations', err);
      this.observations = [];
      this.renderMarkers([]);
    });
  }

  private renderMarkers(data: ObservationDto[] = this.observations): void {
    if (!this.map) return;

    (this.map as any).eachLayer((layer: any) => {
      if (layer instanceof L.Marker) this.map.removeLayer(layer);
    });

    for (const obs of data) {
      const lat = obs.latitude !== undefined ? parseFloat(String(obs.latitude)) : NaN;
      const lng = obs.longitude !== undefined ? parseFloat(String(obs.longitude)) : NaN;
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

      const marker = L.marker([lat, lng], { icon: iconDefault });
      const confidence = (typeof obs.speciesConfidence === 'number') ? (obs.speciesConfidence * 100) : 0;
      const speciesInfo = obs.species
        ? `<strong>Espèce :</strong> ${obs.species}<br><i>(Confiance : ${confidence.toFixed(0)}%)</i>`
        : '<em>Espèce non identifiée</em>';

      const photoHtml = obs.photoUrl ? `<img src="${obs.photoUrl}" alt="Observation de tortue" width="150">` : '';
      const popupContent = `
        <div class="popup-content">
          ${photoHtml}
          <p>${obs.description || 'Aucune description'}</p>
          <hr>
          <p>${speciesInfo}</p>
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.addTo(this.map);
    }
  }

  private applyFilter(criteria: FilterCriteria): void {
    if (!this.observations.length) return;
    let filtered = [...this.observations];

    if (criteria.species && criteria.species !== 'all') {
      filtered = filtered.filter(obs => obs.species === criteria.species);
    }

    if (criteria.dateRange && criteria.dateRange.start && criteria.dateRange.end) {
      const start = new Date(criteria.dateRange.start);
      const end = new Date(criteria.dateRange.end);
      filtered = filtered.filter(obs => {
        const observed = obs.observedAt ? new Date(obs.observedAt) : null;
        if (!observed || isNaN(observed.getTime())) return false;
        return observed >= start && observed <= end;
      });
    }

    this.renderMarkers(filtered);
  }

  toggleHeatmap(isActive: boolean): void {
    this.isHeatmapActive = isActive;

    if (isActive) {
      const heatData = this.observations.map(obs => [parseFloat(String(obs.latitude)), parseFloat(String(obs.longitude)), 0.5]);
      this.heatLayer = (L as any).heatLayer(heatData, { radius: 25, blur: 15 });
      this.heatLayer.addTo(this.map);
    } else {
      if (this.heatLayer) this.map.removeLayer(this.heatLayer);
      this.renderMarkers();
    }
  }

  openReportDialog(): void {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.dialog.open(ReportFormComponent, {
          width: '400px',
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      error => {
        console.error('Erreur de géolocalisation', error);
        alert('Impossible de récupérer votre position GPS. Veuillez activer la géolocalisation.');
      }
    );
  }
}
// ...existing code...