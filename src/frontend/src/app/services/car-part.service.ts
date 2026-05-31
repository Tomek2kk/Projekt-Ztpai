import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarPart, CarPartRequest } from '../models/car-part.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CarPartService {
  private readonly apiUrl = 'http://localhost:8080/api/car-parts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(search = ''): Observable<CarPart[]> {
    const params = search.trim() ? new HttpParams().set('search', search.trim()) : undefined;
    return this.http.get<CarPart[]>(this.apiUrl, { params });
  }

  create(request: CarPartRequest): Observable<CarPart> {
    return this.http.post<CarPart>(this.apiUrl, request, { headers: this.authService.getAuthHeaders() });
  }

  update(id: number, request: CarPartRequest): Observable<CarPart> {
    return this.http.put<CarPart>(`${this.apiUrl}/${id}`, request, { headers: this.authService.getAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}
