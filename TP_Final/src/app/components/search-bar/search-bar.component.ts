import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <label class="search-bar">
      <span class="search-bar__label">Rechercher par nom</span>
      <span class="search-bar__field">
        <svg class="search-bar__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input
          type="search"
          class="search-bar__input"
          placeholder="Ex. Rick, Morty…"
          [(ngModel)]="term"
          (ngModelChange)="onChange($event)"
        />
      </span>
    </label>
  `,
  styles: `
    .search-bar {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
      min-width: 220px;
    }
    .search-bar__label {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--text-muted);
    }
    .search-bar__field {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0 0.85rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      transition: border-color 0.16s ease, box-shadow 0.16s ease;
    }
    .search-bar__field:focus-within {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-dim);
    }
    .search-bar__icon {
      color: var(--text-muted);
      flex-shrink: 0;
    }
    .search-bar__field:focus-within .search-bar__icon {
      color: var(--accent);
    }
    .search-bar__input {
      flex: 1;
      padding: 0.62rem 0;
      border: none;
      background: transparent;
      color: var(--text);
      font: inherit;
    }
    .search-bar__input:focus {
      outline: none;
      box-shadow: none !important;
    }
    .search-bar__input::placeholder {
      color: var(--text-muted);
    }
  `,
})
export class SearchBarComponent {
  term = '';
  readonly searchChange = output<string>();

  onChange(value: string): void {
    this.searchChange.emit(value);
  }
}
