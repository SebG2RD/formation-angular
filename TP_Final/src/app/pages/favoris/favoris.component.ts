import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-favoris',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CharacterCardComponent],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.scss',
})
export class FavorisComponent {
  private readonly favorisService = inject(FavorisService);

  readonly favoris = this.favorisService.favoris;

  toggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }
}
