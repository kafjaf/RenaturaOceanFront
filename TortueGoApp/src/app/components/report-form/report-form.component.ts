// src/app/components/report-form/report-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ObservationService } from '../../services/obersation-service.service'; // <-- LIGNE CORRIGÉE
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-report-form',
  standalone : true,  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.css'
})
export class ReportFormComponent implements OnInit {

  reportForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private observationService: ObservationService, // <-- LIGNE CORRIGÉE
    public dialogRef: MatDialogRef<ReportFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { latitude: number; longitude: number }
  ) {
    this.reportForm = this.fb.group({
      description: [''],
      photo: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reportForm.patchValue({ photo: this.selectedFile });
    }
  }

  onSubmit(): void {
    if (this.reportForm.invalid || !this.selectedFile) {
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('latitude', this.data.latitude.toString());
    formData.append('longitude', this.data.longitude.toString());
    formData.append('description', this.reportForm.value.description);
    formData.append('photo', this.selectedFile, this.selectedFile.name);

    this.observationService.createObservation(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Signalement envoyé avec succès !', 'Fermer', { duration: 3000 });
        this.dialogRef.close(true); // Ferme la modale et renvoie 'true'
      },
      error: (err : any) => {
        this.isLoading = false;
        this.snackBar.open("Erreur lors de l'envoi du signalement.", 'Fermer', { duration: 3000, panelClass: 'error-snackbar' });
        console.error(err);
      },
    });
  }
}