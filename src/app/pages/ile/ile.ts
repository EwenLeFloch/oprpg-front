import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IleData, MondeService, ZoneData } from '../../core/services/monde';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-ile',
  templateUrl: './ile.html',
  styleUrl: './ile.scss',
  imports: [Navbar],
})
export class Ile {
  private readonly mondeService = inject(MondeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly ileId = Number(this.route.snapshot.paramMap.get('ileId'));

  ile = signal<IleData | null>(null);
  zones = signal<ZoneData[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  constructor() {
    this.mondeService.recupererIleParId(this.ileId).subscribe({
      next: (ile) => {
        this.ile.set(ile);
        this.chargerZones();
      },
      error: () => {
        this.erreur.set("Impossible de récupérer l'île.");
        this.chargement.set(false);
      },
    });
  }

  private chargerZones(): void {
    this.mondeService.recupererZonesParIle(this.ileId).subscribe({
      next: (zones) => {
        this.zones.set(zones);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer les zones.');
        this.chargement.set(false);
      },
    });
  }

  allerAuCombat(zone: ZoneData): void {
    this.router.navigate(['/combat', zone.id]);
  }

  retourMonde(): void {
    this.router.navigate(['/monde']);
  }
}
