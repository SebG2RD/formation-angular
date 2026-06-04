import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CHARACTERS_QUERY } from '../graphql/characters.query';
import { ApiResponse } from '../models/api-response.model';
import { Character } from '../models/character.model';
import { Info } from '../models/info.model';
import { environment } from '../../environments/environment';

interface GqlEpisode {
  id: string;
  name: string;
}

interface GqlCharacterResult {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { id: string; name: string };
  episode: GqlEpisode[];
}

interface CharactersQueryData {
  characters: {
    info: Info;
    results: GqlCharacterResult[];
  };
}

/** Liste des personnages via GraphQL (bonus TP). */
@Injectable({ providedIn: 'root' })
export class CharacterGraphqlService {
  private readonly apollo = inject(Apollo);
  private readonly apiUrl = environment.apiUrl;

  search(
    page: number,
    name?: string,
    status?: string,
  ): Observable<ApiResponse<Character>> {
    return this.apollo
      .query<CharactersQueryData>({
        query: CHARACTERS_QUERY,
        variables: {
          page,
          name: name?.trim() || undefined,
          status: status || undefined,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          if (result.error) {
            throw result.error;
          }
          const block = result.data?.characters;
          if (!block) {
            throw new Error('Réponse GraphQL invalide.');
          }
          const info: Info = {
            count: block.info.count,
            pages: block.info.pages,
            next: block.info.next,
            prev: block.info.prev,
          };
          return {
            info,
            results: block.results.map((c) => this.toCharacter(c)),
          };
        }),
      );
  }

  private toCharacter(raw: GqlCharacterResult): Character {
    const id = Number(raw.id);
    return {
      id,
      name: raw.name,
      status: raw.status,
      species: raw.species,
      type: raw.type ?? '',
      gender: raw.gender,
      image: raw.image,
      origin: { name: raw.origin.name, url: '' },
      location: {
        name: raw.location.name,
        url: `${this.apiUrl}/location/${raw.location.id}`,
      },
      episode: raw.episode.map((e) => `${this.apiUrl}/episode/${e.id}`),
      url: `${this.apiUrl}/character/${id}`,
    };
  }
}
