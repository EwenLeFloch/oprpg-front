import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ProgressionJoueur, ProgressionService } from '../../core/services/progression';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-auberge',
  templateUrl: './auberge.html',
  styleUrl: './auberge.scss',
  imports: [Navbar],
})
export class Auberge {
  private readonly progressionService = inject(ProgressionService);
  private readonly router = inject(Router);

  progression = signal<ProgressionJoueur | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);
  reposEnCours = signal(false);
  reposEffectue = signal(false);

  constructor() {
    this.chargerProgression();
  }

  private chargerProgression(): void {
    this.progressionService.recupererMaProgression().subscribe({
      next: (progression) => {
        this.progression.set(progression);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer votre progression.');
        this.chargement.set(false);
      },
    });
  }

  seReposer(): void {
    this.reposEnCours.set(true);
    this.erreur.set(null);

    this.progressionService.seReposer().subscribe({
      next: (progression) => {
        this.progression.set(progression);
        this.reposEnCours.set(false);
        this.reposEffectue.set(true);
      },
      error: () => {
        this.erreur.set('Impossible de se reposer pour le moment.');
        this.reposEnCours.set(false);
      },
    });
  }

  enduranceComplete(): boolean {
    const progression = this.progression();
    return progression !== null && progression.enduranceActuelle >= progression.enduranceMax;
  }

  allerCombattre(): void {
    const zoneId = this.progression()?.zoneId;
    if (zoneId) {
      this.router.navigate(['/combat', zoneId]);
    }
  }
}
