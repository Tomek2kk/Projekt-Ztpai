import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarPart, CarPartRequest } from '../models/car-part.model';
import { CarPartService } from '../services/car-part.service';
import { PartFormComponent } from '../part-form/part-form.component';
import { PartsListComponent } from '../parts-list/parts-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PartFormComponent, PartsListComponent],
  template: `
    <main class="admin-page">
      <section class="admin-hero">
        <div>
          <p class="eyebrow">Administracja sklepu</p>
          <h1>Zarządzanie ofertami</h1>
          <p>Dodawaj nowe części, edytuj dane produktów i usuwaj oferty z katalogu sklepu.</p>
        </div>
        <a routerLink="/">Podgląd sklepu</a>
      </section>

      <p class="error" *ngIf="error">{{ error }}</p>
      <p class="success" *ngIf="message">{{ message }}</p>

      <section class="admin-layout">
        <app-part-form
          [part]="selectedPart"
          (saved)="save($event)"
          (cancel)="selectedPart = undefined" />

        <div class="list-panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow dark">Oferty</p>
              <h2>{{ parts.length }} produktów w systemie</h2>
            </div>
            <button (click)="loadParts()">Odśwież</button>
          </div>

          <app-parts-list
            [parts]="parts"
            (edit)="selectedPart = $event"
            (remove)="delete($event)" />
        </div>
      </section>
    </main>
  `,
  styles: [`
    .admin-page { max-width: 1280px; margin: 0 auto; padding: 28px clamp(16px, 4vw, 34px) 56px; }
    .admin-hero { display: flex; justify-content: space-between; align-items: end; gap: 18px; background: #111827; color: white; border-radius: 30px; padding: 34px; margin-bottom: 22px; box-shadow: 0 20px 44px rgba(15,23,42,.18); }
    .eyebrow { margin: 0 0 8px; color: #fb923c; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
    .eyebrow.dark { color: #f97316; }
    h1 { margin: 0; font-size: clamp(34px, 5vw, 54px); letter-spacing: -.04em; }
    .admin-hero p:not(.eyebrow) { margin-bottom: 0; color: #d1d5db; }
    .admin-hero a, .panel-header button { border: 0; border-radius: 999px; padding: 12px 16px; background: #f97316; color: white; text-decoration: none; font-weight: 900; cursor: pointer; white-space: nowrap; }
    .admin-layout { display: grid; grid-template-columns: minmax(360px, 460px) minmax(0, 1fr); gap: 24px; align-items: start; }
    .list-panel { display: grid; gap: 16px; min-width: 0; }
    .panel-header { display: flex; justify-content: space-between; align-items: end; gap: 12px; min-width: 0; background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 20px; box-shadow: 0 12px 30px rgba(15,23,42,.06); }
    h2 { margin: 0; font-size: 26px; }
    .error, .success { border-radius: 14px; padding: 13px 16px; margin-bottom: 16px; }
    .error { background: #fee2e2; color: #991b1b; }
    .success { background: #dcfce7; color: #166534; }
    @media (max-width: 1000px) { .admin-layout { grid-template-columns: 1fr; } .admin-hero { align-items: flex-start; flex-direction: column; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  parts: CarPart[] = [];
  selectedPart?: CarPart;
  error = '';
  message = '';

  constructor(private carPartService: CarPartService) {}

  ngOnInit(): void {
    this.loadParts();
  }

  loadParts(): void {
    this.carPartService.getAll().subscribe({
      next: parts => {
        this.parts = parts;
        this.error = '';
      },
      error: () => this.error = 'Nie udało się pobrać listy części.'
    });
  }

  save(request: CarPartRequest): void {
    const action = this.selectedPart
      ? this.carPartService.update(this.selectedPart.id, request)
      : this.carPartService.create(request);

    action.subscribe({
      next: () => {
        this.message = this.selectedPart ? 'Oferta została zaktualizowana.' : 'Nowa oferta została dodana.';
        this.selectedPart = undefined;
        this.loadParts();
      },
      error: () => this.error = 'Nie udało się zapisać oferty. Sprawdź dane formularza i logowanie administratora.'
    });
  }

  delete(id: number): void {
    const confirmed = confirm('Czy na pewno chcesz usunąć tę ofertę?');
    if (!confirmed) {
      return;
    }

    this.carPartService.delete(id).subscribe({
      next: () => {
        this.message = 'Oferta została usunięta.';
        this.loadParts();
      },
      error: () => this.error = 'Nie udało się usunąć oferty.'
    });
  }
}
