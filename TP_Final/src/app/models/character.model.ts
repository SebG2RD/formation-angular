/** Personnage Rick & Morty. */
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  episode: string[];
  url: string;
}
