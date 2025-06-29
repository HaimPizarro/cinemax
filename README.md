# 🎬 CineMax

**CineMax** es una aplicación web construida con Angular que simula una plataforma de arriendo de películas en línea. Permite a usuarios registrados navegar por distintas categorías, añadir películas al carrito, modificar su perfil y administrar su sesión. Cuenta con funcionalidades diferenciadas para usuarios **admin** y **cliente**.

---

## Tecnologías Utilizadas

- **Angular 17+**  
- **TypeScript**  
- **RxJS**  
- **Bootstrap 5** + CSS personalizado  
- **LocalStorage / SessionStorage** para persistencia  
- **Jasmine + Karma** para testing  

---

## Funcionalidades

### Gestión de Usuarios
- **Registro** con validaciones de email, contraseña (6–18 caracteres, al menos 1 mayúscula y 1 dígito) y edad mínima (13 años).  
- **Inicio de sesión** con `AuthService` y opción “recordar usuario”.  
- **Recuperación de contraseña** en dos pasos, con validación y notificación vía toast.  
- **Perfil**: visualizar y editar nombre o contraseña, con mensajes de éxito/fracaso.  
- **Roles**:  
  - **cliente**: puede ver precios, agregar al carrito y comprar.  
  - **admin**: accede a un panel de gestión de usuarios (editar/eliminar) y visualiza métricas simuladas.

### Catálogo de Películas
- Cuatro géneros (Comedia, Drama, Terror, Estrategia), cada uno con tarjetas que muestran título, año, descripción, badge de descuento, precio final y botón “Agregar al carrito” (solo para clientes).

### Carrito de Compras
- Persistido en **localStorage**, desplegado en un offcanvas desde la navbar.  
- Lista productos, cantidades, precio total y botón “Ir a pagar”.  
- Toasts de notificación (“Película agregada”, “Película quitada”).

### Persistencia y Sesión
- **SessionStorage** para la sesión activa.  
- **LocalStorage** para usuarios, carrito y “recordar usuario”.  
- Servicios Angular (`AuthService`, `UsuariosService`, `CartService`) utilizan **BehaviorSubject** y **Subject** para flujos reactivos.

---

## Instalación y Ejecución

1. Clonar el repo:  
   ```bash
   git clone https://github.com/tu-usuario/cinemax.git
   cd cinemax
