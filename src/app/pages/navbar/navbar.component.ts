import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Sesion } from '../../services/auth.services';
import { CartService } from '../../services/cart.services';
import { CartComponent } from '../../cart/cart.component';

/**
 * Componente de barra de navegación.
 * Muestra enlaces de navegación, control de sesión y cantidad de productos en el carrito.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, CartComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  /** Sesión activa del usuario */
  sesion: Sesion | null = null;

  /** Cantidad de productos en el carrito */
  cartCount = 0;

  /** Controla la visualización del modal de logout */
  showLogoutModal = false;

  constructor(
    private auth: AuthService,
    public cartService: CartService,
    private router: Router
  ) {
    // Se suscribe a los cambios de sesión
    auth.sesion$.subscribe(s => (this.sesion = s));

    // Se actualiza el contador del carrito ante cambios
    cartService.cart$.subscribe(() => {
      this.cartCount = cartService.getCount();
    });
  }

  /** Abre el modal de confirmación de logout */
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  /** Cierra el modal sin cerrar sesión */
  cancelLogout() {
    this.showLogoutModal = false;
  }

  /** Cierra sesión y redirige al login */
  confirmLogout() {
    this.showLogoutModal = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
