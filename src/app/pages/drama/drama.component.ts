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
  selector: 'app-drama',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drama.component.html',
})
export class DramaComponent implements OnInit {
  // Catálogo fijo de películas de drama
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

  // Controla si el usuario logueado es cliente
  isClient = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.isClient = sesion?.rol === 'cliente';
    });
  }

  // Calcula el precio con descuento redondeado
  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  // Agrega la peli al carrito pasando título y precio numérico
  agregarAlCarrito(p: Pelicula): void {
    const precio = this.precioFinal(p);
    this.cartService.agregarAlCarrito(p.titulo, precio);
  }
}
