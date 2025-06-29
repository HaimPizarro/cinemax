import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.services';
import { AuthService, Sesion } from '../../services/auth.services';

/**
 * Interfaz que define la estructura de una película.
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
 * Componente que muestra un catálogo de películas del género drama.
 * Permite a los usuarios con rol 'cliente' agregar productos al carrito.
 */
@Component({
  selector: 'app-drama',
  standalone: true,
  templateUrl: './drama.component.html',
  imports: [CommonModule],
})
export class DramaComponent implements OnInit {

  /**
   * Lista fija de películas de drama.
   * Se puede reemplazar por datos dinámicos en el futuro.
   */
  dramaMovies: Pelicula[] = [
    {
      id: 1,
      titulo: 'Oppenheimer',
      anio: 2023,
      descripcion:
        'La historia del físico que lideró el proyecto Manhattan durante la Segunda Guerra Mundial.',
      precio: 17990,
      descuento: 12,
      imagen:
        'https://m.media-amazon.com/images/M/MV5BNTFlZDI1YWQtMTVjNy00YWU1LTg2YjktMTlhYmRiYzQ3NTVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    },
    {
      id: 2,
      titulo: 'La Ballena',
      anio: 2022,
      descripcion:
        'Un profesor con obesidad severa intenta reconectar con su hija adolescente alienada en una última oportunidad de redención.',
      precio: 15990,
      descuento: 0,
      imagen:
        'https://play-lh.googleusercontent.com/5Mw1yirPdDxE6B5s5YLtQfj2dMDzVXXESTZ4JLrCp3Yw6hQQ6PIncFBoXny02XuVgaLXzmlenQ5euqdTOQQ',
    },
    {
      id: 3,
      titulo: 'Todo en Todas Partes al Mismo Tiempo',
      anio: 2022,
      descripcion:
        'Una mujer debe conectar con versiones de sí misma de universos paralelos para prevenir que una poderosa entidad destruya el multiverso.',
      precio: 16990,
      descuento: 18,
      imagen:
        'https://www.rockandpop.cl/wp-content/uploads/2022/05/posteroficialEverythingallatonce.jpg',
    },
  ];

  /**
   * Bandera que indica si el usuario tiene rol de cliente.
   * Solo los clientes pueden usar el carrito de compras.
   */
  isClient = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService
  ) {}

  /**
   * Verifica si el usuario logueado es cliente.
   * Se suscribe a la sesión actual del servicio de autenticación.
   */
  ngOnInit(): void {
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });
  }

  /**
   * Calcula el precio final aplicando el descuento si corresponde.
   * @param p Película
   * @returns Precio final redondeado
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
