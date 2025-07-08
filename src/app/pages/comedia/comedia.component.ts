// src/app/pages/comedia/comedia.component.ts

import { Component, OnInit }           from '@angular/core';
import { CommonModule }                from '@angular/common';
import { HttpClientModule, HttpClient }from '@angular/common/http';
import { CartService }                 from '../../services/cart.services';
import { AuthService, Sesion }         from '../../services/auth.services';
import { environment }                 from '../../../environments/environment';

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
 * Componente que muestra un catálogo de películas del género Comedia,
 * obtenidas desde una API JSON alojada en GitHub Pages.
 */
@Component({
  selector: 'app-comedia',
  standalone: true,
  imports: [ CommonModule, HttpClientModule ],
  templateUrl: './comedia.component.html',
})
export class ComediaComponent implements OnInit {
  /** Lista de comedias disparada tras filtrar la API */
  comediaMovies: Pelicula[] = [];

  /** Sólo clientes pueden añadir al carrito */
  isClient = false;

  /** Control de caché de errores / carga */
  loading = true;
  errorMsg: string | null = null;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  /**
   * Se ejecuta al inicializar el componente:
   * 1) Carga las películas desde la API.
   * 2) Vigila el rol de usuario para habilitar el botón.
   */
  ngOnInit(): void {
    this.loadMovies();
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });
  }

  /**
   * Llama a la API y filtra sólo las de género "comedia".
   */
  private loadMovies(): void {
    this.http
      .get<Pelicula[]>(environment.apiBase)
      .subscribe({
        next: (all) => {
          this.comediaMovies = all.filter(m => m.genero === 'comedia');
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar comedias', err);
          this.errorMsg = 'No se pudieron cargar las películas.';
          this.loading = false;
        }
      });
  }

  /**
   * Calcula el precio final aplicando el descuento redondeado.
   */
  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  /**
   * Añade la película al carrito usando el servicio.
   */
  agregarAlCarrito(p: Pelicula): void {
    const precio = this.precioFinal(p);
    this.cartService.agregarAlCarrito(p.titulo, precio);
  }
}
