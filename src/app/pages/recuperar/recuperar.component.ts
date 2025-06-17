import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.component.html',
})
export class RecuperarComponent {
  paso = 1;
  emailForm: FormGroup;
  resetForm: FormGroup;
  emailError: string | null = null;
  resetError: string | null = null;
  targetEmail: string | null = null;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
    this.resetForm = this.fb.group({
      clave: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/)
      ]],
      clave2: ['', Validators.required],
    });
  }

  // Helpers de "base de datos"
  getAllUsers() {
    return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
  }
  saveAllUsers(u: any) {
    localStorage.setItem('usersCineMax', JSON.stringify(u));
  }

  verificarEmail() {
    this.emailError = null;
    const correo = (this.emailForm.value.correo ?? '').trim().toLowerCase();
    const users = this.getAllUsers();

    if (users[correo]) {
      this.targetEmail = correo;
      this.paso = 2;
    } else {
      this.emailError = 'No existe cuenta con ese correo.';
    }
  }

  resetearClave() {
    this.resetError = null;
    const clave = this.resetForm.value.clave ?? '';
    const clave2 = this.resetForm.value.clave2 ?? '';
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    if (!regex.test(clave)) {
      this.resetError = 'La contraseña debe tener 6-18 caracteres, 1 mayúscula y 1 número.';
      this.resetForm.get('clave')?.setErrors({ pattern: true });
      return;
    }
    if (clave !== clave2) {
      this.resetError = 'Las contraseñas no coinciden.';
      this.resetForm.get('clave2')?.setErrors({ mismatch: true });
      return;
    }

    // actualizar usuario
    if (this.targetEmail) {
      const users = this.getAllUsers();
      users[this.targetEmail].clave = clave;
      this.saveAllUsers(users);

      alert('Contraseña actualizada. Ahora puedes iniciar sesión.');
      window.location.href = '/login';
    }
  }
}
