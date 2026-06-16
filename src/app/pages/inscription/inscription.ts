import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-inscription',
  imports: [FormsModule, Navbar, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss',
})
export class Inscription {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  pseudo = '';
  email = '';
  motDePasse = '';
  confirmationMotDePasse = '';

  erreurPseudo = signal<string | null>(null);
  erreurEmail = signal<string | null>(null);
  erreurMotDePasse = signal<string | null>(null);
  erreurConfirmation = signal<string | null>(null);
  erreurServeur = signal<string | null>(null);
  chargement = signal(false);

  validerPseudo(): void {
    this.erreurPseudo.set(
      this.pseudo.trim().length < 3 ? 'Le pseudo doit contenir au moins 3 caractères.' : null,
    );
  }

  validerEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.erreurEmail.set(emailRegex.test(this.email) ? null : 'Adresse email invalide.');
  }

  validerMotDePasse(): void {
    this.erreurMotDePasse.set(
      this.motDePasse.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères.' : null,
    );
    if (this.confirmationMotDePasse) {
      this.validerConfirmation();
    }
  }

  validerConfirmation(): void {
    this.erreurConfirmation.set(
      this.motDePasse == this.confirmationMotDePasse
        ? null
        : 'Les mots de passe ne correspondent pas.',
    );
  }

  private formulaireValide(): boolean {
    this.validerPseudo();
    this.validerEmail();
    this.validerMotDePasse();
    this.validerConfirmation();
    return (
      !this.erreurPseudo() &&
      !this.erreurEmail() &&
      !this.erreurMotDePasse() &&
      !this.erreurConfirmation()
    );
  }

  inscrire(): void {
    this.erreurServeur.set(null);
    if (!this.formulaireValide()) return;

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
          this.erreurServeur.set(error?.error?.message ?? "Erreur lors de l'inscription.");
        },
      });
  }
}
