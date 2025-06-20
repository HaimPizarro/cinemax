import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../services/cart.services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cart: CartItem[] = [];
  total = 0;

  // Para controlar el toast
  notifMessage = '';
  notifType: 'success' | 'danger' = 'success';
  showToast = false;

  constructor(public cartService: CartService) {
    cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.total = cartService.getTotal();
    });

    cartService.notif$.subscribe(msg => {
      this.notifMessage = msg;
      this.notifType = msg.includes('agregada') ? 'success' : 'danger';
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 2000);
    });
  }

  eliminar(index: number) {
    this.cartService.eliminarPorIndice(index);
  }

  limpiar() {
    this.cartService.limpiarCarrito();
  }

  get totalAmount() {
    return this.total;
  }
}
