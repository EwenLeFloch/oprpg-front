import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface IleData {
  id: number;
  nom: string;
  nomImage: string;
  description: string;
  niveauRequis: number;
  positionX: number;
  positionY: number;
}

export interface ZoneData {
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

  recupererIles(): Observable<IleData[]> {
    return this.http.get<IleData[]>(`${API_BASE_URL}/iles`);
  }

  recupererIleParId(ileId: number): Observable<IleData> {
    return this.http.get<IleData>(`${API_BASE_URL}/iles/${ileId}`);
  }

  recupererZonesParIle(ileId: number): Observable<ZoneData[]> {
    return this.http.get<ZoneData[]>(`${API_BASE_URL}/zones/ile/${ileId}`);
  }

  recupererZoneParId(zoneId: number): Observable<ZoneData> {
    return this.http.get<ZoneData>(`${API_BASE_URL}/zones/${zoneId}`);
  }
}
