import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface Faction {
  id: number;
  nom: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class FactionService {
  private readonly http = inject(HttpClient);

  recupererFactions(): Observable<Faction[]> {
    return this.http.get<Faction[]>(`${API_BASE_URL}/factions`);
  }

  choisirFaction(factionId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/progression/faction/${factionId}`, {});
  }
}
