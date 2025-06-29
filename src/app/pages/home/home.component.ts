import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, Sesion } from '../../services/auth.services';

/**
 * Interfaz para representar una categoría de películas.
 */
interface Categoria {
  slug: string;
  nombre: string;
  emoji: string;
  descripcion: string;
  disponibles: number;
  imagen: string;
}

/**
 * Componente principal de la página de inicio.
 * Muestra diferentes secciones según el tipo de usuario (cliente o admin),
 * incluyendo categorías de películas y tarjetas de estadísticas para administradores.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  /** Indica si se debe mostrar un mensaje de bienvenida temporal */
  mostrarBienvenida = false;

  /** Indica si el usuario actual es administrador */
  esAdmin = false;

  /** Indica si se deben mostrar las recomendaciones para usuarios logueados */
  mostrarRecomendaciones = false;

  /** Control interno para no repetir la bienvenida */
  private welcomeShown = false;

  /** Tarjetas informativas solo visibles por administradores */
  adminCards = [
    { valor: 24, texto: 'Usuarios Registrados', bg: 'primary' },
    { valor: 156, texto: 'Películas Disponibles', bg: 'success' },
    { valor: 8, texto: 'Sesiones Activas', bg: 'info' },
    { valor: 3, texto: 'Reportes Pendientes', bg: 'danger' }
  ];

  /** Lista de categorías de películas disponibles en la plataforma */
  categorias: Categoria[] = [
    {
      slug: 'comedia',
      nombre: 'Películas de Comedia',
      emoji: '😂',
      descripcion: 'Ríe sin parar con las comedias más divertidas.',
      disponibles: 24,
      imagen: 'https://es.web.img2.acsta.net/pictures/23/07/20/11/29/5479684.jpg'
    },
    {
      slug: 'drama',
      nombre: 'Películas de Drama',
      emoji: '🎭',
      descripcion: 'Historias profundas que tocan el corazón.',
      disponibles: 31,
      imagen: 'https://m.media-amazon.com/images/M/MV5BNTFlZDI1YWQtMTVjNy00YWU1LTg2YjktMTlhYmRiYzQ3NTVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
    },
    {
      slug: 'terror',
      nombre: 'Películas de Terror',
      emoji: '👻',
      descripcion: 'Experimenta el miedo con los títulos más escalofriantes.',
      disponibles: 18,
      imagen: 'https://es.web.img3.acsta.net/pictures/23/01/25/11/55/4525883.jpg'
    },
    {
      slug: 'estrategia',
      nombre: 'Películas de Estrategia',
      emoji: '🧠',
      descripcion: 'Planifica tu próxima jugada con nuestra selección estratégica.',
      disponibles: 27,
      imagen: 'https://light.pawa.cl/img/2022/06/12014901/1653297680_702523_1653300885_noticia_normal.jpg'
    }
  ];

  constructor(private auth: AuthService) {}

  /**
   * Al inicializar el componente:
   * - Se detecta si el usuario es admin.
   * - Se activa la sección de recomendaciones si hay sesión.
   * - Si la sesión es nueva, muestra un mensaje de bienvenida temporal.
   */
  ngOnInit() {
    this.auth.sesion$.subscribe((sesion: Sesion | null) => {
      this.esAdmin = sesion?.rol === 'admin';
      this.mostrarRecomendaciones = !!sesion;

      if (sesion && sessionStorage.getItem('showWelcome') === 'true') {
        this.mostrarBienvenida = true;
        sessionStorage.removeItem('showWelcome');

        setTimeout(() => {
          this.mostrarBienvenida = false;
        }, 4000);
      }
    });
  }
}
