// import { NgModule } from '@angular/core';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSnackBarModule } from '@angular/material/snack-bar';

// const modules = [
//   MatToolbarModule,
//   MatButtonModule,
//   MatIconModule,
//   MatDialogModule,
//   MatFormFieldModule,
//   MatInputModule,
//   MatProgressSpinnerModule,
//   MatSnackBarModule,
  
// ];

// @NgModule({
//   imports: [modules],
//   exports: [modules],
// })
// export class MaterialModule {}
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatRadioModule } from '@angular/material/radio';

const modules = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatOptionModule,
  MatCardModule,
  MatTooltipModule,
  MatDividerModule,
  MatListModule,
  MatTabsModule,
  MatRadioModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class MaterialModule {}
