import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.services';
import { AuthService, Sesion } from '../../services/auth.services';
import { environment } from '../../../environments/environment';

/**
 * Interfaz que representa los datos de una película.
 */
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

/**
 * Componente que muestra el catálogo de películas del género estrategia.
 * Solo los usuarios con rol 'cliente' pueden agregar productos al carrito.
 * Los datos se obtienen de la API remota.
 */
@Component({
  selector: 'app-estrategia',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './estrategia.component.html',
})
export class EstrategiaComponent implements OnInit {
  /** Lista de películas cargada desde la API */
  estrategiaMovies: Pelicula[] = [];

  /** Bandera que indica si el usuario logueado es cliente */
  isClient = false;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  /**
   * Al iniciar el componente:
   * 1) Nos suscribimos a la sesión para activar el carrito solo para clientes.
   * 2) Cargamos las películas llamando a la API.
   */
  ngOnInit(): void {
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });

    this.loadMovies();
  }

  /**
   * Realiza la petición GET a la API y asigna la respuesta
   * al arreglo local de películas.
   */
  private loadMovies(): void {
    this.http
      .get<Pelicula[]>(environment.apiBase)
      .subscribe({
        next: movies => {
          // Filtrar solo las de género "estrategia"
          this.estrategiaMovies = movies.filter(m => m.genero === 'estrategia');
        },
        error: err => {
          console.error('Error cargando películas de estrategia:', err);
          // Podrías mostrar un mensaje de error en UI si lo deseas
        }
      });
  }

  /**
   * Calcula el precio final aplicando el descuento correspondiente.
   * @param p Película seleccionada
   * @returns Precio con descuento redondeado
   */
  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  /**
   * Agrega la película seleccionada al carrito de compras.
   * @param p Película a agregar
   */
  agregarAlCarrito(p: Pelicula): void {
    const precio = this.precioFinal(p);
    this.cartService.agregarAlCarrito(p.titulo, precio);
  }
}
