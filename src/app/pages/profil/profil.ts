import { Component, inject, signal } from '@angular/core';

import { ProgressionJoueur, ProgressionService } from '../../core/services/progression';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.html',
  styleUrl: './profil.scss',
  imports: [Navbar],
})
export class Profil {
  private readonly progressionService = inject(ProgressionService);

  progression = signal<ProgressionJoueur | null>(null);
  erreur = signal<string | null>(null);
  chargement = signal(true);

  constructor() {
    this.progressionService.recupererMaProgression().subscribe({
      next: (progression) => {
        this.progression.set(progression);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer la progression.');
        this.chargement.set(false);
      },
    });
  }
}
