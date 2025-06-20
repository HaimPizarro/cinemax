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
  const defaults: { [k: string]: Usuario } = {
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

  // Carga lo existente (si hay) o crea objeto vacío
  const stored: { [k: string]: Usuario } =
    JSON.parse(localStorage.getItem(this.key) || '{}');

  // Añade los que falten
  let cambiado = false;
  Object.values(defaults).forEach(u => {
    const k = u.email.trim().toLowerCase();
    if (!stored[k]) {           // sólo si no existe
      stored[k] = u;
      cambiado = true;
    }
  });

  if (cambiado) {               // guarda sólo cuando realmente cambió algo
    localStorage.setItem(this.key, JSON.stringify(stored));
  }
}

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
