import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Contact, NouveauContact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/contacts';

  // READ
  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url).pipe(
      catchError(() =>
        throwError(() => new Error('Impossible de charger (json-server est-il lance sur :3000 ?)')),
      ),
    );
  }

  // CREATE
  create(contact: NouveauContact): Observable<Contact> {
    return this.http.post<Contact>(this.url, contact).pipe(
      catchError(() => throwError(() => new Error("Echec de l'ajout"))),
    );
  }

  // UPDATE (PATCH = modification partielle : on n'envoie que les champs modifiables, pas l'id)
  update(contact: Contact): Observable<Contact> {
    const { id, ...modifs } = contact;
    return this.http.patch<Contact>(`${this.url}/${id}`, modifs).pipe(
      catchError(() => throwError(() => new Error('Echec de la modification'))),
    );
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Echec de la suppression'))),
    );
  }
}
