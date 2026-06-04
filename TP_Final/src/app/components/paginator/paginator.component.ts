import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="paginator" aria-label="Pagination">
      <button
        type="button"
        class="btn btn--secondary"
        [disabled]="currentPage() <= 1"
        (click)="prev.emit()"
      >
        ← Précédent
      </button>
      <span>Page {{ currentPage() }} / {{ totalPages() }}</span>
      <button
        type="button"
        class="btn btn--secondary"
        [disabled]="currentPage() >= totalPages()"
        (click)="next.emit()"
      >
        Suivant →
      </button>
    </nav>
  `,
  styles: `
    .paginator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
    .paginator span {
      font-weight: 600;
      color: var(--text-muted);
    }
  `,
})
export class PaginatorComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly prev = output<void>();
  readonly next = output<void>();
}
