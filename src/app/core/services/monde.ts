import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface Ile {
  id: number;
  nom: string;
  imagePath: string;
  description: string;
  niveauRequis: number;
}

export interface Zone {
  id: number;
  nom: string;
  niveauRequis: number;
  ileId: number;
  ileNom: string;
}

@Injectable({
  providedIn: 'root',
})
export class MondeService {
  private readonly http = inject(HttpClient);

  recupererIles(): Observable<Ile[]> {
    return this.http.get<Ile[]>(`${API_BASE_URL}/iles`);
  }

  recupererIleParId(ileId: number): Observable<Ile> {
    return this.http.get<Ile>(`${API_BASE_URL}/iles/${ileId}`);
  }

  recupererZonesParIle(ileId: number): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${API_BASE_URL}/zones/ile/${ileId}`);
  }
}
