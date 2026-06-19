import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [RouterLink],
})
export class Navbar {
  private readonly auth = inject(Auth);
  zoneId = signal<number | null>(null);

  estConnecte(): boolean {
    return this.auth.estConnecte();
  }

  deconnecter(): void {
    this.auth.deconnecter();
  }
}
