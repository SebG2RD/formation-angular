import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris.service';
import { StatsService } from '../../services/stats.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { CountUpDirective } from '../../directives/count-up.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent, CountUpDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly statsService = inject(StatsService);
  private readonly favorisService = inject(FavorisService);

  readonly loading = this.statsService.loading;
  readonly error = this.statsService.error;
  readonly totalCharacters = this.statsService.totalCharacters;
  readonly totalLocations = this.statsService.totalLocations;
  readonly totalEpisodes = this.statsService.totalEpisodes;

  readonly nombreFavoris = this.favorisService.nombre;
  readonly repartitionFavoris = this.favorisService.repartitionParStatut;

  /** Statistiques dérivées affichées sur le tableau de bord. */
  readonly statsCards = computed(() => [
    { label: 'Personnages', value: this.totalCharacters(), link: '/characters' },
    { label: 'Lieux', value: this.totalLocations(), link: '/locations' },
    { label: 'Épisodes', value: this.totalEpisodes(), link: '/episodes' },
    { label: 'Favoris', value: this.nombreFavoris(), link: '/favoris' },
  ]);

  ngOnInit(): void {
    this.statsService.load();
  }

  reload(): void {
    this.statsService.load();
  }
}
