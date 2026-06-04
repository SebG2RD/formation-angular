import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { EpisodeService } from '../../services/episode.service';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    PaginatorComponent,
    LoaderComponent,
    ErrorMessageComponent,
    TruncatePipe,
  ],
  templateUrl: './episodes-list.component.html',
  styleUrl: './episodes-list.component.scss',
})
export class EpisodesListComponent {
  private readonly episodeService = inject(EpisodeService);

  readonly currentPage = signal(1);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly vm$ = toObservable(this.currentPage).pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap((page) =>
      this.episodeService.getAll(page).pipe(
        map((res) => ({ episodes: res.results, totalPages: res.info.pages })),
        catchError(() => {
          this.error.set('Erreur lors du chargement des épisodes.');
          return of({ episodes: [], totalPages: 1 });
        }),
      ),
    ),
    tap(() => this.loading.set(false)),
  );

  prevPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.currentPage.update((p) => p + 1);
  }

  retry(): void {
    this.currentPage.update((p) => p);
  }
}
