import { Component, OnInit } from '@angular/core';
import { UsuariosService, Usuario } from '../../services/usuarios.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';

/**
 * Componente AdminComponent
 * Permite a usuarios con rol "admin" gestionar usuarios registrados en la plataforma.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AdminComponent implements OnInit {
  /** Lista de usuarios cargados del servicio */
  usuarios: Usuario[] = [];

  /** Sesión actual del usuario logueado */
  sesion: any = null;

  /** Modal de edición */
  editModalOpen = false;
  userEdit: Usuario | null = null;
  editClave = '';
  editClave2 = '';
  editMsg = '';

  /** Modal de eliminación */
  deleteModalOpen = false;
  userToDelete: Usuario | null = null;

  /** Snackbar de mensaje */
  showMsg = false;
  msgText = '';
  msgType: 'success' | 'danger' = 'success';

  /** Control de acceso */
  notAuthorized = false;

  constructor(
    private usuariosService: UsuariosService,
    private auth: AuthService
  ) {}

  /** Método de inicialización. Verifica sesión y carga usuarios si está autorizado. */
  ngOnInit() {
    this.checkSesion();
    this.cargarUsuarios();
  }

  /** Muestra un mensaje flotante en pantalla */
  private displayMessage(text: string, type: 'success' | 'danger') {
    this.msgText = text;
    this.msgType = type;
    this.showMsg = true;
    setTimeout(() => (this.showMsg = false), 3000);
  }

  /** Verifica si el usuario tiene permiso para acceder al panel de administración */
  checkSesion() {
    const raw = sessionStorage.getItem('sesionCineMax');
    this.sesion = raw ? JSON.parse(raw) : null;
    this.notAuthorized = !(this.sesion && this.sesion.rol === 'admin');
  }

  /** Carga los usuarios desde el servicio */
  cargarUsuarios() {
    this.usuarios = Object.values(this.usuariosService.getAll());
  }

  /** Abre el modal para editar el usuario seleccionado */
  openEdit(user: Usuario) {
    this.userEdit = { ...user };
    this.editClave = '';
    this.editClave2 = '';
    this.editMsg = '';
    this.editModalOpen = true;
  }

  /**
   * Guarda los cambios del usuario editado.
   * Valida contraseñas si se cambiaron.
   */
  guardarEdicion() {
    if (!this.userEdit) return;
    try {
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

  /** Cierra el modal de edición */
  cerrarModal() {
    this.editModalOpen = false;
  }

  /** Abre el modal para confirmar eliminación del usuario */
  openDelete(user: Usuario) {
    this.userToDelete = user;
    this.deleteModalOpen = true;
  }

  /** Cancela la eliminación del usuario */
  cancelDelete() {
    this.deleteModalOpen = false;
    this.userToDelete = null;
  }

  /** Elimina al usuario después de confirmación */
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

  /** Cierra sesión del usuario administrador */
  logout() {
    if (confirm('¿Cerrar sesión?')) {
      sessionStorage.removeItem('sesionCineMax');
      localStorage.removeItem('recordarUsuario');
      this.auth.logout();
      window.location.href = '/login';
    }
  }
}
