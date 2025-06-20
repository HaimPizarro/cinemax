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
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  sesion: Sesion | null = null;
  cartCount = 0;

  constructor(
    private auth: AuthService,
    public cartService: CartService,
    private router: Router
  ) {
    // Suscribirse a cambios de sesión
    auth.sesion$.subscribe(s => (this.sesion = s));

    // Suscribirse a cambios del carrito
    cartService.cart$.subscribe(() => {
      this.cartCount = cartService.getCount();
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
