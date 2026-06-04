import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { FavorisService } from '../../services/favoris.service';
import { StatusPipe } from '../../pipes/status.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-character-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, StatusPipe, TruncatePipe],
  template: `
    <article class="card">
      <a [routerLink]="['/characters', character().id]" class="card__link">
        <div class="card__media">
          <img [src]="character().image" [alt]="character().name" class="card__image" loading="lazy" />
          <span class="card__id">#{{ character().id }}</span>
        </div>
        <div class="card__body">
          <h3>{{ character().name }}</h3>
          <span class="card__status" [attr.data-status]="character().status">
            {{ character().status | status }}
          </span>
          <p class="card__species">{{ character().species | truncate:40 }}</p>
        </div>
      </a>
      <button
        type="button"
        class="card__fav"
        [class.card__fav--active]="isFavori()"
        [attr.aria-label]="isFavori() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        [attr.aria-pressed]="isFavori()"
        (click)="toggleFavori.emit(character())"
      >
        {{ isFavori() ? '★' : '☆' }}
      </button>
    </article>
  `,
  styles: `
    .card {
      position: relative;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    .card__link {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    .card__media {
      position: relative;
      overflow: hidden;
      aspect-ratio: 1;
    }
    .card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .card:hover .card__image {
      transform: scale(1.05);
    }
    .card__media::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        115deg,
        transparent 32%,
        rgba(255, 255, 255, 0.18) 48%,
        transparent 64%
      );
      transform: translateX(-130%);
      transition: transform 0.65s ease;
      pointer-events: none;
    }
    .card:hover .card__media::after {
      transform: translateX(130%);
    }
    .card__id {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
      padding: 0.15rem 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text);
      background: rgba(8, 14, 11, 0.7);
      border: 1px solid var(--border-strong);
      border-radius: 999px;
      backdrop-filter: blur(4px);
    }
    .card__body {
      padding: 0.95rem 1rem 1.1rem;
    }
    .card__body h3 {
      margin: 0 0 0.5rem;
      font-size: 1.08rem;
      font-family: var(--font-display);
      letter-spacing: -0.01em;
    }
    .card__status {
      display: inline-flex;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .card__status[data-status='Alive'] { color: var(--success); }
    .card__status[data-status='Dead'] { color: var(--danger); }
    .card__species {
      margin: 0.4rem 0 0;
      font-size: 0.88rem;
      color: var(--text-muted);
    }
    .card__fav {
      position: absolute;
      top: 0.6rem;
      right: 0.6rem;
      width: 2.4rem;
      height: 2.4rem;
      display: grid;
      place-items: center;
      border: 1px solid var(--border-strong);
      border-radius: 50%;
      background: rgba(8, 14, 11, 0.65);
      backdrop-filter: blur(6px);
      color: #fff;
      font-size: 1.3rem;
      line-height: 1;
      cursor: pointer;
      transition: transform 0.16s ease, color 0.16s ease, border-color 0.16s ease;
    }
    .card__fav:hover {
      transform: scale(1.12);
      border-color: var(--star);
      color: var(--star);
    }
    .card__fav--active {
      color: var(--star);
      border-color: var(--star);
    }
  `,
})
export class CharacterCardComponent {
  readonly character = input.required<Character>();
  readonly toggleFavori = output<Character>();

  private readonly favorisService = inject(FavorisService);

  isFavori(): boolean {
    return this.favorisService.isFavori(this.character().id);
  }
}
