import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-inscription',
  imports: [FormsModule, Navbar],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss',
})
export class Inscription {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  pseudo = '';
  email = '';
  motDePasse = '';

  erreur = signal<string | null>(null);
  chargement = signal(false);

  inscrire(): void {
    this.erreur.set(null);
    this.chargement.set(true);

    this.auth
      .inscrire({
        pseudo: this.pseudo,
        email: this.email,
        motDePasse: this.motDePasse,
      })
      .subscribe({
        next: () => {
          this.chargement.set(false);
          this.router.navigate(['/connexion']);
        },
        error: (error) => {
          this.chargement.set(false);
          this.erreur.set(error?.error?.message ?? 'Erreur lors de l’inscription.');
        },
      });
  }
}
