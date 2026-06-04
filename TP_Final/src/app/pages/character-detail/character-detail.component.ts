import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Episode } from '../../models/episode.model';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';
import { extractIdFromUrl } from '../../utils/url.utils';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { StatusPipe } from '../../pipes/status.pipe';

interface CharacterState {
  loading: boolean;
  error: string | null;
  character: Character | null;
}

const INITIAL_STATE: CharacterState = { loading: true, error: null, character: null };

@Component({
  selector: 'app-character-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent, StatusPipe],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
})
export class CharacterDetailComponent {
  readonly id = input.required<string>();

  private readonly characterService = inject(CharacterService);
  private readonly episodeService = inject(EpisodeService);
  private readonly favorisService = inject(FavorisService);

  private readonly state = toSignal(
    toObservable(this.id).pipe(
      switchMap((idParam) =>
        this.characterService.getById(Number(idParam)).pipe(
          map(
            (character): CharacterState => ({ loading: false, error: null, character }),
          ),
          startWith(INITIAL_STATE),
          catchError(() =>
            of<CharacterState>({
              loading: false,
              error: 'Personnage introuvable.',
              character: null,
            }),
          ),
        ),
      ),
    ),
    { initialValue: INITIAL_STATE },
  );

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly character = computed(() => this.state().character);

  /** Épisodes du personnage, dérivés du personnage déjà chargé. */
  readonly episodes = toSignal(
    toObservable(this.character).pipe(
      switchMap((character) => {
        if (!character) return of<Episode[]>([]);
        const ids = character.episode.map(extractIdFromUrl).filter((i) => i > 0);
        return this.episodeService.getMany(ids);
      }),
    ),
    { initialValue: [] as Episode[] },
  );

  locationId(url: string): number {
    return extractIdFromUrl(url);
  }

  isFavori(character: Character): boolean {
    return this.favorisService.isFavori(character.id);
  }

  toggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }

  retry(): void {
    window.location.reload();
  }
}
