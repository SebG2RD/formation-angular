import { Injectable, signal, computed, effect } from '@angular/core';
import { Card, DeckEntry } from '../models';
import { environment } from '../../environments/environment';

const STORAGE_KEY = environment.STORAGE_KEY;

@Injectable({ providedIn: 'root' })
export class CollectionService {
  // On initialise depuis le localStorage (deck sauvegardé)
  private _deck = signal<DeckEntry[]>(this.charger());

  deck = this._deck.asReadonly();
  // Nombre total de cartes (somme des quantités) — recalculé automatiquement
  total = computed(() => this._deck().reduce((acc, e) => acc + e.quantite, 0));

  constructor() {
    // effect : à CHAQUE changement du deck, on sauvegarde. Magique.
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._deck())));
  }

  estDansDeck(id: number): boolean {
    return this._deck().some((e) => e.card.id === id);
  }

  ajouter(card: Card) {
    this._deck.update((deck) => {
      const existant = deck.find((e) => e.card.id === card.id);
      if (existant) {
        // Règle Yu-Gi-Oh : max 3 exemplaires
        if (existant.quantite >= 3) return deck;
        return deck.map((e) => (e.card.id === card.id ? { ...e, quantite: e.quantite + 1 } : e));
      }
      return [...deck, { card, quantite: 1 }];
    });
  }

  retirer(id: number) {
    this._deck.update((deck) => deck.filter((e) => e.card.id !== id));
  }

  vider() {
    this._deck.set([]);
  }

  private charger(): DeckEntry[] {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  }
}
