import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Episode } from '../models/episode.model';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/episode`;

  getAll(page: number): Observable<ApiResponse<Episode>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Episode>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.baseUrl}/${id}`);
  }

  getMany(ids: number[]): Observable<Episode[]> {
    if (ids.length === 0) {
      return of([]);
    }
    // L'API renvoie un objet (et non un tableau) quand un seul id est demandé.
    return this.http
      .get<Episode | Episode[]>(`${this.baseUrl}/${ids.join(',')}`)
      .pipe(map((res) => (Array.isArray(res) ? res : [res])));
  }
}
