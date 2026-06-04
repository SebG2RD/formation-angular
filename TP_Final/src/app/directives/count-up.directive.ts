import { Directive, ElementRef, effect, inject, input } from '@angular/core';

/**
 * Anime un nombre de sa valeur courante jusqu'à la cible (easeOutCubic).
 * Respecte `prefers-reduced-motion` (affichage immédiat) et écrit le texte
 * directement dans l'élément — compatible zoneless.
 */
@Directive({
  selector: '[countUp]',
  standalone: true,
})
export class CountUpDirective {
  readonly countUp = input.required<number>();
  readonly countUpDuration = input(1100);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private current = 0;
  private rafId = 0;

  constructor() {
    effect(() => {
      const target = this.countUp();
      this.run(target);
    });
  }

  private run(target: number): void {
    cancelAnimationFrame(this.rafId);

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = this.current;
    if (reduce || from === target) {
      this.current = target;
      this.render(target);
      return;
    }

    const duration = this.countUpDuration();
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      this.render(Math.round(from + (target - from) * eased));
      if (p < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.current = target;
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private render(value: number): void {
    this.el.nativeElement.textContent = value.toLocaleString('fr-FR');
  }
}
