import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { IleData, MondeService } from '../../core/services/monde';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-monde',
  templateUrl: './monde.html',
  styleUrl: './monde.scss',
  imports: [Navbar],
})
export class Monde {
  private readonly mondeService = inject(MondeService);
  private readonly router = inject(Router);

  iles = signal<IleData[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor() {
    this.mondeService.recupererIles().subscribe({
      next: (iles) => {
        this.iles.set(iles);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer les îles.');
        this.chargement.set(false);
      },
    });
  }

  allerVersIle(ile: IleData): void {
    this.router.navigate(['/ile', ile.id]);
  }
}
