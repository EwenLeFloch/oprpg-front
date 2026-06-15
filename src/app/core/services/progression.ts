import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface ProgressionJoueur {
  id: number;
  niveau: number;
  experience: number;
  enduranceMax: number;
  enduranceActuelle: number;
  puissance: number;
  vieMax: number;
  vieActuelle: number;
  berries: number;
  prime: number;
  personnage: string;
  faction: string | null;
  zoneId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProgressionService {
  private readonly http = inject(HttpClient);

  recupererMaProgression(): Observable<ProgressionJoueur> {
    return this.http.get<ProgressionJoueur>(`${API_BASE_URL}/progression/me`);
  }

  seReposer(): Observable<ProgressionJoueur> {
    return this.http.post<ProgressionJoueur>(`${API_BASE_URL}/progression/repos`, {});
  }
}
