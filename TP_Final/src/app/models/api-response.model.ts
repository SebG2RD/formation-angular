import { Info } from './info.model';

/** Enveloppe standard de l'API : pagination + tableau de résultats. */
export interface ApiResponse<T> {
  info: Info;
  results: T[];
}
