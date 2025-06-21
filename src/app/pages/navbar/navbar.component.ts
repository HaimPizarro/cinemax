import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Sesion } from '../../services/auth.services';
import { CartService } from '../../services/cart.services';
import { CartComponent } from '../../cart/cart.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, CartComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sesion: Sesion | null = null;
  cartCount = 0;

  // Para el modal de logout
  showLogoutModal = false;

  constructor(
    private auth: AuthService,
    public cartService: CartService,
    private router: Router
  ) {
    auth.sesion$.subscribe(s => (this.sesion = s));
    cartService.cart$.subscribe(() => {
      this.cartCount = cartService.getCount();
    });
  }

  // Abre el diálogo de confirmación
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  // Cancela el cierre de sesión
  cancelLogout() {
    this.showLogoutModal = false;
  }

  // Confirma y realiza el logout
  confirmLogout() {
    this.showLogoutModal = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
