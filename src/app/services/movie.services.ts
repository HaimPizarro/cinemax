import { Injectable }     from '@angular/core';
import { HttpClient }     from '@angular/common/http';
import { Observable }     from 'rxjs';
import { map }            from 'rxjs/operators';
import { environment }    from '../../environments/environment';

export interface Pelicula {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly url = `${environment.apiBase}/api.json`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.url);
  }

  getByGenero(genero: string): Observable<Pelicula[]> {
    return this.getAll().pipe(
      map(list => list.filter(p => p.genero === genero))
    );
  }
}
