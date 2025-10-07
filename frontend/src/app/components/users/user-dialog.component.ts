
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User, Role } from '../../models/user.model';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h1 mat-dialog-title>{{ data.editMode ? 'Modifier' : 'Créer' }} un utilisateur</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="full-width">
          <mat-label>Nom d'utilisateur</mat-label>
          <input matInput formControlName="username" [readonly]="data.editMode">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>
        <mat-form-field class="full-width" *ngIf="!data.editMode">
          <mat-label>Mot de passe</mat-label>
          <input matInput formControlName="password" type="password">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Rôle</mat-label>
          <mat-select formControlName="roleId">
            <mat-option *ngFor="let role of data.roles" [value]="role.id">{{ role.name }}</mat-option>
          </mat-select>
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
export class UserDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User | null, roles: Role[], editMode: boolean }
  ) {
    this.form = this.fb.group({
      username: [data.user?.username || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      password: ['', data.editMode ? [] : Validators.required],
      roleId: [data.user?.role?.id || '', Validators.required]
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
