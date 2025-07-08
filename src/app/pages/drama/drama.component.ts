import { Component, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartService }               from '../../services/cart.services';
import { AuthService, Sesion }       from '../../services/auth.services';
import { environment }               from '../../../environments/environment';

/**
 * Modelo que define la estructura de una película.
 */
export interface Pelicula {
  id: number;
  genero: string;
  titulo: string;
  anio: number;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
}

/**
 * Componente que muestra un catálogo de películas del género Drama,
 * obtenidas desde una API JSON alojada en GitHub Pages.
 */
@Component({
  selector: 'app-drama',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './drama.component.html',
})
export class DramaComponent implements OnInit {
  /** Lista de películas de drama obtenidas de la API */
  dramaMovies: Pelicula[] = [];

  /** Solo los usuarios con rol 'cliente' pueden añadir al carrito */
  isClient = false;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  /**
   * Al iniciarse, carga las películas y comprueba el rol del usuario.
   */
  ngOnInit(): void {
    this.loadMovies();
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });
  }

  /**
   * Llama a la API para obtener todas las películas y filtra las de género 'drama'.
   */
  private loadMovies(): void {
    this.http
      .get<Pelicula[]>(environment.apiBase)
      .subscribe({
        next: (all) => {
          this.dramaMovies = all.filter(m => m.genero === 'drama');
        },
        error: (err) => {
          console.error('Error al cargar películas de drama', err);
        }
      });
  }

  /**
   * Calcula el precio final aplicando el descuento.
   * @param p Película
   * @returns Precio con descuento redondeado
   */
  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  /**
   * Añade la película al carrito usando el servicio correspondiente.
   * @param p Película a agregar
   */
  agregarAlCarrito(p: Pelicula): void {
    const precio = this.precioFinal(p);
    this.cartService.agregarAlCarrito(p.titulo, precio);
  }
}
