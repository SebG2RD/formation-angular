import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import {
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Character } from '../../models/character.model';
import { CharacterGraphqlService } from '../../services/character-graphql.service';
import { FavorisService } from '../../services/favoris.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CharacterCardComponent,
    SearchBarComponent,
    PaginatorComponent,
    LoaderComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './characters-list.component.html',
  styleUrl: './characters-list.component.scss',
})
export class CharactersListComponent {
  private readonly graphqlService = inject(CharacterGraphqlService);
  private readonly favorisService = inject(FavorisService);

  readonly currentPage = signal(1);
  readonly searchTerm = signal('');
  readonly statusFilter = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly reload$ = new Subject<void>();

  readonly vm$ = combineLatest([
    toObservable(this.currentPage),
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ),
    toObservable(this.statusFilter),
    this.reload$.pipe(startWith(undefined)),
  ]).pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap(([page, name, status]) =>
      this.graphqlService.search(page, name, status).pipe(
        map((response) => ({
          characters: response.results,
          totalPages: response.info.pages || 1,
        })),
        catchError(() => {
          this.error.set('Erreur lors du chargement des personnages.');
          return of({ characters: [] as Character[], totalPages: 1 });
        }),
        finalize(() => this.loading.set(false)),
      ),
    ),
  );

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.statusFilter.set(value);
    this.currentPage.set(1);
  }

  prevPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.currentPage.update((p) => p + 1);
  }

  toggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }

  retry(): void {
    this.reload$.next();
  }
}
