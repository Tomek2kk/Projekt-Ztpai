import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarPart } from '../models/car-part.model';
import { CarPartService } from '../services/car-part.service';

@Component({
  selector: 'app-store-front',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  template: `
    <main class="shop-page">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Części samochodowe online</p>
          <h1>Znajdź części do swojego auta bez wychodzenia z garażu.</h1>
          <p class="lead">Filtry, hamulce, oleje, akumulatory i akcesoria eksploatacyjne. Prosty katalog połączony z REST API Spring Boot.</p>
          <div class="hero-actions">
            <a href="#catalog" class="primary">Zobacz ofertę</a>
            <a routerLink="/admin/login" class="ghost">Logowanie administratora</a>
          </div>
        </div>
        <div class="hero-card">
          <span>Promocja tygodnia</span>
          <strong>{{ featuredPart?.name || 'Zestaw serwisowy' }}</strong>
          <p>{{ featuredPart?.manufacturer || 'AutoParts' }}</p>
          <b *ngIf="featuredPart">{{ featuredPart.price | currency:'PLN':'symbol-narrow':'1.2-2':'pl' }}</b>
        </div>
      </section>

      <section class="benefits">
        <article><strong>Szybka wysyłka</strong><span>Produkty z magazynu wysyłamy od ręki.</span></article>
        <article><strong>Sprawdzeni producenci</strong><span>Bosch, Mann, Castrol, Varta i inni.</span></article>
        <article><strong>Bezpieczne zakupy</strong><span>Panel admina chroniony Basic Auth.</span></article>
      </section>

      <section class="catalog-header" id="catalog">
        <div>
          <p class="eyebrow dark">Katalog sklepu</p>
          <h2>Aktualna oferta</h2>
        </div>
        <div class="search-box">
          <input [(ngModel)]="search" (keyup.enter)="loadParts()" placeholder="Szukaj: hamulce, Bosch, filtr..." />
          <button (click)="loadParts()">Szukaj</button>
          <button class="light" (click)="clearSearch()">Wyczyść</button>
        </div>
      </section>

      <div class="categories" *ngIf="categories.length">
        <button [class.selected]="selectedCategory === ''" (click)="selectedCategory = ''">Wszystkie</button>
        <button *ngFor="let category of categories" [class.selected]="selectedCategory === category" (click)="selectedCategory = category">{{ category }}</button>
      </div>

      <p class="error" *ngIf="error">{{ error }}</p>

      <section class="product-grid">
        <article class="product-card" *ngFor="let part of filteredParts">
          <div class="image" [style.backgroundImage]="'url(' + part.imageUrl + ')'">
            <span class="stock" [class.low]="part.quantityInStock < 5">{{ part.quantityInStock > 0 ? 'Dostępny' : 'Brak w magazynie' }}</span>
          </div>
          <div class="content">
            <p class="category">{{ part.category }} · {{ part.manufacturer }}</p>
            <h3>{{ part.name }}</h3>
            <p class="description">{{ part.description }}</p>
            <div class="meta">
              <span>SKU: {{ part.sku }}</span>
              <span>{{ part.quantityInStock }} szt.</span>
            </div>
            <div class="buy-row">
              <strong>{{ part.price | currency:'PLN':'symbol-narrow':'1.2-2':'pl' }}</strong>
              <button [disabled]="part.quantityInStock === 0">Do koszyka</button>
            </div>
          </div>
        </article>

        <p class="empty" *ngIf="filteredParts.length === 0">Brak aktywnych ofert spełniających kryteria wyszukiwania.</p>
      </section>
    </main>
  `,
  styles: [`
    .shop-page { max-width: 1240px; margin: 0 auto; padding: 28px clamp(16px, 4vw, 34px) 56px; }
    .hero { min-height: 430px; border-radius: 34px; padding: clamp(26px, 5vw, 58px); color: white; background: linear-gradient(120deg, rgba(17,24,39,.96), rgba(31,41,55,.88)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80') center/cover; display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 28px; align-items: end; box-shadow: 0 22px 55px rgba(15,23,42,.22); }
    .eyebrow { margin: 0 0 10px; color: #fb923c; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
    .eyebrow.dark { color: #f97316; }
    h1 { max-width: 760px; margin: 0; font-size: clamp(38px, 6vw, 70px); line-height: .98; letter-spacing: -.05em; }
    .lead { max-width: 650px; color: #e5e7eb; font-size: 18px; line-height: 1.6; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
    .primary, .ghost { border-radius: 999px; padding: 13px 18px; font-weight: 900; text-decoration: none; }
    .primary { background: #f97316; color: white; box-shadow: 0 12px 26px rgba(249,115,22,.34); }
    .ghost { background: rgba(255,255,255,.12); color: white; border: 1px solid rgba(255,255,255,.24); }
    .hero-card { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.22); backdrop-filter: blur(12px); border-radius: 26px; padding: 22px; display: grid; gap: 7px; }
    .hero-card span { color: #fed7aa; font-weight: 800; }
    .hero-card strong { font-size: 28px; line-height: 1.1; }
    .hero-card p { margin: 0; color: #e5e7eb; }
    .hero-card b { font-size: 30px; color: #fb923c; }
    .benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 22px 0 34px; }
    .benefits article { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 20px; box-shadow: 0 12px 30px rgba(15,23,42,.07); }
    .benefits strong, .benefits span { display: block; }
    .benefits strong { color: #111827; font-size: 18px; }
    .benefits span { color: #6b7280; margin-top: 5px; }
    .catalog-header { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 16px; }
    h2 { margin: 0; font-size: clamp(30px, 4vw, 44px); letter-spacing: -.03em; }
    .search-box { display: flex; gap: 8px; flex-wrap: wrap; }
    .search-box input { min-width: min(360px, 100%); border: 1px solid #d1d5db; border-radius: 999px; padding: 13px 16px; font: inherit; }
    .search-box button, .categories button, .buy-row button { border: 0; border-radius: 999px; padding: 12px 16px; font-weight: 900; cursor: pointer; background: #111827; color: white; }
    .search-box .light { background: #e5e7eb; color: #111827; }
    .categories { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
    .categories button { background: white; color: #374151; border: 1px solid #e5e7eb; }
    .categories button.selected { background: #f97316; color: white; border-color: #f97316; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 20px; }
    .product-card { background: white; border: 1px solid #e5e7eb; border-radius: 24px; overflow: hidden; box-shadow: 0 14px 36px rgba(15,23,42,.08); transition: transform .18s ease, box-shadow .18s ease; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 22px 44px rgba(15,23,42,.13); }
    .image { height: 190px; background-size: cover; background-position: center; position: relative; }
    .stock { position: absolute; left: 14px; top: 14px; background: #16a34a; color: white; padding: 7px 11px; border-radius: 999px; font-size: 12px; font-weight: 900; }
    .stock.low { background: #ea580c; }
    .content { padding: 19px; display: grid; gap: 10px; }
    .category { margin: 0; color: #f97316; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
    h3 { margin: 0; color: #111827; font-size: 21px; }
    .description { color: #4b5563; margin: 0; min-height: 56px; line-height: 1.45; }
    .meta { display: flex; gap: 8px; flex-wrap: wrap; color: #6b7280; font-size: 13px; }
    .meta span { padding: 6px 9px; border-radius: 11px; background: #f3f4f6; }
    .buy-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 6px; }
    .buy-row strong { color: #111827; font-size: 23px; }
    .buy-row button { background: #f97316; }
    .buy-row button:disabled { background: #9ca3af; cursor: not-allowed; }
    .empty, .error { grid-column: 1 / -1; background: white; border-radius: 18px; padding: 22px; text-align: center; color: #6b7280; }
    .error { color: #991b1b; background: #fee2e2; }
    @media (max-width: 860px) { .hero { grid-template-columns: 1fr; } .benefits { grid-template-columns: 1fr; } .catalog-header { align-items: stretch; flex-direction: column; } }
  `]
})
export class StoreFrontComponent implements OnInit {
  parts: CarPart[] = [];
  search = '';
  selectedCategory = '';
  error = '';

  constructor(private carPartService: CarPartService) {}

  ngOnInit(): void {
    this.loadParts();
  }

  get activeParts(): CarPart[] {
    return this.parts.filter(part => part.active);
  }

  get filteredParts(): CarPart[] {
    return this.selectedCategory
      ? this.activeParts.filter(part => part.category === this.selectedCategory)
      : this.activeParts;
  }

  get categories(): string[] {
    return Array.from(new Set(this.activeParts.map(part => part.category))).sort();
  }

  get featuredPart(): CarPart | undefined {
    return this.activeParts[0];
  }

  loadParts(): void {
    this.carPartService.getAll(this.search).subscribe({
      next: parts => {
        this.parts = parts;
        this.error = '';
        if (this.selectedCategory && !this.categories.includes(this.selectedCategory)) {
          this.selectedCategory = '';
        }
      },
      error: () => this.error = 'Nie udało się pobrać oferty. Sprawdź, czy backend działa na porcie 8080.'
    });
  }

  clearSearch(): void {
    this.search = '';
    this.selectedCategory = '';
    this.loadParts();
  }
}
