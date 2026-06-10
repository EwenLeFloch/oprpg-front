import { Component, inject, signal } from '@angular/core';

import { Ile, MondeService, Zone } from '../../core/services/monde';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-monde',
  templateUrl: './monde.html',
  styleUrl: './monde.scss',
  imports: [Navbar],
})
export class Monde {
  private readonly mondeService = inject(MondeService);

  iles = signal<Ile[]>([]);
  zones = signal<Zone[]>([]);
  ileSelectionnee = signal<Ile | null>(null);

  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor() {
    this.mondeService.recupererIles().subscribe({
      next: (iles) => {
        this.iles.set(iles);
        this.chargement.set(false);

        if (iles.length > 0) {
          this.selectionnerIle(iles[0]);
        }
      },
      error: () => {
        this.erreur.set('Impossible de récupérer les îles.');
        this.chargement.set(false);
      },
    });
  }

  selectionnerIle(ile: Ile): void {
    this.ileSelectionnee.set(ile);
    this.zones.set([]);

    this.mondeService.recupererZonesParIle(ile.id).subscribe({
      next: (zones) => this.zones.set(zones),
      error: () => this.erreur.set('Impossible de récupérer les zones.'),
    });
  }
}
