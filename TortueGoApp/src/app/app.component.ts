// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { SyncService } from './services/sync.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, MapViewComponent],
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