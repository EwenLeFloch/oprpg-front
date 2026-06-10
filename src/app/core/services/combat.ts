import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface Ennemi {
  id: number;
  nom: string;
  vieMax: number;
  puissance: number;
  experienceMin: number;
  experienceMax: number;
  boss: boolean;
  zoneId: number;
  zoneNom: string;
}

export interface CombatResponse {
  combatId: number;
  ennemi: string;
  vieEnnemiActuelle: number;
  vieJoueurActuelle: number;
  statut: 'EN_COURS' | 'VICTOIRE' | 'DEFAITE' | 'FUITE';
}

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  private readonly http = inject(HttpClient);

  recupererEnnemisParZone(zoneId: number): Observable<Ennemi[]> {
    return this.http.get<Ennemi[]>(`${API_BASE_URL}/ennemis/zone/${zoneId}`);
  }

  recupererCombatEnCours(): Observable<CombatResponse> {
    return this.http.get<CombatResponse>(`${API_BASE_URL}/combats/en-cours`);
  }

  demarrerCombat(ennemiId: number): Observable<CombatResponse> {
    return this.http.post<CombatResponse>(`${API_BASE_URL}/combats/ennemis/${ennemiId}`, {});
  }

  utiliserMove(moveId: number): Observable<CombatResponse> {
    return this.http.post<CombatResponse>(`${API_BASE_URL}/combats/moves/${moveId}`, {});
  }

  fuirCombat(): Observable<CombatResponse> {
    return this.http.post<CombatResponse>(`${API_BASE_URL}/combats/fuite`, {});
  }
}
