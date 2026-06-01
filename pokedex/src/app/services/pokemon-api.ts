import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import {
  PokemonListResponse,
  PokemonPreview,
  PokemonDetail,
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://pokeapi.co/api/v2';

  // GET : la liste des Pokémon, transformée en aperçus avec image
  getList(limit = 151, offset = 0): Observable<{ count: number; pokemons: PokemonPreview[] }> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        switchMap(res => {
          const previews = res.results.map(p => {
            const id = Number(p.url.split('/').filter(Boolean).pop());
            return {
              name: p.name,
              id,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            };
          });

          if (previews.length === 0) {
            return of({ count: res.count, pokemons: [] });
          }

          return forkJoin(
            previews.map(preview =>
              this.getByName(preview.name).pipe(
                map(detail => ({
                  ...preview,
                  type: detail.types[0]?.type.name ?? 'normal',
                }))
              )
            )
          ).pipe(map(pokemons => ({ count: res.count, pokemons })));
        })
      );
  }

  // GET : le détail d'un Pokémon par son nom
  getByName(name: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${name}`);
  }
}