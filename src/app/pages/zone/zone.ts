import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ZoneData, MondeService } from '../../core/services/monde';

import { ProgressionJoueur, ProgressionService } from '../../core/services/progression';
import { Navbar } from '../../shared/components/navbar/navbar';
import { PersonnageData, PersonnageService } from '../../core/services/personnage';

const MESSAGE_DEFAUT =
  "Besoin de repos ? Va faire un tour à l'auberge.<br />Tu es blessé ? Tu trouveras de quoi te soigner au bar !<br />Envie de progresser ? Tu trouveras des voyous près du moulin.";

@Component({
  selector: 'app-zone',
  templateUrl: './zone.html',
  styleUrl: './zone.scss',
  imports: [Navbar],
})
export class Zone {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mondeService = inject(MondeService);
  private readonly progressionService = inject(ProgressionService);
  private readonly personnageService = inject(PersonnageService);

  zone = signal<ZoneData | null>(null);
  progression = signal<ProgressionJoueur | null>(null);
  makino = signal<PersonnageData | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);
  laitEnCours = signal(false);
  reposEnCours = signal(false);
  messageMakino = signal<string>(MESSAGE_DEFAUT);

  constructor() {
    const zoneId = Number(this.route.snapshot.paramMap.get('zoneId'));
    this.chargerDonnees(zoneId);
  }

  private chargerDonnees(zoneId: number): void {
    this.mondeService.recupererZoneParId(zoneId).subscribe({
      next: (zone) => {
        this.zone.set(zone);
        this.chargerProgression();
        this.chargerMakino();
      },
      error: () => {
        this.erreur.set('Zone introuvable.');
        this.chargement.set(false);
      },
    });
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

  private chargerMakino(): void {
    this.personnageService.recupererParNom('Makino').subscribe({
      next: (makino) => this.makino.set(makino),
      error: () => {},
    });
  }

  vieComplete(): boolean {
    const p = this.progression();
    return p !== null && p.vieActuelle >= p.vieMax;
  }

  boireDuLait(): void {
    this.laitEnCours.set(true);
    this.erreur.set(null);

    this.progressionService.boireDuLait().subscribe({
      next: (progression) => {
        this.messageMakino.set('Tu as bu du lait bien frais, tu te sens mieux !');
        this.progression.set(progression);
        this.laitEnCours.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de boire du lait pour le moment.');
        this.laitEnCours.set(false);
      },
    });
  }

  seReposer(): void {
    const avant = this.progression()?.enduranceActuelle ?? 0;
    const max = this.progression()?.enduranceMax ?? 0;
    this.reposEnCours.set(true);
    this.erreur.set(null);

    this.progressionService.seReposer().subscribe({
      next: (progression) => {
        const recupere = progression.enduranceActuelle - avant;
        if (avant >= max) {
          this.messageMakino.set("Ton endurance était déjà pleine, tu t'es quand même reposé 1h !");
        } else {
          this.messageMakino.set(`Tu t'es reposé ${recupere}h, ça doit faire du bien !`);
        }
        this.progression.set(progression);
        this.reposEnCours.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de se reposer pour le moment.');
        this.reposEnCours.set(false);
      },
    });
  }

  allerCombattre(): void {
    const zoneId = this.zone()?.id;
    if (zoneId) {
      this.router.navigate(['/combat', zoneId]);
    }
  }
}
