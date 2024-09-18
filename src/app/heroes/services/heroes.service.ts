import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environment } from 'src/environments/environments';

import Fuse from 'fuse.js';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http
      .get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  // ? CON JSON SERVER YA NO FUNCIONA EL LIKE NI EL QUERY (Q)
  // getSuggestions(query: string): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(`${this.baseUrl}/heroes?superhero_like=${query}&_limit=6`);
  // }

  // ? CON FUSE.JS
  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`).pipe(
      map((heroes) => {
        const fuse = new Fuse(heroes, {
          keys: ['superhero'],
          includeScore: true,
          threshold: 0.3,
        });
        const results = fuse.search(query);
        return results.map((result) => result.item).slice(0, 6);
      })
    );
  }
}
