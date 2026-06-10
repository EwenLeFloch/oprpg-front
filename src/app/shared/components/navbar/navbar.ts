import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  estConnecte(): boolean {
    return this.auth.estConnecte();
  }

  deconnecter(): void {
    this.auth.deconnecter();
    this.router.navigate(['/connexion']);
  }
}