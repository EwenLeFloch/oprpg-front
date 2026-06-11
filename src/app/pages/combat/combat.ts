import { Component, inject, signal } from '@angular/core';

import { CombatResponse, CombatService, Ennemi } from '../../core/services/combat';
import { Capacite, CapaciteService } from '../../core/services/capacite';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.html',
  styleUrl: './combat.scss',
})
export class Combat {
  private readonly combatService = inject(CombatService);
  private readonly capaciteService = inject(CapaciteService);

  ennemis = signal<Ennemi[]>([]);
  capacites = signal<Capacite[]>([]);
  combat = signal<CombatResponse | null>(null);

  chargement = signal(true);
  actionEnCours = signal(false);
  message = signal<string | null>(null);
  erreur = signal<string | null>(null);

  constructor() {
    this.recupererEnnemis();
    this.recupererCapacites();
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

  recupererCapacites(): void {
    this.capaciteService.recupererCapacitesPersonnage().subscribe({
      next: (capacites) => this.capacites.set(capacites),
      error: () => this.erreur.set('Impossible de récupérer les capacites.'),
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
          this.recupererEnnemis();
        }
      },
      error: (error) => {
        this.erreur.set(error?.error?.message ?? 'Impossible d’utiliser ce capacite.');
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

  private messageCombat(combat: CombatResponse, capaciteNom: string): string {
    if (combat.statut === 'VICTOIRE') {
      return `Victoire contre ${combat.ennemi} ! +${combat.recompense?.experience} XP`;
    }

    if (combat.statut === 'DEFAITE') {
      return `Défaite contre ${combat.ennemi}.`;
    }

    return `Vous utilisez ${capaciteNom} contre ${combat.ennemi}.`;
  }
}
