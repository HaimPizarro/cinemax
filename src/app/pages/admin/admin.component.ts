import { Component, OnInit } from '@angular/core';
import { UsuariosService, Usuario } from '../../services/usuarios.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  imports: [CommonModule, FormsModule],
})
export class AdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  sesion: any = null;

  // Edición modal
  editModalOpen = false;
  userEdit: Usuario | null = null;
  editClave = '';
  editClave2 = '';
  editMsg = '';

  notAuthorized = false;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.checkSesion();
    this.cargarUsuarios();
  }

  checkSesion() {
    const sesionRaw = sessionStorage.getItem('sesionCineMax');
    this.sesion = sesionRaw ? JSON.parse(sesionRaw) : null;
    this.notAuthorized = !(this.sesion && this.sesion.rol === 'admin');
  }

  cargarUsuarios() {
    const usersObj = this.usuariosService.getAll();
    this.usuarios = Object.values(usersObj);
  }

  openEdit(user: Usuario) {
    this.userEdit = { ...user }; // copia
    this.editClave = '';
    this.editClave2 = '';
    this.editMsg = '';
    this.editModalOpen = true;
  }

  guardarEdicion() {
    if (!this.userEdit) return;

    // Validar contraseña nueva (opcional)
    if (this.editClave || this.editClave2) {
      const passRx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
      if (!passRx.test(this.editClave)) {
        this.editMsg = 'Debe tener 6–18 caracteres, al menos una mayúscula y un número.';
        return;
      }
      if (this.editClave !== this.editClave2) {
        this.editMsg = 'Las contraseñas no coinciden.';
        return;
      }
      if (this.editClave === this.userEdit.clave) {
        this.editMsg = 'No repitas la contraseña anterior.';
        return;
      }
      this.userEdit.clave = this.editClave;
    }
    this.usuariosService.update(this.userEdit.email, {
      nombre: this.userEdit.nombre,
      clave: this.userEdit.clave,
      rol: this.userEdit.rol
    });
    this.editModalOpen = false;
    this.cargarUsuarios();
  }

  eliminarUsuario(user: Usuario) {
    if (user.email === this.sesion?.email) return; // no puedes eliminarte a ti mismo
    if (confirm(`¿Eliminar a ${user.email}?`)) {
      this.usuariosService.delete(user.email);
      this.cargarUsuarios();
    }
  }

  cerrarModal() {
    this.editModalOpen = false;
  }

  logout() {
    if (confirm('¿Cerrar sesión?')) {
      sessionStorage.removeItem('sesionCineMax');
      localStorage.removeItem('recordarUsuario');
      window.location.href = '/login';
    }
  }
}
