import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-connexion',
  imports: [FormsModule, Navbar],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  email = '';
  motDePasse = '';

  erreur = signal<string | null>(null);
  chargement = signal(false);

  connecter(): void {
    this.erreur.set(null);
    this.chargement.set(true);

    this.auth
      .connecter({
        email: this.email,
        motDePasse: this.motDePasse,
      })
      .subscribe({
        next: () => {
          this.chargement.set(false);
          this.router.navigate(['/accueil']);
        },
        error: () => {
          this.chargement.set(false);
          this.erreur.set('Email ou mot de passe incorrect.');
        },
      });
  }
}
