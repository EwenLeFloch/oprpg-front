import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import { IleData, MondeService, ZoneData } from '../../core/services/monde';
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
  readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  progression = signal<ProgressionJoueur | null>(null);
  iles = signal<IleData[]>([]);
  ileSelectionnee = signal<IleData | null>(null);
  zonesIleSelectionnee = signal<ZoneData[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  private map?: L.Map;
  private readonly largeur = 1672;
  private readonly hauteur = 941;
  private readonly bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [this.hauteur, this.largeur],
  ];

  ngAfterViewInit(): void {
    this.initialiserCarte();
    this.chargerDonnees();

    this.destroyRef.onDestroy(() => {
      this.map?.remove();
    });
  }

  ileDebloquee(ile: IleData): boolean {
    const progression = this.progression();
    return !!progression && progression.niveau >= ile.niveauRequis;
  }

  reinitialiserCarte(): void {
    this.ileSelectionnee.set(null);
    this.zonesIleSelectionnee.set([]);
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
    this.map = L.map('world-map', {
      crs: L.CRS.Simple,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
      minZoom: -1,
      maxZoom: 2,
      zoomSnap: 0,
    });

    L.imageOverlay('/assets/images/map-monde.png', this.bounds).addTo(this.map);
    this.map.setMaxBounds(this.bounds);

    const container = document.getElementById('world-map');
    if (container) {
      const observer = new ResizeObserver(() => {
        this.map?.invalidateSize();
        this.map?.fitBounds(this.bounds, { padding: [0, 0] });
        observer.disconnect();
      });
      observer.observe(container);
    }

    this.map.on('click', () => {
      this.reinitialiserCarte();
    });
  }

  private ajouterMarqueursIles(iles: IleData[]): void {
    if (!this.map) {
      return;
    }

    iles.forEach((ile) => {
      const accessible = this.ileDebloquee(ile);

      const tailleIle = 40;
      const boundsIle: L.LatLngBoundsExpression = [
        [ile.positionY - tailleIle / 2, ile.positionX - tailleIle / 2],
        [ile.positionY + tailleIle / 2, ile.positionX + tailleIle / 2],
      ];

      const overlay = L.imageOverlay(`/assets/images/islands/${ile.nomImage}_icon.png`, boundsIle, {
        opacity: accessible ? 1 : 0.45,
        interactive: true,
      }).addTo(this.map!);

      if (accessible) {
        overlay.on('click', (event) => {
          L.DomEvent.stopPropagation(event);
          this.mondeService.recupererZonesParIle(ile.id).subscribe({
            next: (zones) => {
              this.zonesIleSelectionnee.set(zones);
              this.ileSelectionnee.set(ile);
            },
            error: () => {
              this.erreur.set('Impossible de récupérer les zones.');
            },
          });
        });
      }

      const mettreAJourTooltip = (zoom: number) => {
        overlay.unbindTooltip();

        let offset: L.PointExpression;
        if (zoom < 0) {
          offset = [20, 20];
        } else if (zoom < 1) {
          offset = [35, 0];
        } else {
          offset = [0, 24];
        }

        overlay.bindTooltip(ile.nom, {
          permanent: true,
          direction: 'bottom',
          offset,
          className: 'island-label',
        });
      };

      mettreAJourTooltip(this.map!.getZoom());

      this.map!.on('zoomend', () => {
        mettreAJourTooltip(this.map!.getZoom());
      });
    });

    this.map.on('zoomend', () => {
      this.ajusterLabelsIles();
    });

    setTimeout(() => {
      this.map?.invalidateSize();
      this.map?.fitBounds(this.bounds, { padding: [0, 0] });
      this.ajusterLabelsIles();
    }, 200);
  }

  private ajusterLabelsIles(): void {
    if (!this.map) {
      return;
    }

    const zoom = this.map.getZoom();
    let offsetY: number;
    let fontSize: number;

    if (zoom < 0) {
      offsetY = -20;
      fontSize = 8;
    } else if (zoom >= 2) {
      offsetY = 76;
      fontSize = 14;
    } else {
      offsetY = 0;
      fontSize = 14;
    }

    document.querySelectorAll<HTMLElement>('.island-label').forEach((label) => {
      label.style.marginTop = `${offsetY}px`;
      label.style.fontSize = `${fontSize}px`;
    });
  }
}
