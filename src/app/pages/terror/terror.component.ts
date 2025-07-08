// src/app/pages/terror/terror.component.ts

import { Component, OnInit }            from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartService }                  from '../../services/cart.services';
import { AuthService, Sesion }          from '../../services/auth.services';
import { environment }                  from '../../../environments/environment';

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
 * Componente que muestra un catálogo de películas del género Terror,
 * obtenidas desde una API JSON alojada en GitHub Pages.
 */
@Component({
  selector: 'app-terror',
  standalone: true,
  imports: [ CommonModule, HttpClientModule ],
  templateUrl: './terror.component.html',
})
export class TerrorComponent implements OnInit {
  /** Películas de terror filtradas */
  terrorMovies: Pelicula[] = [];

  /** Sólo clientes pueden ver precios y comprar */
  isClient = false;

  /** Estados de UI */
  loading = true;
  errorMsg: string | null = null;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  /**
   * Al iniciar, carga los datos y chequea el rol.
   */
  ngOnInit(): void {
    this.loadMovies();
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });
  }

  /**
   * Llama a la API, filtra por genero 'terror' y maneja loading/error.
   */
  private loadMovies(): void {
    this.http.get<Pelicula[]>(environment.apiBase).subscribe({
      next: all => {
        this.terrorMovies = all.filter(m => m.genero === 'terror');
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando películas de terror', err);
        this.errorMsg = 'No se pudieron cargar las películas.';
        this.loading = false;
      }
    });
  }

  /**
   * Calcula precio final con descuento aplicado.
   */
  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  /**
   * Agrega la película al carrito.
   */
  agregarAlCarrito(p: Pelicula): void {
    const precio = this.precioFinal(p);
    this.cartService.agregarAlCarrito(p.titulo, precio);
  }
}
