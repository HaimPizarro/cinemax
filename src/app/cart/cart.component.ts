import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../services/cart.services';

/**
 * Componente que muestra el contenido del carrito de compras.
 * Permite visualizar, eliminar y limpiar los productos agregados.
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  /** Arreglo con los elementos actuales del carrito */
  cart: CartItem[] = [];

  /** Monto total de la compra */
  total = 0;

  /** Mensaje mostrado en el toast (ej: agregado o eliminado) */
  notifMessage = '';

  /** Tipo de notificación: éxito o error */
  notifType: 'success' | 'danger' = 'success';

  /** Controla la visibilidad del toast */
  showToast = false;

  constructor(public cartService: CartService) {
    // Suscripción al carrito reactivo para mantener sincronización de datos
    cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.total = cartService.getTotal();
    });

    // Suscripción a mensajes de notificación del carrito
    cartService.notif$.subscribe(msg => {
      this.notifMessage = msg;
      this.notifType = msg.includes('agregada') ? 'success' : 'danger';
      this.showToast = true;

      // Ocultar toast automáticamente después de 2 segundos
      setTimeout(() => (this.showToast = false), 2000);
    });
  }

  /**
   * Elimina un ítem del carrito según su índice en la lista.
   * @param index Índice del elemento a eliminar
   */
  eliminar(index: number) {
    this.cartService.eliminarPorIndice(index);
  }

  /**
   * Elimina todos los elementos del carrito.
   */
  limpiar() {
    this.cartService.limpiarCarrito();
  }

  /**
   * Getter para retornar el total calculado del carrito.
   * @returns Monto total actual
   */
  get totalAmount() {
    return this.total;
  }
}
