import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewComponent } from './components/map-view/map-view.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { expand } from 'rxjs';
// ...existing code...
import { SyncService } from './services/sync.service'; // <-- importer le service
// ...existing code...

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, MapViewComponent],
  templateUrl: './app.component.html', // supprimer l'espace
  styleUrls: ['./app.component.css']   // corriger en styleUrls
})
export class AppComponent {
  title = 'TortueGoApp';
  constructor(private syncService: SyncService) {} // <-- INJECT

  ngOnInit(): void {
    this.syncService.init(); // <-- DÉMARRE LE SERVICE
  }
}