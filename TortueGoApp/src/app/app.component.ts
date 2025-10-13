import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewComponent } from './components/map-view/map-view.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  standalone : true,
  imports: [ToolbarComponent, MapViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TortueGoApp';
}
