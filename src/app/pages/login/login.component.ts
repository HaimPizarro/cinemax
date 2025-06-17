import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm;
  errorMsg: string | null = null;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      recordar: [false]
    });
  }

  get emailInv()    { return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched; }
  get passwordInv() { return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched; }

  onSubmit() {
    this.errorMsg = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMsg = 'Por favor completa los datos correctamente.';
      return;
    }

    // Simulación de backend usando localStorage
    const usuariosStr = localStorage.getItem('usersCineMax');
    const usuarios = usuariosStr ? JSON.parse(usuariosStr) : {};

    const email = (this.loginForm.value.email ?? '').trim().toLowerCase();
    const pass  = (this.loginForm.value.password ?? '').trim();

    const user = usuarios[email];
    if (!user || user.clave !== pass) {
      this.errorMsg = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      this.loginForm.get('email')?.setErrors({ incorrect: true });
      this.loginForm.get('password')?.setErrors({ incorrect: true });
      return;
    }

    const sesion = {
      email: user.email,
      rol: user.rol,
      nombre: user.nombre,
      fechaLogin: new Date().toISOString()
    };
    sessionStorage.setItem('sesionCineMax', JSON.stringify(sesion));
    if (this.loginForm.value.recordar) {
      localStorage.setItem('recordarUsuario', email);
    } else {
      localStorage.removeItem('recordarUsuario');
    }

    alert(`¡Bienvenido/a ${user.nombre}!`);
    window.location.href = user.rol === 'admin' ? '/admin' : '/';
  }
}
