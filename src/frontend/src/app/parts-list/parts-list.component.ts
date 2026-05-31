import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CarPart } from '../models/car-part.model';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="admin-products">
      <article class="admin-card" *ngFor="let part of parts">
        <img [src]="part.imageUrl" [alt]="part.name" />
        <div class="details">
          <div class="top-line">
            <span class="badge" [class.inactive]="!part.active">{{ part.active ? 'Widoczny' : 'Ukryty' }}</span>
            <span class="sku">{{ part.sku }}</span>
          </div>
          <h3>{{ part.name }}</h3>
          <p>{{ part.category }} · {{ part.manufacturer }}</p>
          <div class="meta">
            <strong>{{ part.price | currency:'PLN':'symbol-narrow':'1.2-2':'pl' }}</strong>
            <span>Magazyn: {{ part.quantityInStock }} szt.</span>
          </div>
        </div>
        <div class="actions">
          <button (click)="edit.emit(part)">Edytuj</button>
          <button class="danger" (click)="remove.emit(part.id)">Usuń</button>
        </div>
      </article>

      <p class="empty" *ngIf="parts.length === 0">Brak ofert w systemie.</p>
    </section>
  `,
  styles: [`
    .admin-products { display: grid; gap: 14px; }
    .admin-card { display: grid; grid-template-columns: 120px 1fr auto; gap: 16px; align-items: center; background: white; border: 1px solid #e5e7eb; border-radius: 20px; padding: 14px; box-shadow: 0 12px 30px rgba(15,23,42,.07); }
    img { width: 120px; height: 96px; object-fit: cover; border-radius: 16px; background: #e5e7eb; }
    .details { display: grid; gap: 5px; min-width: 0; }
    .top-line, .meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .badge { background: #16a34a; color: white; border-radius: 999px; padding: 5px 9px; font-size: 12px; font-weight: 900; }
    .badge.inactive { background: #6b7280; }
    .sku { color: #6b7280; font-size: 13px; font-weight: 800; }
    h3 { margin: 0; color: #111827; font-size: 19px; }
    p { margin: 0; color: #6b7280; }
    strong { color: #111827; font-size: 20px; }
    .meta span { color: #4b5563; }
    .actions { display: flex; gap: 8px; }
    button { border: 0; border-radius: 12px; padding: 10px 13px; background: #111827; color: white; font-weight: 900; cursor: pointer; }
    .danger { background: #dc2626; }
    .empty { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 24px; text-align: center; color: #6b7280; }
    @media (max-width: 760px) { .admin-card { grid-template-columns: 1fr; } img { width: 100%; height: 190px; } .actions { justify-content: stretch; } .actions button { flex: 1; } }
  `]
})
export class PartsListComponent {
  @Input({ required: true }) parts: CarPart[] = [];
  @Output() edit = new EventEmitter<CarPart>();
  @Output() remove = new EventEmitter<number>();
}
