import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente para gestionar el perfil del usuario.
 * Permite modificar nombre y contraseña, así como cerrar sesión.
 */
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class PerfilComponent {
  /** Datos de la sesión actual del usuario */
  sesion: any = null;

  /** Estado y valores para edición de nombre */
  editandoNombre = false;
  nuevoNombre = '';

  /** Estado y valores para edición de contraseña */
  editandoPass = false;
  nuevaPass = '';
  nuevaPass2 = '';
  passMsg = '';

  /** Control de mensajes flotantes */
  showMsg = false;
  msgText = '';
  msgType: 'success' | 'danger' = 'success';

  constructor(private router: Router) {}

  /**
   * Carga la sesión del usuario desde sessionStorage.
   */
  ngOnInit(): void {
    const sesionRaw = sessionStorage.getItem('sesionCineMax');
    this.sesion = sesionRaw ? JSON.parse(sesionRaw) : null;
    this.nuevoNombre = this.sesion?.nombre || '';
  }

  /**
   * Cierra sesión del usuario y redirige al login.
   */
  logout() {
    sessionStorage.removeItem('sesionCineMax');
    localStorage.removeItem('recordarUsuario');
    this.router.navigate(['/login']);
  }

  /**
   * Muestra un mensaje temporal en pantalla.
   */
  private displayMessage(text: string, type: 'success' | 'danger') {
    this.msgText = text;
    this.msgType = type;
    this.showMsg = true;
    setTimeout(() => (this.showMsg = false), 4000);
  }

  /**
   * Activa el modo edición para el nombre del usuario.
   */
  editarNombre() {
    this.nuevoNombre = this.sesion.nombre;
    this.editandoNombre = true;
  }

  /**
   * Guarda el nuevo nombre del usuario y lo actualiza en el almacenamiento.
   */
  guardarNombre() {
    if (!this.nuevoNombre.trim()) {
      this.displayMessage('El nombre no puede quedar vacío.', 'danger');
      return;
    }
    try {
      this.sesion.nombre = this.nuevoNombre.trim();
      sessionStorage.setItem('sesionCineMax', JSON.stringify(this.sesion));

      const users = JSON.parse(localStorage.getItem('usersCineMax') || '{}');
      if (users[this.sesion.email]) {
        users[this.sesion.email].nombre = this.sesion.nombre;
        localStorage.setItem('usersCineMax', JSON.stringify(users));
      }

      this.editandoNombre = false;
      this.displayMessage('Cambios guardados exitosamente.', 'success');
    } catch (e) {
      this.displayMessage('Error al guardar los cambios.', 'danger');
    }
  }

  /**
   * Valida y guarda la nueva contraseña del usuario.
   */
  guardarPassword() {
    this.passMsg = '';
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    if (!regex.test(this.nuevaPass)) {
      this.passMsg = 'La contraseña debe tener 6-18 caracteres, al menos una mayúscula y un número.';
      return;
    }
    if (this.nuevaPass !== this.nuevaPass2) {
      this.passMsg = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      this.sesion.clave = this.nuevaPass;
      sessionStorage.setItem('sesionCineMax', JSON.stringify(this.sesion));

      const users = JSON.parse(localStorage.getItem('usersCineMax') || '{}');
      if (users[this.sesion.email]) {
        users[this.sesion.email].clave = this.nuevaPass;
        localStorage.setItem('usersCineMax', JSON.stringify(users));
      }

      this.nuevaPass = this.nuevaPass2 = '';
      this.editandoPass = false;
      this.passMsg = '';
      this.displayMessage('Contraseña actualizada.', 'success');
    } catch (e) {
      this.displayMessage('Error al guardar los cambios.', 'danger');
    }
  }
}
