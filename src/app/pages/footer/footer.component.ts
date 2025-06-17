import { Component } from '@angular/core';

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
      footer {
        flex-shrink: 0;
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
        margin-top: auto !important;
      }
    `
  ]
})
export class FooterComponent {

}
