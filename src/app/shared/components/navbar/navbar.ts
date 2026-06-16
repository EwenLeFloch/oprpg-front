import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { ProgressionService } from '../../../core/services/progression';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [RouterLink],
})
export class Navbar implements OnInit {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly progressionService = inject(ProgressionService);

  zoneId = signal<number | null>(null);

  ngOnInit(): void {
    if (this.estConnecte()) {
      this.progressionService.recupererMaProgression().subscribe({
        next: (progression) => this.zoneId.set(progression.zoneId),
        error: () => this.zoneId.set(null),
      });
    }
  }

  estConnecte(): boolean {
    return this.auth.estConnecte();
  }

  deconnecter(): void {
    this.auth.deconnecter();
  }
}
