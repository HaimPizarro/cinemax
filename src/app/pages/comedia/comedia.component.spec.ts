import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ComediaComponent } from './comedia.component';
import { SupabaseService, Pelicula } from '../../services/supabase.services';
import { CartService } from '../../services/cart.services';
import { AuthService, Sesion } from '../../services/auth.services';

class MockSupabaseService {
  getPeliculasByGenero(_g: string): Promise<Pelicula[]> {
    return Promise.resolve([]);
  }
  createPelicula = jasmine.createSpy('createPelicula');
  updatePelicula = jasmine.createSpy('updatePelicula');
  deletePelicula = jasmine.createSpy('deletePelicula');
}

class MockCartService {
  agregarAlCarrito = jasmine.createSpy('agregarAlCarrito');
}

class MockAuthService {
  // emitimos rol cliente por defecto
  sesion$ = new BehaviorSubject<Sesion | null>({ email: '', nombre: '', rol: 'cliente', fechaLogin: '' });
}

describe('ComediaComponent', () => {
  let component: ComediaComponent;
  let fixture: ComponentFixture<ComediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ComediaComponent],
      providers: [
        { provide: SupabaseService, useClass: MockSupabaseService },
        { provide: CartService,    useClass: MockCartService    },
        { provide: AuthService,    useClass: MockAuthService    },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should calculate price correctly applying discount', () => {
    const peliSinDesc: Pelicula = { id:1, titulo:'A', genero:'comedia', anio:2022, descripcion:'', precio:100, descuento:0, imagen:'' };
    const peliConDesc: Pelicula = { ...peliSinDesc, descuento:25 };
    expect(component.precioFinal(peliSinDesc)).toBe(100);
    expect(component.precioFinal(peliConDesc)).toBe(75);
  });

  it('eliminarPelicula() debería abrir confirmación y asignar movieToDelete', () => {
    const mock: Pelicula = { id:42, titulo:'Mock Movie', genero:'comedia', anio:2023, descripcion:'', precio:50, descuento:0, imagen:'' };
    expect(component.showDeleteConfirm).toBeFalse();
    expect(component.movieToDelete).toBeUndefined();

    component.eliminarPelicula(mock);

    expect(component.showDeleteConfirm).toBeTrue();
    expect(component.movieToDelete).toEqual(mock);
  });
});
