import { CardImage } from './card-image.model';
import { CardSet } from './card-set.model';
import { CardPrice } from './card-price.model';

export interface BanlistInfo {
  ban_tcg?: string;
  ban_ocg?: string;
}

export interface Card {
  id: number;
  name: string;
  type: string; // ex: "Effect Monster", "Spell Card"
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string; // ex: "DARK", "LIGHT"
  archetype?: string;
  card_sets?: CardSet[];
  card_images: CardImage[];
  card_prices?: CardPrice[];
  banlist_info?: BanlistInfo;
}
