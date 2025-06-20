import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Sesion {
  email: string;
  nombre: string;
  rol: 'admin' | 'cliente';
  fechaLogin: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'sesionCineMax';

  private sesionSubject = new BehaviorSubject<Sesion | null>(this.leerSesion());
  sesion$ = this.sesionSubject.asObservable();

  /** Devuelve la sesión actual o null */
  leerSesion(): Sesion | null {
    const raw = sessionStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : null;
  }

  /** Guarda la sesión y notifica a todos los componentes */
  login(sesion: Sesion) {
    sessionStorage.setItem(this.key, JSON.stringify(sesion));
    this.sesionSubject.next(sesion);
  }

  /** Elimina la sesión y notifica */
  logout() {
    sessionStorage.removeItem(this.key);
    this.sesionSubject.next(null);
    localStorage.removeItem('recordarUsuario');
  }
}
