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
import { Character } from '../../models/character.model';
import { Episode } from '../../models/episode.model';
import { EpisodeService } from '../../services/episode.service';
import { CharacterService } from '../../services/character.service';
import { extractIdFromUrl } from '../../utils/url.utils';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

interface EpisodeState {
  loading: boolean;
  error: string | null;
  episode: Episode | null;
}

const INITIAL_STATE: EpisodeState = { loading: true, error: null, episode: null };

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.scss',
})
export class EpisodeDetailComponent {
  readonly id = input.required<string>();

  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);

  private readonly state = toSignal(
    toObservable(this.id).pipe(
      switchMap((idParam) =>
        this.episodeService.getById(Number(idParam)).pipe(
          map((episode): EpisodeState => ({ loading: false, error: null, episode })),
          startWith(INITIAL_STATE),
          catchError(() =>
            of<EpisodeState>({ loading: false, error: 'Épisode introuvable.', episode: null }),
          ),
        ),
      ),
    ),
    { initialValue: INITIAL_STATE },
  );

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly episode = computed(() => this.state().episode);

  /** Personnages de l'épisode, dérivés de l'épisode déjà chargé. */
  readonly characters = toSignal(
    toObservable(this.episode).pipe(
      switchMap((episode) => {
        if (!episode) return of<Character[]>([]);
        const ids = episode.characters.map(extractIdFromUrl).filter((i) => i > 0);
        return this.characterService.getMany(ids);
      }),
    ),
    { initialValue: [] as Character[] },
  );

  retry(): void {
    window.location.reload();
  }
}
