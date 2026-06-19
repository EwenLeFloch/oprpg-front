import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface PersonnageData {
  id: number;
  nom: string;
  nomImage: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonnageService {
  private readonly http = inject(HttpClient);

  recupererParNom(nom: string): Observable<PersonnageData> {
    return this.http.get<PersonnageData>(`${API_BASE_URL}/personnages/${nom}`);
  }
}
