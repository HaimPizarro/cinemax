import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; //
import { CartService, CartItem } from '../services/cart.services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CartComponent {
  cart: CartItem[] = [];
  total = 0;

  constructor(public cartService: CartService) {
    cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.total = cartService.getTotal();
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
