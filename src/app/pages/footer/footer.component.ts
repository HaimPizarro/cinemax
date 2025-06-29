import { Component } from '@angular/core';

/**
 * Componente que representa el pie de página de la aplicación.
 * Muestra un mensaje de derechos reservados y se posiciona al final de la página.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-dark text-white text-center py-4 mt-auto">
      <div class="container">
        <small>© 2024 CineMax. Todos los derechos reservados.</small>
      </div>
    </footer>
  `,
  styles: [
    `
      /* Estilos personalizados del footer */
      footer {
        flex-shrink: 0; /* Evita que el footer se reduzca si no hay espacio */
      }
      .bg-dark {
        background-color: #212529 !important;
      }
      .text-white {
        color: #fff !important;
      }
      .py-4 {
        padding-top: 1.5rem !important;
        padding-bottom: 1.5rem !important;
      }
      .mt-auto {
        margin-top: auto !important; /* Empuja el footer al fondo cuando se usa flexbox */
      }
    `
  ]
})
export class FooterComponent {}
