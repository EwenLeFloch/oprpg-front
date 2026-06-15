import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Faction, FactionService } from '../../core/services/faction';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-faction',
  templateUrl: './faction.html',
  styleUrl: './faction.scss',
  imports: [Navbar],
})
export class FactionPage {
  private readonly factionService = inject(FactionService);
  private readonly router = inject(Router);

  factions = signal<Faction[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);
  envoiEnCours = signal(false);

  constructor() {
    this.factionService.recupererFactions().subscribe({
      next: (factions) => {
        this.factions.set(factions);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer les factions.');
        this.chargement.set(false);
      },
    });
  }

  choisirFaction(faction: Faction): void {
    this.envoiEnCours.set(true);
    this.erreur.set(null);

    this.factionService.choisirFaction(faction.id).subscribe({
      next: () => this.router.navigate(['/monde']),
      error: (error) => {
        this.erreur.set(error?.error?.message ?? 'Impossible de choisir cette faction.');
        this.envoiEnCours.set(false);
      },
    });
  }
}
