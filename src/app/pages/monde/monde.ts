import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import { IleData, MondeService } from '../../core/services/monde';
import { ProgressionJoueur, ProgressionService } from '../../core/services/progression';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-monde',
  templateUrl: './monde.html',
  styleUrl: './monde.scss',
  imports: [Navbar],
})
export class Monde implements AfterViewInit {
  private readonly mondeService = inject(MondeService);
  private readonly progressionService = inject(ProgressionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  progression = signal<ProgressionJoueur | null>(null);
  iles = signal<IleData[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  private map?: L.Map;

  ngAfterViewInit(): void {
    this.initialiserCarte();
    this.chargerDonnees();

    this.destroyRef.onDestroy(() => {
      this.map?.remove();
    });
  }

  allerVersIle(ile: IleData): void {
    this.router.navigate(['/ile', ile.id]);
  }

  ileDebloquee(ile: IleData): boolean {
    const progression = this.progression();
    return !!progression && progression.niveau >= ile.niveauRequis;
  }

  private chargerDonnees(): void {
    this.progressionService.recupererMaProgression().subscribe({
      next: (progression) => {
        this.progression.set(progression);
        this.chargerIles();
      },
      error: () => {
        this.erreur.set('Impossible de récupérer la progression.');
        this.chargement.set(false);
      },
    });
  }

  private chargerIles(): void {
    this.mondeService.recupererIles().subscribe({
      next: (iles) => {
        this.iles.set(iles);
        this.ajouterMarqueursIles(iles);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de récupérer les îles.');
        this.chargement.set(false);
      },
    });
  }

  private initialiserCarte(): void {
    const largeur = 1776;
    const hauteur = 887;

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [hauteur, largeur],
    ];

    this.map = L.map('world-map', {
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      minZoom: -2,
      maxZoom: 3,
      maxBoundsViscosity: 0.8,
    });

    L.imageOverlay('/assets/images/map-monde.png', bounds).addTo(this.map);

    this.map.setMaxBounds(bounds);
    this.map.fitBounds(bounds, {
      padding: [0, 0],
    });
  }

  private ajouterMarqueursIles(iles: IleData[]): void {
    if (!this.map) {
      return;
    }

    let derniereIleDebloquee: L.LatLngExpression | null = null;

    iles.forEach((ile) => {
      const accessible = this.ileDebloquee(ile);

      const position: L.LatLngExpression = [ile.positionY, ile.positionX];

      if (accessible) {
        derniereIleDebloquee = position;
      }

      const icon = L.divIcon({
        className: 'island-marker',
        html: `
    <div class="island-content">
      <img src="/assets/images/islands/${ile.nomImage}/icon.png" />
      <span>${ile.nom}</span>
    </div>
  `,
        iconSize: [120, 100],
        iconAnchor: [60, 50],
      });

      const marker = L.marker(position, {
        icon,
        opacity: accessible ? 1 : 0.45,
      }).addTo(this.map!);

      marker.bindPopup(`
      <strong>${ile.nom}</strong><br>
      Niveau requis : ${ile.niveauRequis}
  `);

      if (accessible) {
        marker.on('click', () => this.allerVersIle(ile));
      }
    });

    setTimeout(() => {
      this.map?.invalidateSize();

      if (derniereIleDebloquee) {
        this.map?.setView(derniereIleDebloquee, 0);
      }
    });
  }
}
