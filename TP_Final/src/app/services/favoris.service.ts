import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Character } from '../models/character.model';
import { StorageService } from './storage.service';

const FAVORIS_KEY = 'rick-morty-favoris';

/** Gestion des personnages favoris avec persistance localStorage. */
@Injectable({ providedIn: 'root' })
export class FavorisService {
  private readonly storage = inject(StorageService);

  readonly favoris = signal<Character[]>(this.storage.get<Character[]>(FAVORIS_KEY) ?? []);

  readonly nombre = computed(() => this.favoris().length);

  /** Répartition des favoris par statut (pour le dashboard). */
  readonly repartitionParStatut = computed(() => {
    const counts = { Alive: 0, Dead: 0, unknown: 0 };
    for (const c of this.favoris()) {
      counts[c.status]++;
    }
    return counts;
  });

  constructor() {
    effect(() => {
      this.storage.set(FAVORIS_KEY, this.favoris());
    });
  }

  toggle(character: Character): void {
    if (this.isFavori(character.id)) {
      this.favoris.update((list) => list.filter((c) => c.id !== character.id));
    } else {
      this.favoris.update((list) => [...list, character]);
    }
  }

  isFavori(id: number): boolean {
    return this.favoris().some((c) => c.id === id);
  }
}
