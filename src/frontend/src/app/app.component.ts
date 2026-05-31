import { Component } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

registerLocaleData(localePl);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <a class="brand" routerLink="/">
        <span class="brand-mark">AP</span>
        <span>
          <strong>AutoParts</strong>
          <small>sklep z częściami samochodowymi</small>
        </span>
      </a>

      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Sklep</a>
        <a routerLink="/admin" routerLinkActive="active">Panel administratora</a>
        <button *ngIf="authService.isLoggedIn()" (click)="logout()">Wyloguj</button>
      </nav>
    </header>

    <router-outlet />
  `,
  styles: [`
    .site-header { position: sticky; top: 0; z-index: 20; display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 16px clamp(18px, 4vw, 54px); background: rgba(255,255,255,.92); backdrop-filter: blur(16px); border-bottom: 1px solid #e5e7eb; }
    .brand { display: flex; align-items: center; gap: 12px; color: #111827; text-decoration: none; }
    .brand-mark { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; background: #f97316; color: white; font-weight: 900; box-shadow: 0 10px 24px rgba(249,115,22,.32); }
    strong, small { display: block; }
    strong { font-size: 18px; line-height: 1; }
    small { color: #6b7280; margin-top: 3px; }
    nav { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    nav a, nav button { border: 0; border-radius: 999px; padding: 10px 14px; color: #374151; text-decoration: none; background: transparent; font-weight: 800; cursor: pointer; }
    nav a.active, nav a:hover, nav button:hover { background: #111827; color: white; }
    @media (max-width: 760px) { .site-header { align-items: flex-start; flex-direction: column; } }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
