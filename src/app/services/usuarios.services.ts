import { Injectable } from '@angular/core';

export interface Usuario {
  email: string;
  nombre: string;
  clave: string;
  rol: 'admin' | 'cliente';
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private key = 'usersCineMax';

  /** Sólo se ejecuta la primera vez que no existe la key */
  private ensureDefaultUsers() {
    // si ya existe, no hacemos nada
    if (localStorage.getItem(this.key)) {
      return;
    }

    // usuarios por defecto
    const initial: { [k: string]: Usuario } = {
      'cliente@cinemax.com': {
        email: 'cliente@cinemax.com',
        nombre: 'Juan Pérez',
        clave: 'Cliente123',
        rol: 'cliente'
      },
      'admin@cinemax.com': {
        email: 'admin@cinemax.com',
        nombre: 'Haim Pizarro',
        clave: 'Admin123',
        rol: 'admin'
      }
    };

    // guardamos directamente el mapa inicial
    localStorage.setItem(this.key, JSON.stringify(initial));
  }

  /** Devuelve todos los usuarios, inicializando sólo si es la primera vez */
  getAll(): { [key: string]: Usuario } {
    this.ensureDefaultUsers();
    return JSON.parse(localStorage.getItem(this.key) || '{}');
  }

  get(email: string): Usuario | undefined {
    return this.getAll()[email.trim().toLowerCase()];
  }

  saveAll(users: { [key: string]: Usuario }) {
    localStorage.setItem(this.key, JSON.stringify(users));
  }

  update(email: string, changes: Partial<Usuario>) {
    const users = this.getAll();
    const key = email.trim().toLowerCase();
    if (users[key]) {
      users[key] = { ...users[key], ...changes };
      this.saveAll(users);
    }
  }

  delete(email: string) {
    const users = this.getAll();
    const key = email.trim().toLowerCase();
    delete users[key];
    this.saveAll(users);
  }
}
