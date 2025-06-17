import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  formError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      correo:   ['', [Validators.required, Validators.email]],
      nombre:   ['', [Validators.required]],
      clave:    ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/)]],
      clave2:   ['', [Validators.required]],
      fechaNac: ['', [Validators.required]]
    });
  }

  // Getters para controles
  get emailInv()    { return this.registroForm.get('correo')?.invalid && this.registroForm.get('correo')?.touched; }
  get nombreInv()   { return this.registroForm.get('nombre')?.invalid && this.registroForm.get('nombre')?.touched; }
  get claveInv()    { return this.registroForm.get('clave')?.invalid  && this.registroForm.get('clave')?.touched; }
  get clave2Inv()   { return this.registroForm.get('clave2')?.invalid && this.registroForm.get('clave2')?.touched; }
  get fechaNacInv() { return this.registroForm.get('fechaNac')?.invalid && this.registroForm.get('fechaNac')?.touched; }

  registrar() {
    this.formError = null;
    const f = this.registroForm.value;

    // Usar valores seguros por si alguno viene null
    const nombre   = (f.nombre ?? '').trim();
    const correo   = (f.correo ?? '').trim().toLowerCase();
    const clave    = f.clave ?? '';
    const clave2   = f.clave2 ?? '';
    const fechaNac = f.fechaNac ?? '';

    // Validación de campos requeridos
    if (!nombre || !correo || !clave || !clave2 || !fechaNac) {
      this.formError = "Todos los campos son obligatorios.";
      return;
    }

    // Validación de edad
    const edad = fechaNac
      ? new Date().getFullYear() - new Date(fechaNac).getFullYear()
      : 0;
    if (edad < 13) {
      this.formError = "Debes ser mayor de 13 años.";
      this.registroForm.get('fechaNac')?.setErrors({ tooYoung: true });
      return;
    }

    // Validación de contraseña
    const passRx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if (!passRx.test(clave)) {
      this.formError = "La contraseña debe tener 6-18 caracteres, al menos una mayúscula y un número.";
      this.registroForm.get('clave')?.setErrors({ pattern: true });
      return;
    }

    // Validación de claves iguales
    if (clave !== clave2) {
      this.formError = "Las contraseñas no coinciden.";
      this.registroForm.get('clave2')?.setErrors({ mismatch: true });
      return;
    }

    // Validación de correo duplicado
    const usersStr = localStorage.getItem('usersCineMax');
    let users = usersStr ? JSON.parse(usersStr) : {};

    if (users[correo]) {
      this.formError = "El correo ya está registrado.";
      this.registroForm.get('correo')?.setErrors({ duplicate: true });
      return;
    }

    // Guardar nuevo usuario
    users[correo] = {
      email: correo,
      nombre: nombre,
      clave: clave,
      rol: 'cliente',
      fechaNac: fechaNac
    };
    localStorage.setItem('usersCineMax', JSON.stringify(users));

    alert('Registro exitoso. ¡Ya puedes iniciar sesión!');
    window.location.href = '/login';
  }
}
