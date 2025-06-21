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
  selector: 'app-estrategia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estrategia.component.html',
})
export class EstrategiaComponent implements OnInit {
  // Catálogo fijo de películas de estrategia
  estrategiaMovies: Pelicula[] = [
    {
      id: 1,
      titulo: 'Top Gun: Maverick',
      anio: 2022,
      descripcion: 'Maverick entrena a una nueva generación de pilotos…',
      precio: 12990,
      descuento: 20,
      imagen:
        'https://light.pawa.cl/img/2022/06/12014901/1653297680_702523_1653300885_noticia_normal.jpg',
    },
    {
      id: 2,
      titulo: 'John Wick 4',
      anio: 2023,
      descripcion: 'John Wick se enfrenta a un nuevo enemigo para obtener su libertad.',
      precio: 15990,
      descuento: 0,
      imagen:
        'https://miro.medium.com/v2/resize:fit:1400/1*7P6HwA3O6AnzxfbdHvtZVA.jpeg',
    },
    {
      id: 3,
      titulo: 'Rápidos y Furiosos X',
      anio: 2023,
      descripcion: 'La familia Toretto enfrenta a su enemigo más letal.',
      precio: 14990,
      descuento: 10,
      imagen:
        'https://m.media-amazon.com/images/S/pv-target-images/8fd9d8b072906d80bbf485978430e97f7033a08d111a459727bb5c720ad37471.jpg',
    },
  ];

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
