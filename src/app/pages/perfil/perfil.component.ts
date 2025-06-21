import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class PerfilComponent {
  sesion: any = null;

  editandoNombre = false;
  nuevoNombre = '';

  editandoPass = false;
  nuevaPass = '';
  nuevaPass2 = '';
  passMsg = '';

  // Para mostrar mensajes
  showMsg = false;
  msgText = '';
  msgType: 'success' | 'danger' = 'success';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const sesionRaw = sessionStorage.getItem('sesionCineMax');
    this.sesion = sesionRaw ? JSON.parse(sesionRaw) : null;
    this.nuevoNombre = this.sesion?.nombre || '';
  }

  logout() {
    sessionStorage.removeItem('sesionCineMax');
    localStorage.removeItem('recordarUsuario');
    this.router.navigate(['/login']);
  }

  private displayMessage(text: string, type: 'success' | 'danger') {
    this.msgText = text;
    this.msgType = type;
    this.showMsg = true;
    setTimeout(() => (this.showMsg = false), 4000);
  }

  editarNombre() {
    this.nuevoNombre = this.sesion.nombre;
    this.editandoNombre = true;
  }

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
