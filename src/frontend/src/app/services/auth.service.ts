import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly adminCheckUrl = 'http://localhost:8080/api/admin/check';
  private readonly storageKey = 'car-parts-shop-admin-token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ status: string; role: string }> {
    const token = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({ Authorization: `Basic ${token}` });
    return this.http.get<{ status: string; role: string }>(this.adminCheckUrl, { headers }).pipe(
      tap(() => localStorage.setItem(this.storageKey, token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.storageKey);
    return new HttpHeaders({
      Authorization: `Basic ${token ?? ''}`,
      'Content-Type': 'application/json'
    });
  }
}
