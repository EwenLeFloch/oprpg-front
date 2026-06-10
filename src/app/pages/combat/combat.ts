import { Component, inject, signal } from '@angular/core';

import { CombatResponse, CombatService, Ennemi } from '../../core/services/combat';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.html',
  styleUrl: './combat.scss',
})
export class Combat {
  private readonly combatService = inject(CombatService);

  ennemis = signal<Ennemi[]>([]);
  combat = signal<CombatResponse | null>(null);

  chargement = signal(true);
  actionEnCours = signal(false);
  message = signal<string | null>(null);
  erreur = signal<string | null>(null);

  constructor() {
    this.recupererEnnemis();
    this.recupererCombatEnCours();
  }

  recupererEnnemis(): void {
    this.combatService.recupererEnnemisParZone(1).subscribe({
      next: (ennemis) => {
        this.ennemis.set(ennemis);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer les ennemis.');
        this.chargement.set(false);
      },
    });
  }

  recupererCombatEnCours(): void {
    this.combatService.recupererCombatEnCours().subscribe({
      next: (combat) => this.combat.set(combat),
      error: () => this.combat.set(null),
    });
  }

  demarrerCombat(ennemiId: number): void {
    this.actionEnCours.set(true);
    this.message.set(null);
    this.erreur.set(null);

    this.combatService.demarrerCombat(ennemiId).subscribe({
      next: (combat) => {
        this.combat.set(combat);
        this.message.set(`Combat démarré contre ${combat.ennemi}.`);
        this.actionEnCours.set(false);
      },
      error: (error) => {
        this.erreur.set(error?.error?.message ?? 'Impossible de démarrer le combat.');
        this.actionEnCours.set(false);
      },
    });
  }

  attaquer(): void {
    this.utiliserMove(1);
  }

  utiliserMove(moveId: number): void {
    this.actionEnCours.set(true);
    this.message.set(null);
    this.erreur.set(null);

    this.combatService.utiliserMove(moveId).subscribe({
      next: (combat) => {
        this.combat.set(combat);
        this.message.set(this.messageCombat(combat));
        this.actionEnCours.set(false);

        if (combat.statut !== 'EN_COURS') {
          this.recupererEnnemis();
        }
      },
      error: (error) => {
        this.erreur.set(error?.error?.message ?? 'Impossible d’utiliser ce move.');
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
      },
      error: (error) => {
        this.erreur.set(error?.error?.message ?? 'Impossible de fuir.');
        this.actionEnCours.set(false);
      },
    });
  }

  combatActif(): boolean {
    return this.combat()?.statut === 'EN_COURS';
  }

  private messageCombat(combat: CombatResponse): string {
    if (combat.statut === 'VICTOIRE') {
      return `Victoire contre ${combat.ennemi} !`;
    }

    if (combat.statut === 'DEFAITE') {
      return `Défaite contre ${combat.ennemi}.`;
    }

    return `Vous attaquez ${combat.ennemi}.`;
  }
}
