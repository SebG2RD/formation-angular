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
import { Location } from '../../models/location.model';
import { LocationService } from '../../services/location.service';
import { CharacterService } from '../../services/character.service';
import { extractIdFromUrl } from '../../utils/url.utils';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

interface LocationState {
  loading: boolean;
  error: string | null;
  location: Location | null;
}

const INITIAL_STATE: LocationState = { loading: true, error: null, location: null };

@Component({
  selector: 'app-location-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent],
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.scss',
})
export class LocationDetailComponent {
  readonly id = input.required<string>();

  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);

  private readonly state = toSignal(
    toObservable(this.id).pipe(
      switchMap((idParam) =>
        this.locationService.getById(Number(idParam)).pipe(
          map((location): LocationState => ({ loading: false, error: null, location })),
          startWith(INITIAL_STATE),
          catchError(() =>
            of<LocationState>({ loading: false, error: 'Lieu introuvable.', location: null }),
          ),
        ),
      ),
    ),
    { initialValue: INITIAL_STATE },
  );

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly location = computed(() => this.state().location);

  /** Résidents du lieu, dérivés du lieu déjà chargé. */
  readonly residents = toSignal(
    toObservable(this.location).pipe(
      switchMap((location) => {
        if (!location) return of<Character[]>([]);
        const ids = location.residents.map(extractIdFromUrl).filter((i) => i > 0);
        return this.characterService.getMany(ids);
      }),
    ),
    { initialValue: [] as Character[] },
  );

  retry(): void {
    window.location.reload();
  }
}
