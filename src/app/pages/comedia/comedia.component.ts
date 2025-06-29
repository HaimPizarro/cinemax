import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.services';
import { AuthService, Sesion } from '../../services/auth.services';

/**
 * Interfaz que representa los datos de una película.
 */
interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
}

/**
 * Componente que muestra un catálogo de películas de comedia.
 * Permite agregar películas al carrito de compras si el usuario es cliente.
 */
@Component({
  selector: 'app-comedia',
  standalone: true,
  templateUrl: './comedia.component.html',
  imports: [CommonModule],
})
export class ComediaComponent implements OnInit {

  /**
   * Lista fija de películas de comedia.
   * Si luego se conecta a una API, este arreglo se puede reemplazar.
   */
  comediaMovies: Pelicula[] = [
    {
      id: 1,
      titulo: 'Barbie',
      anio: 2023,
      descripcion: 'Barbie vive en Barbieland, donde todo es perfecto y rosa…',
      precio: 16990,
      descuento: 15,
      imagen: 'https://es.web.img2.acsta.net/pictures/23/07/20/11/29/5479684.jpg',
    },
    {
      id: 2,
      titulo: 'Super Mario Bros',
      anio: 2023,
      descripcion: 'Mario y Luigi son transportados al Reino Champiñón…',
      precio: 13990,
      descuento: 0,
      imagen: 'https://almomento.mx/wp-content/uploads/2023/04/Mario-Bros.-taquilla-Mexico.jpeg',
    },
    {
      id: 3,
      titulo: 'Mi Villano Favorito 4',
      anio: 2024,
      descripcion: 'Gru enfrenta a un nuevo enemigo mientras su familia crece…',
      precio: 14990,
      descuento: 25,
      imagen: 'https://media.canal9.cl/2024/06/mi-villano-favorito-4-1906.jpg',
    },
  ];

  /**
   * Indica si el usuario tiene rol de cliente.
   * Solo los clientes pueden agregar al carrito.
   */
  isClient = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService
  ) {}

  /**
   * Verifica si la sesión actual es de un cliente.
   */
  ngOnInit(): void {
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });
  }

  /**
   * Calcula el precio final de una película aplicando descuento si existe.
   * @param p Película
   * @returns Precio con descuento aplicado
   */
  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  /**
   * Agrega una película al carrito con su título y precio final.
   * @param p Película a agregar
   */
  agregarAlCarrito(p: Pelicula): void {
    const precio = this.precioFinal(p);
    this.cartService.agregarAlCarrito(p.titulo, precio);
  }
}
