import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="page not-found">
      <h1>404</h1>
      <p class="not-found__lead">Cette dimension n'existe pas…</p>
      <p class="not-found__sub">Wubba lubba dub dub — vous vous êtes égaré entre deux réalités.</p>
      <a routerLink="/dashboard" class="btn">Retour au tableau de bord</a>
    </section>
  `,
  styles: `
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 5rem 1rem;
    }
    .not-found h1 {
      font-size: clamp(5rem, 18vw, 11rem);
      margin: 0;
      line-height: 0.9;
      background: linear-gradient(135deg, var(--accent-bright), var(--secondary));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      filter: drop-shadow(0 6px 30px rgba(116, 210, 70, 0.25));
    }
    .not-found__lead {
      margin: 0.5rem 0 0.25rem;
      font-family: var(--font-display);
      font-size: 1.35rem;
      color: var(--text);
    }
    .not-found__sub {
      margin: 0 0 2rem;
      color: var(--text-muted);
      max-width: 32ch;
    }
  `,
})
export class NotFoundComponent {}
