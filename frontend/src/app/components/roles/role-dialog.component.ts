
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h1 mat-dialog-title>{{ data.editMode ? 'Modifier' : 'Créer' }} un rôle</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Nom du rôle</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!form.valid">{{ data.editMode ? 'Mettre à jour' : 'Créer' }}</button>
    </div>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 15px; }
  `]
})
export class RoleDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Role | null, editMode: boolean }
  ) {
    this.form = this.fb.group({
      name: [data.role?.name || '', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
