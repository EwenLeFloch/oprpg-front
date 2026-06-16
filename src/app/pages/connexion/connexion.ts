import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-connexion',
  imports: [FormsModule, Navbar, RouterLink],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  identifiant = '';
  motDePasse = '';

  erreurIdentifiant = signal<string | null>(null);
  erreurMotDePasse = signal<string | null>(null);
  erreurServeur = signal<string | null>(null);
  chargement = signal(false);

  validerIdentifiant(): void {
    this.erreurIdentifiant.set(
      this.identifiant.trim().length < 3
        ? "L'identifiant doit contenir au moins 3 caractères."
        : null,
    );
  }

  validerMotDePasse(): void {
    this.erreurMotDePasse.set(
      this.motDePasse.length === 0 ? 'Le mot de passe est obligatoire.' : null,
    );
  }

  private formulaireValide(): boolean {
    this.validerIdentifiant();
    this.validerMotDePasse();
    return !this.erreurIdentifiant() && !this.erreurMotDePasse();
  }

  connecter(): void {
    this.erreurServeur.set(null);
    if (!this.formulaireValide()) return;

    this.chargement.set(true);
    this.auth
      .connecter({
        identifiant: this.identifiant,
        motDePasse: this.motDePasse,
      })
      .subscribe({
        next: () => {
          this.chargement.set(false);
          this.router.navigate(['/monde']);
        },
        error: () => {
          this.chargement.set(false);
          this.erreurServeur.set('Identifiant ou mot de passe incorrect.');
        },
      });
  }
}
