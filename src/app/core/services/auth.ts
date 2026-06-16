import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface InscriptionRequest {
  pseudo: string;
  email: string;
  motDePasse: string;
}

export interface UtilisateurResponse {
  id: number;
  pseudo: string;
  email: string;
  role: string;
}

export interface ConnexionRequest {
  identifiant: string;
  motDePasse: string;
}

export interface ConnexionResponse {
  token: string;
  type: string;
  pseudo: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/auth`;

  inscrire(request: InscriptionRequest): Observable<UtilisateurResponse> {
    return this.http.post<UtilisateurResponse>(`${this.apiUrl}/inscription`, request);
  }

  connecter(request: ConnexionRequest): Observable<ConnexionResponse> {
    return this.http.post<ConnexionResponse>(`${this.apiUrl}/connexion`, request).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('pseudo', response.pseudo);
        localStorage.setItem('role', response.role);
      }),
    );
  }

  deconnecter(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('pseudo');
    localStorage.removeItem('role');
  }

  estConnecte(): boolean {
    return !!localStorage.getItem('token');
  }

  getPseudo(): string | null {
    return localStorage.getItem('pseudo');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
