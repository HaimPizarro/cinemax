import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }        from '@angular/forms';
import { BehaviorSubject }            from 'rxjs';
import { EstrategiaComponent }        from './estrategia.component';
import { SupabaseService, Pelicula }  from '../../services/supabase.services';
import { CartService }                from '../../services/cart.services';
import { AuthService, Sesion }        from '../../services/auth.services';

class MockSupabaseService {
  getPeliculasByGenero = jasmine.createSpy('getPeliculasByGenero').and.resolveTo([]);
  createPelicula       = jasmine.createSpy('createPelicula');
  updatePelicula       = jasmine.createSpy('updatePelicula');
  deletePelicula       = jasmine.createSpy('deletePelicula');
}

class MockCartService {
  agregarAlCarrito = jasmine.createSpy('agregarAlCarrito');
}

class MockAuthService {
  sesion$ = new BehaviorSubject<Sesion | null>({ email:'', nombre:'', rol:'cliente', fechaLogin:'' });
}

describe('EstrategiaComponent (tests alternativos)', () => {
  let component: EstrategiaComponent;
  let fixture:   ComponentFixture<EstrategiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EstrategiaComponent],
      providers: [
        { provide: SupabaseService, useClass: MockSupabaseService },
        { provide: CartService,     useClass: MockCartService     },
        { provide: AuthService,     useClass: MockAuthService     },
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(EstrategiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit e initForm
  });

  it('precioFinal debe devolver mismo precio si no hay descuento', () => {
    const peli: Pelicula = {
      id: 1, titulo: 'X', genero: 'estrategia', anio: 2021,
      descripcion: '', precio: 150, descuento: 0, imagen: ''
    };
    expect(component.precioFinal(peli)).toBe(150);
  });

  it('eliminarPelicula() debe activar showDeleteConfirm y asignar movieToDelete', () => {
    const peli: Pelicula = {
      id: 2, titulo: 'Plan Maestro', genero: 'estrategia', anio: 2022,
      descripcion: '', precio: 200, descuento: 20, imagen: ''
    };
    expect(component.showDeleteConfirm).toBeFalse();
    expect(component.movieToDelete).toBeUndefined();

    component.eliminarPelicula(peli);

    expect(component.showDeleteConfirm).toBeTrue();
    expect(component.movieToDelete).toEqual(peli);
  });
});
