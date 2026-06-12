import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CombatResponse, CombatService } from '../../core/services/combat';
import { Capacite, CapaciteService } from '../../core/services/capacite';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.html',
  styleUrl: './combat.scss',
  imports: [Navbar],
})
export class Combat {
  private readonly combatService = inject(CombatService);
  private readonly capaciteService = inject(CapaciteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly zoneId: number = Number(this.route.snapshot.paramMap.get('zoneId'));

  capacites = signal<Capacite[]>([]);
  combat = signal<CombatResponse | null>(null);

  chargement = signal(true);
  actionEnCours = signal(false);
  message = signal<string | null>(null);
  erreur = signal<string | null>(null);
  apresDefaiteOuFuite = signal(false);

  constructor() {
    this.recupererCapacites();
    this.recupererCombatEnCours();
  }

  recupererCapacites(): void {
    this.capaciteService.recupererCapacitesPersonnage().subscribe({
      next: (capacites) => {
        this.capacites.set(capacites);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer les capacités.');
        this.chargement.set(false);
      },
    });
  }

  recupererCombatEnCours(): void {
    this.combatService.recupererCombatEnCours().subscribe({
      next: (combat) => {
        this.combat.set(combat);
        if (combat.statut !== 'EN_COURS') {
          this.apresDefaiteOuFuite.set(true);
        }
      },
      error: () => this.combat.set(null),
    });
  }

  lancerCombat(): void {
    this.actionEnCours.set(true);
    this.message.set(null);
    this.erreur.set(null);
    this.apresDefaiteOuFuite.set(false);

    this.combatService.demarrerCombatZone(this.zoneId).subscribe({
      next: (combat) => {
        this.combat.set(combat);
        this.message.set(`Combat engagé contre ${combat.ennemi} !`);
        this.actionEnCours.set(false);
      },
      error: (error) => {
        this.erreur.set(error?.error?.message ?? 'Impossible de démarrer le combat.');
        this.actionEnCours.set(false);
      },
    });
  }

  utiliserCapacite(capacite: Capacite): void {
    this.actionEnCours.set(true);
    this.message.set(null);
    this.erreur.set(null);

    this.combatService.utiliserCapacite(capacite.id).subscribe({
      next: (combat) => {
        this.combat.set(combat);
        this.message.set(this.messageCombat(combat, capacite.nom));
        this.actionEnCours.set(false);

        if (combat.statut !== 'EN_COURS') {
          this.apresDefaiteOuFuite.set(true);
        }
      },
      error: (error) => {
        this.erreur.set(error?.error?.message ?? "Impossible d'utiliser cette capacité.");
        this.actionEnCours.set(false);
      },
    });
  }

  fuir(): void {
    this.actionEnCours.set(true);
    this.message.set(null);
    this.erreur.set(null);

    this.combatService.fuirCombat().subscribe({
      next: (combat) => {
        this.combat.set(combat);
        this.message.set('Vous avez fui le combat.');
        this.actionEnCours.set(false);
        this.apresDefaiteOuFuite.set(true);
      },
      error: (error) => {
        this.erreur.set(error?.error?.message ?? 'Impossible de fuir.');
        this.actionEnCours.set(false);
      },
    });
  }

  relancerCombat(): void {
    this.combat.set(null);
    this.apresDefaiteOuFuite.set(false);
    this.message.set(null);
    this.lancerCombat();
  }

  allerAuberge(): void {
    this.router.navigate(['/auberge']);
  }

  retourIle(): void {
    this.router.navigate(['/monde']);
  }

  combatActif(): boolean {
    return this.combat()?.statut === 'EN_COURS';
  }

  private messageCombat(combat: CombatResponse, capaciteNom: string): string {
    if (combat.statut === 'VICTOIRE') {
      const r = combat.recompense;
      return `Victoire contre ${combat.ennemi} ! +${r?.experience} XP, +${r?.prime} Prime`;
    }
    if (combat.statut === 'DEFAITE') {
      return `Défaite contre ${combat.ennemi}.`;
    }
    return `Vous utilisez ${capaciteNom} contre ${combat.ennemi}.`;
  }
}
