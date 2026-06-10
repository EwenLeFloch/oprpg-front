import { Component } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-accueil',
  imports: [Navbar],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {}
