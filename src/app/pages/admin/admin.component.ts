import { Component, OnInit } from '@angular/core';
import { UsuariosService, Usuario } from '../../services/usuarios.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
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

  // Eliminación modal
  deleteModalOpen = false;
  userToDelete: Usuario | null = null;

  // Snackbar
  showMsg = false;
  msgText = '';
  msgType: 'success' | 'danger' = 'success';

  notAuthorized = false;

  constructor(
    private usuariosService: UsuariosService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.checkSesion();
    this.cargarUsuarios();
  }

  private displayMessage(text: string, type: 'success' | 'danger') {
    this.msgText = text;
    this.msgType = type;
    this.showMsg = true;
    setTimeout(() => (this.showMsg = false), 3000);
  }

  checkSesion() {
    const raw = sessionStorage.getItem('sesionCineMax');
    this.sesion = raw ? JSON.parse(raw) : null;
    this.notAuthorized = !(this.sesion && this.sesion.rol === 'admin');
  }

  cargarUsuarios() {
    this.usuarios = Object.values(this.usuariosService.getAll());
  }

  // --- Edición ---
  openEdit(user: Usuario) {
    this.userEdit = { ...user };
    this.editClave = '';
    this.editClave2 = '';
    this.editMsg = '';
    this.editModalOpen = true;
  }

  guardarEdicion() {
    if (!this.userEdit) return;
    try {
      // Validar contraseña nueva si se ingresó
      if (this.editClave || this.editClave2) {
        const passRx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
        if (!passRx.test(this.editClave)) {
          throw new Error('Debe tener 6–18 caracteres, al menos una mayúscula y un número.');
        }
        if (this.editClave !== this.editClave2) {
          throw new Error('Las contraseñas no coinciden.');
        }
        if (this.editClave === this.userEdit.clave) {
          throw new Error('No repitas la contraseña anterior.');
        }
        this.userEdit.clave = this.editClave;
      }

      this.usuariosService.update(this.userEdit.email, {
        nombre: this.userEdit.nombre,
        clave: this.userEdit.clave,
        rol: this.userEdit.rol,
      });

      this.editModalOpen = false;
      this.cargarUsuarios();
      this.displayMessage('Cambio exitoso', 'success');
    } catch (e: any) {
      this.editMsg = e.message;
      this.displayMessage('Error al realizar cambio', 'danger');
    }
  }

  cerrarModal() {
    this.editModalOpen = false;
  }

  // --- Eliminación ---
  openDelete(user: Usuario) {
    this.userToDelete = user;
    this.deleteModalOpen = true;
  }

  cancelDelete() {
    this.deleteModalOpen = false;
    this.userToDelete = null;
  }


confirmDelete() {
  if (!this.userToDelete) return;

  try {
    this.usuariosService.delete(this.userToDelete.email);

    this.usuarios = this.usuarios.filter(u => u.email !== this.userToDelete?.email);

    this.cancelDelete();
    this.displayMessage('Usuario eliminado exitosamente', 'success');
  } catch (e) {
    this.cargarUsuarios();
    this.displayMessage('Error al eliminar usuario', 'danger');
  }
}


  // Llamamos openDelete en lugar de confirm()
  eliminarUsuario(user: Usuario) {
    if (user.email === this.sesion?.email) return;
    this.openDelete(user);
  }

  // --- Logout ---
  logout() {
    if (confirm('¿Cerrar sesión?')) {
      sessionStorage.removeItem('sesionCineMax');
      localStorage.removeItem('recordarUsuario');
      this.auth.logout();
      window.location.href = '/login';
    }
  }
}
