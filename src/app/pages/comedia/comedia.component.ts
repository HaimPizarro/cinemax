import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { CartService }       from '../../services/cart.services';
import { AuthService, Sesion } from '../../services/auth.services';

interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
}

@Component({
  selector: 'app-comedia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comedia.component.html',
})
export class ComediaComponent implements OnInit {
  /** Catálogo fijo; si después lo traes de API, reemplázalo */
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

  /** Controla si el usuario es cliente */
  isClient = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Nos suscribimos al estado de sesión
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });
  }

  /** Calcula precio con descuento aplicado */
  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  /** Agrega la película al carrito con título y precio numérico */
  agregarAlCarrito(p: Pelicula): void {
    const precio = this.precioFinal(p);
    this.cartService.agregarAlCarrito(p.titulo, precio);
  }
}
