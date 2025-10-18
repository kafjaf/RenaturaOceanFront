// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { SyncService } from './services/sync.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ExploreComponent } from './components/explore/explore.component';
import { MaterialModule } from './shared/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, MapViewComponent, ExploreComponent, // <-- AJOUTER
    MaterialModule     // <-- AJOUTER
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // <-- CHANGÉ DE .scss À .css
})
export class AppComponent implements OnInit {
  title = 'TortueGoApp';

  constructor(private syncService: SyncService) {}

  ngOnInit(): void {
    this.syncService.init();
  }
}