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

  private ensureDefaultUsers() {
    if (!localStorage.getItem(this.key)) {
      const initial: { [key: string]: Usuario } = {
        'cliente@cinemax.com': {
          email: 'cliente@cinemax.com', nombre: 'Juan Pérez', clave: 'Cliente123', rol: 'cliente'
        },
        'admin@cinemax.com': {
          email: 'admin@cinemax.com', nombre: 'Haim Pizarro', clave: 'Admin123', rol: 'admin'
        }
      };
      localStorage.setItem(this.key, JSON.stringify(initial));
    }
  }

  getAll(): { [key: string]: Usuario } {
    this.ensureDefaultUsers();
    return JSON.parse(localStorage.getItem(this.key) || '{}');
  }

  saveAll(users: { [key: string]: Usuario }) {
    localStorage.setItem(this.key, JSON.stringify(users));
  }

  get(email: string): Usuario | undefined {
    return this.getAll()[email];
  }

  update(email: string, changes: Partial<Usuario>) {
    const users = this.getAll();
    if (users[email]) {
      users[email] = { ...users[email], ...changes };
      this.saveAll(users);
    }
  }

  delete(email: string) {
    const users = this.getAll();
    delete users[email];
    this.saveAll(users);
  }
}
