import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/character`;

  getAll(
    page: number,
    name?: string,
    status?: string,
  ): Observable<ApiResponse<Character>> {
    let params = new HttpParams().set('page', page);
    if (name?.trim()) {
      params = params.set('name', name.trim());
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Character>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/${id}`);
  }

  getMany(ids: number[]): Observable<Character[]> {
    if (ids.length === 0) {
      return of([]);
    }
    // L'API renvoie un objet (et non un tableau) quand un seul id est demandé.
    return this.http
      .get<Character | Character[]>(`${this.baseUrl}/${ids.join(',')}`)
      .pipe(map((res) => (Array.isArray(res) ? res : [res])));
  }
}
