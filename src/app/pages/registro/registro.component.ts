import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Componente de Registro de nuevos usuarios.
 * Permite al usuario crear una cuenta validando los campos y almacenando los datos en `localStorage`.
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  /** Formulario reactivo de registro */
  registroForm!: FormGroup;

  /** Mensaje de error mostrado en el formulario */
  formError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Inicializa el formulario con sus validadores
    this.registroForm = this.fb.group({
      correo:   ['', [Validators.required, Validators.email]],
      nombre:   ['', [Validators.required]],
      clave:    ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/)]],
      clave2:   ['', [Validators.required]],
      fechaNac: ['', [Validators.required]]
    });
  }

  // --- Getters para validaciones en la plantilla ---

  /** Valida el campo correo */
  get emailInv()    { return this.registroForm.get('correo')?.invalid && this.registroForm.get('correo')?.touched; }

  /** Valida el campo nombre */
  get nombreInv()   { return this.registroForm.get('nombre')?.invalid && this.registroForm.get('nombre')?.touched; }

  /** Valida el campo clave */
  get claveInv()    { return this.registroForm.get('clave')?.invalid  && this.registroForm.get('clave')?.touched; }

  /** Valida el campo clave2 */
  get clave2Inv()   { return this.registroForm.get('clave2')?.invalid && this.registroForm.get('clave2')?.touched; }

  /** Valida el campo fecha de nacimiento */
  get fechaNacInv() { return this.registroForm.get('fechaNac')?.invalid && this.registroForm.get('fechaNac')?.touched; }

  /**
   * Ejecuta el proceso de registro del usuario,
   * realizando validaciones y guardando los datos si todo es correcto.
   */
  registrar() {
    this.formError = null;
    const f = this.registroForm.value;

    // Extrae los valores y aplica limpieza básica
    const nombre   = (f.nombre ?? '').trim();
    const correo   = (f.correo ?? '').trim().toLowerCase();
    const clave    = f.clave ?? '';
    const clave2   = f.clave2 ?? '';
    const fechaNac = f.fechaNac ?? '';

    // Validación de campos obligatorios
    if (!nombre || !correo || !clave || !clave2 || !fechaNac) {
      this.formError = "Todos los campos son obligatorios.";
      return;
    }

    // Validación de edad mínima (13 años)
    const edad = fechaNac
      ? new Date().getFullYear() - new Date(fechaNac).getFullYear()
      : 0;
    if (edad < 13) {
      this.formError = "Debes ser mayor de 13 años.";
      this.registroForm.get('fechaNac')?.setErrors({ tooYoung: true });
      return;
    }

    // Validación de formato de contraseña
    const passRx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if (!passRx.test(clave)) {
      this.formError = "La contraseña debe tener 6-18 caracteres, al menos una mayúscula y un número.";
      this.registroForm.get('clave')?.setErrors({ pattern: true });
      return;
    }

    // Validación de coincidencia de claves
    if (clave !== clave2) {
      this.formError = "Las contraseñas no coinciden.";
      this.registroForm.get('clave2')?.setErrors({ mismatch: true });
      return;
    }

    // Validación de correo ya registrado
    const usersStr = localStorage.getItem('usersCineMax');
    let users = usersStr ? JSON.parse(usersStr) : {};

    if (users[correo]) {
      this.formError = "El correo ya está registrado.";
      this.registroForm.get('correo')?.setErrors({ duplicate: true });
      return;
    }

    // Guarda al nuevo usuario en localStorage
    users[correo] = {
      email: correo,
      nombre: nombre,
      clave: clave,
      rol: 'cliente',
      fechaNac: fechaNac
    };
    localStorage.setItem('usersCineMax', JSON.stringify(users));

    // Notificación y redirección
    alert('Registro exitoso. ¡Ya puedes iniciar sesión!');
    window.location.href = '/login';
  }
}
