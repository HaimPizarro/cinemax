import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * Representa un ítem en el carrito de compras.
 */
export interface CartItem {
  nombre: string;
  precio: number;
  cantidad: number;
}

/**
 * Servicio que maneja las operaciones del carrito de compras,
 * incluyendo agregar, quitar, limpiar y calcular totales.
 * Utiliza `localStorage` para persistencia y `rxjs` para notificaciones.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  /** Clave para guardar el carrito en localStorage */
  private storageKey = 'cineMaxCart';

  /** Subject que contiene el estado actual del carrito */
  private cartSubject = new BehaviorSubject<CartItem[]>(this.obtenerCarrito());
  /** Observable del carrito para suscribirse a cambios */
  cart$ = this.cartSubject.asObservable();

  /** Subject que emite mensajes de notificación (ej: "Película agregada") */
  private notifSubject = new Subject<string>();
  /** Observable de notificaciones para mostrar feedback en el UI */
  notif$ = this.notifSubject.asObservable();

  /**
   * Obtiene el carrito desde `localStorage`.
   * @returns Lista de elementos en el carrito.
   */
  private obtenerCarrito(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Guarda el carrito en `localStorage` y emite el nuevo valor a los observadores.
   * @param cart Arreglo de elementos del carrito actualizado.
   */
  private guardarCarrito(cart: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  /**
   * Devuelve el carrito actual.
   * @returns Arreglo actual de `CartItem`.
   */
  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  /**
   * Devuelve la cantidad total de películas en el carrito.
   * @returns Número total de ítems.
   */
  getCount(): number {
    return this.getCart().reduce((sum, item) => sum + item.cantidad, 0);
  }

  /**
   * Calcula el total a pagar del carrito.
   * @returns Suma de (precio * cantidad) de todos los ítems.
   */
  getTotal(): number {
    return this.getCart().reduce((sum, item) => sum + item.cantidad * item.precio, 0);
  }

  /**
   * Agrega una película al carrito. Si ya existe, incrementa la cantidad.
   * @param nombre Nombre de la película.
   * @param precio Precio unitario.
   */
  agregarAlCarrito(nombre: string, precio: number): void {
    let cart = this.getCart();
    const idx = cart.findIndex(i => i.nombre === nombre);
    if (idx > -1) {
      cart[idx].cantidad += 1;
    } else {
      cart.push({ nombre, precio, cantidad: 1 });
    }
    this.guardarCarrito([...cart]);
    this.notifSubject.next('Película agregada');
  }

  /**
   * Quita una película del carrito por su nombre.
   * @param nombre Nombre de la película a eliminar.
   */
  quitarDelCarrito(nombre: string): void {
    const cart = this.getCart().filter(i => i.nombre !== nombre);
    this.guardarCarrito(cart);
    this.notifSubject.next('Película quitada');
  }

  /**
   * Elimina una película según su índice en el array.
   * @param index Índice del ítem a eliminar.
   */
  eliminarPorIndice(index: number): void {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.guardarCarrito([...cart]);
    this.notifSubject.next('Película quitada');
  }

  /**
   * Limpia completamente el carrito.
   */
  limpiarCarrito(): void {
    this.guardarCarrito([]);
    this.notifSubject.next('Carrito vaciado');
  }
}
