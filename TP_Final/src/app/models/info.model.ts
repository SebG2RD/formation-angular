/** Métadonnées de pagination renvoyées par l'API. */
export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}
