import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card, CardResponse, CardFilters } from '../models';

@Injectable({ providedIn: 'root' })
export class CardApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  // Liste paginée + filtres. HttpParams construit proprement la query string.
  getCards(filters: CardFilters = {}, num = 20, offset = 0): Observable<CardResponse> {
    let params = new HttpParams().set('num', num).set('offset', offset);

    // On n'ajoute un paramètre QUE s'il est renseigné
    if (filters.fname) params = params.set('fname', filters.fname);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.attribute) params = params.set('attribute', filters.attribute);
    if (filters.archetype) params = params.set('archetype', filters.archetype);

    return this.http.get<CardResponse>(`${this.base}/cardinfo.php`, { params });
  }

  // Une carte par id (l'API renvoie toujours un tableau -> on prend [0])
  getCardById(id: number): Observable<Card> {
    const params = new HttpParams().set('id', id);
    return this.http
      .get<CardResponse>(`${this.base}/cardinfo.php`, { params })
      .pipe(map((res) => res.data[0]));
  }

  // Carte aléatoire (renvoie directement UN objet, pas une enveloppe)
  getRandomCard(): Observable<Card> {
    return this.http.get<Card>(`${this.base}/randomcard.php`);
  }
}
