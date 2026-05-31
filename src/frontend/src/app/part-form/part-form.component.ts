import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarPart, CarPartRequest } from '../models/car-part.model';

@Component({
  selector: 'app-part-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="card" (ngSubmit)="submit()">
      <h2>{{ part ? 'Edytuj część' : 'Dodaj część' }}</h2>

      <label>
        Nazwa części
        <input name="name" [(ngModel)]="form.name" required maxlength="120" placeholder="np. Klocki hamulcowe" />
      </label>

      <div class="row">
        <label>
          Kategoria
          <input name="category" [(ngModel)]="form.category" required maxlength="80" placeholder="Filtry" />
        </label>
        <label>
          Producent
          <input name="manufacturer" [(ngModel)]="form.manufacturer" required maxlength="80" placeholder="Bosch" />
        </label>
      </div>

      <div class="row">
        <label>
          SKU
          <input name="sku" [(ngModel)]="form.sku" required pattern="[A-Z0-9-]{3,40}" placeholder="BOSCH-123" />
        </label>
        <label>
          Cena PLN
          <input type="number" min="0.01" step="0.01" name="price" [(ngModel)]="form.price" required />
        </label>
      </div>

      <label>
        Ilość w magazynie
        <input type="number" min="0" name="quantityInStock" [(ngModel)]="form.quantityInStock" required />
      </label>

      <label>
        Adres obrazka
        <input name="imageUrl" [(ngModel)]="form.imageUrl" maxlength="500" placeholder="https://..." />
      </label>

      <label>
        Opis
        <textarea name="description" [(ngModel)]="form.description" maxlength="1000"></textarea>
      </label>

      <label class="checkbox">
        <input type="checkbox" name="active" [(ngModel)]="form.active" />
        Produkt widoczny w sklepie
      </label>

      <div class="actions">
        <button type="submit" [disabled]="!canSubmit()">Zapisz</button>
        <button type="button" class="secondary" (click)="cancel.emit()" *ngIf="part">Anuluj</button>
      </div>
    </form>
  `,
  styles: [`
    .card { width: 100%; max-width: 100%; overflow: hidden; background: white; padding: 22px; border-radius: 18px; box-shadow: 0 12px 30px rgba(15,23,42,.10); display: grid; gap: 16px; border: 1px solid #e5e7eb; }
    h2 { margin: 0 0 4px; color: #111827; }
    .row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; align-items: start; }
    label { display: grid; gap: 7px; min-width: 0; font-weight: 700; color: #374151; }
    input, textarea { width: 100%; max-width: 100%; min-width: 0; border: 1px solid #d1d5db; border-radius: 12px; padding: 11px 12px; font: inherit; }
    textarea { min-height: 90px; resize: vertical; }
    .checkbox { display: flex; align-items: center; gap: 8px; }
    .checkbox input { width: auto; min-width: auto; }
    .actions { display: flex; gap: 8px; }
    button { border: 0; border-radius: 10px; padding: 11px 15px; background: #f97316; color: white; font-weight: 800; cursor: pointer; }
    button:disabled { opacity: .5; cursor: not-allowed; }
    .secondary { background: #6b7280; }
    @media (max-width: 700px) { .row { grid-template-columns: 1fr; } }
  `]
})
export class PartFormComponent {
  @Output() saved = new EventEmitter<CarPartRequest>();
  @Output() cancel = new EventEmitter<void>();

  form: CarPartRequest = this.emptyForm();
  private currentPart?: CarPart;

  @Input()
  set part(value: CarPart | undefined) {
    this.currentPart = value;
    this.form = value
      ? {
          name: value.name,
          category: value.category,
          manufacturer: value.manufacturer,
          sku: value.sku,
          price: value.price,
          quantityInStock: value.quantityInStock,
          description: value.description ?? '',
          imageUrl: value.imageUrl ?? '',
          active: value.active
        }
      : this.emptyForm();
  }

  get part(): CarPart | undefined {
    return this.currentPart;
  }

  submit(): void {
    this.saved.emit({
      ...this.form,
      name: this.form.name.trim(),
      category: this.form.category.trim(),
      manufacturer: this.form.manufacturer.trim(),
      sku: this.form.sku.trim().toUpperCase()
    });

    if (!this.currentPart) {
      this.form = this.emptyForm();
    }
  }

  canSubmit(): boolean {
    return !!this.form.name.trim()
      && !!this.form.category.trim()
      && !!this.form.manufacturer.trim()
      && !!this.form.sku.trim()
      && this.form.price > 0
      && this.form.quantityInStock >= 0;
  }

  private emptyForm(): CarPartRequest {
    return {
      name: '',
      category: '',
      manufacturer: '',
      sku: '',
      price: 0,
      quantityInStock: 0,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80',
      active: true
    };
  }
}
