import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="login-page">
      <section class="login-card">
        <p class="eyebrow">Panel administratora</p>
        <h1>Zaloguj się, aby zarządzać ofertami.</h1>
        <p class="hint">Dodawanie, edycja i usuwanie części jest dostępne tylko po autoryzacji administratora.</p>

        <form (ngSubmit)="login()" autocomplete="off" novalidate>
          <label>
            Login
            <input name="adminUserInput" [(ngModel)]="username" autocomplete="off" autocapitalize="off" spellcheck="false" [readonly]="fieldsReadonly" (focus)="fieldsReadonly = false" required />
          </label>
          <label>
            Hasło
            <input type="password" name="adminPassInput" [(ngModel)]="password" autocomplete="new-password" [readonly]="fieldsReadonly" (focus)="fieldsReadonly = false" required />
          </label>
          <button type="submit" [disabled]="loading">{{ loading ? 'Logowanie...' : 'Zaloguj' }}</button>
          <p class="error" *ngIf="error">{{ error }}</p>
        </form>

        <a routerLink="/" class="back">← Wróć do sklepu</a>
      </section>
    </main>
  `,
  styles: [`
    .login-page { min-height: calc(100vh - 78px); display: grid; place-items: center; padding: 30px 16px; background: radial-gradient(circle at top left, #fed7aa, transparent 32%), #f3f4f6; }
    .login-card { width: min(500px, 100%); background: white; border: 1px solid #e5e7eb; border-radius: 28px; padding: 32px; box-shadow: 0 22px 50px rgba(15,23,42,.13); }
    .eyebrow { margin: 0 0 8px; color: #f97316; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
    h1 { margin: 0; font-size: 34px; line-height: 1.05; letter-spacing: -.03em; }
    .hint { color: #6b7280; line-height: 1.55; }
    form { display: grid; gap: 14px; margin-top: 22px; }
    label { display: grid; gap: 7px; color: #374151; font-weight: 800; }
    input { width: 100%; min-width: 0; border: 1px solid #d1d5db; border-radius: 14px; padding: 12px 14px; font: inherit; }
    button { border: 0; border-radius: 14px; padding: 13px 16px; background: #f97316; color: white; font-weight: 900; cursor: pointer; }
    button:disabled { opacity: .65; cursor: not-allowed; }
    .error { color: #991b1b; background: #fee2e2; padding: 12px; border-radius: 12px; margin: 0; }
    .back { display: inline-block; margin-top: 20px; color: #111827; font-weight: 900; text-decoration: none; }
  `]
})
export class AdminLoginComponent {
  username = '';
  password = '';
  fieldsReadonly = true;
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.username.trim(), this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => {
        this.error = 'Nieprawidłowy login lub hasło administratora.';
        this.loading = false;
      }
    });
  }
}
