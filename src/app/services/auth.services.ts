import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Interfaz que representa la sesión activa de un usuario.
 */
export interface Sesion {
  email: string;
  nombre: string;
  rol: 'admin' | 'cliente';
  fechaLogin: string;
}

/**
 * Servicio encargado de manejar la autenticación de usuarios.
 * Permite iniciar y cerrar sesión, y propagar el estado de autenticación
 * a través de toda la aplicación usando programación reactiva.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Clave usada para almacenar sesión en sessionStorage */
  private readonly key = 'sesionCineMax';

  /** Sujeto reactivo que emite el estado actual de la sesión */
  private sesionSubject = new BehaviorSubject<Sesion | null>(this.leerSesion());

  /** Observable para que otros componentes se suscriban al estado de sesión */
  sesion$ = this.sesionSubject.asObservable();

  /**
   * Lee la sesión actual desde sessionStorage.
   * @returns Un objeto `Sesion` o `null` si no hay sesión activa.
   */
  leerSesion(): Sesion | null {
    const raw = sessionStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : null;
  }

  /**
   * Inicia sesión guardando los datos del usuario en sessionStorage
   * y notificando a los observadores.
   * @param sesion Información del usuario autenticado.
   */
  login(sesion: Sesion) {
    sessionStorage.setItem(this.key, JSON.stringify(sesion));
    this.sesionSubject.next(sesion);
  }

  /**
   * Cierra sesión eliminando los datos del almacenamiento
   * y emitiendo `null` como nuevo estado de sesión.
   */
  logout() {
    sessionStorage.removeItem(this.key);
    this.sesionSubject.next(null);
    localStorage.removeItem('recordarUsuario');
  }
}
