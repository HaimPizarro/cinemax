import { Injectable } from '@angular/core';

/**
 * Interfaz que representa a un usuario del sistema CineMax.
 */
export interface Usuario {
  email: string;
  nombre: string;
  clave: string;
  rol: 'admin' | 'cliente';
}

/**
 * Servicio encargado de gestionar el almacenamiento y recuperación de usuarios
 * usando `localStorage`. También inicializa con usuarios por defecto.
 */
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  /** Clave con la que se almacenan los usuarios en localStorage */
  private key = 'usersCineMax';

  /**
   * Se asegura de que existan usuarios por defecto al iniciar el sistema.
   * Sólo se ejecuta si `localStorage` aún no tiene datos.
   */
  private ensureDefaultUsers() {
    if (localStorage.getItem(this.key)) {
      return;
    }

    // Usuarios por defecto: cliente y administrador
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

    // Guardar los usuarios iniciales en localStorage
    localStorage.setItem(this.key, JSON.stringify(initial));
  }

  /**
   * Obtiene todos los usuarios desde `localStorage`.
   * Si es la primera vez, se inicializa con usuarios por defecto.
   * @returns Un mapa de usuarios donde la clave es el email.
   */
  getAll(): { [key: string]: Usuario } {
    this.ensureDefaultUsers();
    return JSON.parse(localStorage.getItem(this.key) || '{}');
  }

  /**
   * Obtiene un usuario específico por su email.
   * @param email Email del usuario a buscar.
   * @returns El objeto `Usuario` correspondiente o `undefined`.
   */
  get(email: string): Usuario | undefined {
    return this.getAll()[email.trim().toLowerCase()];
  }

  /**
   * Guarda el conjunto completo de usuarios en `localStorage`.
   * @param users Mapa completo de usuarios.
   */
  saveAll(users: { [key: string]: Usuario }): void {
    localStorage.setItem(this.key, JSON.stringify(users));
  }

  /**
   * Actualiza un usuario específico con nuevos datos.
   * @param email Email del usuario a actualizar.
   * @param changes Objeto con las propiedades modificadas.
   */
  update(email: string, changes: Partial<Usuario>): void {
    const users = this.getAll();
    const key = email.trim().toLowerCase();
    if (users[key]) {
      users[key] = { ...users[key], ...changes };
      this.saveAll(users);
    }
  }

  /**
   * Elimina un usuario por su email.
   * @param email Email del usuario que se desea eliminar.
   */
  delete(email: string): void {
    const users = this.getAll();
    const key = email.trim().toLowerCase();
    delete users[key];
    this.saveAll(users);
  }
}
