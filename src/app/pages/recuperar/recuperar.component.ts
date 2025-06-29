import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente para recuperación de contraseña.
 * Permite verificar el email del usuario y restablecer la clave si el correo existe.
 */
@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.component.html'
})
export class RecuperarComponent {
  /** Paso actual del proceso (1: ingreso email, 2: nueva clave) */
  paso = 1;

  /** Formulario para capturar el correo del usuario */
  emailForm: FormGroup;

  /** Formulario para ingresar y confirmar nueva contraseña */
  resetForm: FormGroup;

  /** Mensaje de error si no se encuentra el email */
  emailError: string | null = null;

  /** Mensaje de error durante la validación de clave */
  resetError: string | null = null;

  /** Email objetivo para restablecer la contraseña */
  targetEmail: string | null = null;

  /** Variables para controlar visualización de toast */
  showToast = false;
  toastText = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(private fb: FormBuilder, private router: Router) {
    // Inicialización del formulario de email
    this.emailForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });

    // Inicialización del formulario de restablecimiento de clave
    this.resetForm = this.fb.group({
      clave: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/)
      ]],
      clave2: ['', Validators.required],
    });
  }

  /**
   * Obtiene todos los usuarios almacenados localmente.
   */
  private getAllUsers() {
    return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
  }

  /**
   * Guarda todos los usuarios en el almacenamiento local.
   */
  private saveAllUsers(u: any) {
    localStorage.setItem('usersCineMax', JSON.stringify(u));
  }

  /**
   * Verifica si el correo ingresado está registrado en el sistema.
   * Si es así, avanza al paso 2.
   */
  verificarEmail() {
    this.emailError = null;
    const correo = this.emailForm.value.correo.trim().toLowerCase();
    const users = this.getAllUsers();

    if (users[correo]) {
      this.targetEmail = correo;
      this.paso = 2;
    } else {
      this.emailError = 'No existe cuenta con ese correo.';
    }
  }

  /**
   * Valida y guarda la nueva contraseña para el usuario registrado.
   * Luego, redirige al login.
   */
  resetearClave() {
    this.resetError = null;
    const clave = this.resetForm.value.clave;
    const clave2 = this.resetForm.value.clave2;
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    if (!regex.test(clave)) {
      this.resetError = 'La contraseña debe tener 6-18 caracteres, 1 mayúscula y 1 número.';
      return;
    }

    if (clave !== clave2) {
      this.resetError = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.targetEmail) {
      const users = this.getAllUsers();
      users[this.targetEmail].clave = clave;
      this.saveAllUsers(users);

      // Muestra mensaje de éxito y redirige al login
      this.toastText = 'Contraseña actualizada correctamente.';
      this.toastType = 'success';
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
        this.router.navigate(['/login']);
      }, 2000);
    }
  }
}
