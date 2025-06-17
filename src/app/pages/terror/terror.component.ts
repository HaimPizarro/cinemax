import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';

interface Pelicula {
  id: number;
  titulo: string;
  anio: number;         // año → anio
  descripcion: string;  // descripción → descripcion
  precio: number;
  descuento: number;
  imagen: string;
}

@Component({
  selector: 'app-terror',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terror.component.html',
})
export class TerrorComponent implements OnInit {

  terrorMovies: Pelicula[] = [
    {
      id: 1,
      titulo: "Scream VI",
      anio: 2023,
      descripcion: "Los supervivientes de Ghostface inician un nuevo capítulo en Nueva York.",
      precio: 14990,
      descuento: 22,
      imagen: "https://es.web.img3.acsta.net/pictures/23/01/25/11/55/4525883.jpg",
    },
    {
      id: 2,
      titulo: "MEGAN",
      anio: 2023,
      descripcion: "La muñeca IA protectora que se vuelve siniestra…",
      precio: 13990,
      descuento: 0,
      imagen: "https://pics.filmaffinity.com/M3GAN-570441440-large.jpg",
    },
    {
      id: 3,
      titulo: "El Legado del Diablo",
      anio: 2018,
      descripcion: "Una familia descubre oscuros secretos tras la muerte de la abuela.",
      precio: 13490,
      descuento: 10,
      imagen: "https://m.media-amazon.com/images/M/MV5BOTlkOGY0OWUtYTg1My00ZGU2LTliZTItODI5NjJkNDAwYzQwXkEyXkFqcGc@._V1_.jpg",
    },
  ];

  isClient = false;

  ngOnInit(): void {
    const sesion: any = (window as any).obtenerSesion?.() ?? null;
    this.isClient = sesion?.rol === 'cliente';
  }

  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }

  agregarAlCarrito(p: Pelicula): void {
    (window as any).agregarAlCarrito?.(
      p.titulo,
      `$${this.precioFinal(p).toLocaleString()}`
    );
  }
}
