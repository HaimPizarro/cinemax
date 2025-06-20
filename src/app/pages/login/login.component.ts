import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.services';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private auth: AuthService,
    private router: Router
  ) {
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

    const email = (this.loginForm.value.email ?? '').trim().toLowerCase();
    const pass  = (this.loginForm.value.password ?? '').trim();

    const user = this.usuariosService.get(email);

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

    this.auth.login(sesion);
    sessionStorage.setItem('showWelcome', 'true');
    this.router.navigate([user.rol === 'admin' ? '/admin' : '/']);
  }
}
