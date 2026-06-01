import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-favoris',
  imports: [RouterLink],
  templateUrl: './pokemon-favoris.html',
  styleUrl: './pokemon-favoris.scss',
})
export class FavorisComponent {
  favoris = inject(FavorisService);
}