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
  private readonly zonesLayer = L.layerGroup();
  private readonly zoomParDefaut = 0;
  private readonly zoomIle = 2;
  private clicResetEffectue = false;
  private ileSelectionnee: IleData | null = null;
  private derniereIleDebloquee: L.LatLngExpression | null = null;
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
    const largeur = 1672;
    const hauteur = 941;

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [hauteur, largeur],
    ];

    this.map = L.map('world-map', {
      crs: L.CRS.Simple,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
      minZoom: 0,
      maxZoom: 2,
    });

    L.imageOverlay('/assets/images/map-monde.png', bounds).addTo(this.map);

    this.map.setMaxBounds(bounds);
    this.map.setView([hauteur / 2, largeur / 2], this.zoomParDefaut);

    this.activerResetAuClicCarte();
  }

  private ajouterMarqueursIles(iles: IleData[]): void {
    if (!this.map) {
      return;
    }

    this.zonesLayer.addTo(this.map);

    iles.forEach((ile) => {
      const accessible = this.ileDebloquee(ile);
      const position: L.LatLngExpression = [ile.positionY, ile.positionX];

      if (accessible) {
        this.derniereIleDebloquee = position;
      }

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
          console.log('position ile:', ile.positionY, ile.positionX);
          this.ileSelectionnee = ile;
          this.clicResetEffectue = false;
          this.map?.setView(position, this.zoomIle);
          this.afficherZonesIle(ile);
        });
      }

      const mettreAJourTooltip = (zoom: number) => {
        overlay.unbindTooltip();
        overlay.bindTooltip(ile.nom, {
          permanent: true,
          direction: 'bottom',
          offset: zoom === 0 ? [35, 0] : [0, 24],
          className: 'island-label',
        });
      };

      mettreAJourTooltip(this.map!.getZoom());

      this.map!.on('zoomend', () => {
        mettreAJourTooltip(this.map!.getZoom());
      });
    });

    this.map.on('zoomend', () => {
      this.gererAffichageSelonZoom();
      this.ajusterLabelsIles();
    });

    setTimeout(() => {
      this.map?.invalidateSize();

      if (this.derniereIleDebloquee) {
        this.map?.setView(this.derniereIleDebloquee, this.zoomParDefaut);
      }

      this.gererAffichageSelonZoom();
      this.ajusterLabelsIles();
    }, 100);
  }

  private afficherZonesIle(ile: IleData): void {
    if (!this.map) {
      return;
    }

    this.zonesLayer.clearLayers();

    if (ile.nomImage !== 'dawn-island') {
      return;
    }

    const positionFuschia: L.LatLngExpression = [500, 1500];
    const villageFuschia = L.circleMarker(positionFuschia, {
      radius: 10,
      color: '#ffd230',
      weight: 3,
      fillColor: '#ffd230',
      fillOpacity: 0.45,
    });

    villageFuschia.bindTooltip('Village de Fuschia', {
      permanent: true,
      direction: 'top',
      className: 'zone-label',
    });

    villageFuschia.on('click', (event) => {
      L.DomEvent.stop(event);
      this.router.navigate(['/zone', 1]);
    });

    villageFuschia.addTo(this.zonesLayer);

    this.gererAffichageSelonZoom();
  }

  private gererAffichageSelonZoom(): void {
    if (!this.map) {
      return;
    }

    const zoom = this.map.getZoom();

    if (zoom < 2) {
      this.map.removeLayer(this.zonesLayer);
    } else if (!this.map.hasLayer(this.zonesLayer)) {
      this.map.addLayer(this.zonesLayer);
    }
  }

  private reinitialiserCarte(): void {
    this.ileSelectionnee = null;
    this.zonesLayer.clearLayers();

    if (!this.derniereIleDebloquee) {
      return;
    }

    const zoom = this.clicResetEffectue ? this.zoomParDefaut : 0;
    this.clicResetEffectue = !this.clicResetEffectue;

    this.map?.setView(this.derniereIleDebloquee, zoom);
    this.gererAffichageSelonZoom();
  }

  private activerResetAuClicCarte(): void {
    this.map?.on('click', () => {
      this.reinitialiserCarte();
    });
  }

  private ajusterLabelsIles(): void {
    if (!this.map) {
      return;
    }

    const zoom = this.map.getZoom();
    let offsetY = zoom * 18;
    let fontSize = 14;

    if (zoom == 0) {
      offsetY = 10 + zoom * 18;
      fontSize = 6;
    } else if (zoom == 3) {
      offsetY = 40 + zoom * 18;
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
