import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader" role="status" aria-label="Chargement en cours">
      <div class="loader__portal">
        <span class="loader__ring loader__ring--outer"></span>
        <span class="loader__ring loader__ring--inner"></span>
        <span class="loader__core"></span>
      </div>
      <p>Ouverture du portail…</p>
    </div>
  `,
  styles: `
    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
      padding: 3.5rem 2rem;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }
    .loader__portal {
      position: relative;
      width: 58px;
      height: 58px;
    }
    .loader__ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid transparent;
    }
    .loader__ring--outer {
      border-top-color: var(--accent);
      border-right-color: var(--accent);
      animation: spin 0.9s linear infinite;
    }
    .loader__ring--inner {
      inset: 11px;
      border-bottom-color: var(--secondary);
      border-left-color: var(--secondary);
      animation: spin 1.3s linear infinite reverse;
    }
    .loader__core {
      position: absolute;
      inset: 23px;
      border-radius: 50%;
      background: var(--accent-bright);
      box-shadow: 0 0 14px var(--accent);
      animation: pulse 1.4s ease-in-out infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: scale(0.85); }
      50% { opacity: 1; transform: scale(1.1); }
    }
  `,
})
export class LoaderComponent {}
