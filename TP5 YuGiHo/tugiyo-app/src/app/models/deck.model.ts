import { Card } from './card.model';

export interface DeckEntry {
  card: Card;
  quantite: number; // 1 à 3 (règle Yu-Gi-Oh)
}
