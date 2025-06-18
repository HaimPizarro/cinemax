import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cineMaxCart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.obtenerCarrito());
  cart$ = this.cartSubject.asObservable();

  private obtenerCarrito(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private guardarCarrito(cart: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getCart() {
    return this.cartSubject.value;
  }

  getCount() {
    return this.getCart().reduce((sum, item) => sum + item.cantidad, 0);
  }

  getTotal() {
    return this.getCart().reduce((sum, item) => sum + item.cantidad * item.precio, 0);
  }

  agregarAlCarrito(nombre: string, precio: number) {
    let cart = this.getCart();
    const idx = cart.findIndex(i => i.nombre === nombre);
    if (idx > -1) {
      cart[idx].cantidad += 1;
    } else {
      cart.push({ nombre, precio, cantidad: 1 });
    }
    this.guardarCarrito([...cart]);
  }

  quitarDelCarrito(nombre: string) {
    let cart = this.getCart().filter(i => i.nombre !== nombre);
    this.guardarCarrito(cart);
  }

  eliminarPorIndice(index: number) {
    let cart = this.getCart();
    cart.splice(index, 1);
    this.guardarCarrito([...cart]);
  }

  limpiarCarrito() {
    this.guardarCarrito([]);
  }
}
