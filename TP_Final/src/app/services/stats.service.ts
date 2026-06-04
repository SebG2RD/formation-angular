import { Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CharacterService } from './character.service';
import { EpisodeService } from './episode.service';
import { LocationService } from './location.service';

/** Charge les totaux globaux (info.count) pour le tableau de bord. */
@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly characterService = inject(CharacterService);
  private readonly locationService = inject(LocationService);
  private readonly episodeService = inject(EpisodeService);

  readonly totalCharacters = signal(0);
  readonly totalLocations = signal(0);
  readonly totalEpisodes = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      characters: this.characterService.getAll(1),
      locations: this.locationService.getAll(1),
      episodes: this.episodeService.getAll(1),
    }).subscribe({
      next: ({ characters, locations, episodes }) => {
        this.totalCharacters.set(characters.info.count);
        this.totalLocations.set(locations.info.count);
        this.totalEpisodes.set(episodes.info.count);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les statistiques.');
        this.loading.set(false);
      },
    });
  }
}
