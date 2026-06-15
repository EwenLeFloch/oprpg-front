import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface CombatResponse {
  combatId: number;
  ennemi: string;
  vieEnnemiActuelle: number;
  vieJoueurActuelle: number;
  enduranceActuelle: number;
  bossVaincu: boolean;
  factionsDebloquees: boolean;
  statut: 'EN_COURS' | 'VICTOIRE' | 'DEFAITE' | 'FUITE';
  recompense: {
    experience: number;
    prime: number;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  private readonly http = inject(HttpClient);

  demarrerCombatZone(zoneId: number): Observable<CombatResponse> {
    return this.http.post<CombatResponse>(`${API_BASE_URL}/combats/zones/${zoneId}`, {});
  }

  recupererCombatEnCours(): Observable<CombatResponse> {
    return this.http.get<CombatResponse>(`${API_BASE_URL}/combats/en-cours`);
  }

  utiliserCapacite(capaciteId: number): Observable<CombatResponse> {
    return this.http.post<CombatResponse>(`${API_BASE_URL}/combats/capacites/${capaciteId}`, {});
  }

  fuirCombat(): Observable<CombatResponse> {
    return this.http.post<CombatResponse>(`${API_BASE_URL}/combats/fuite`, {});
  }
}
