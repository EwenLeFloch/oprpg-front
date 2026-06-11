import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface Capacite {
  id: number;
  nom: string;
  description: string | null;
  typeCapacite: string;
  valeurMin: number;
  valeurMax: number;
  duree: number;
  precision: number | null;
  coutEndurance: number;
}

@Injectable({
  providedIn: 'root',
})
export class CapaciteService {
  private readonly http = inject(HttpClient);

  recupererCapacitesPersonnage(): Observable<Capacite[]> {
    return this.http.get<Capacite[]>(`${API_BASE_URL}/capacites/personnage`);
  }
}
