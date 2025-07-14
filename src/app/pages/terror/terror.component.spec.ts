import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }        from '@angular/forms';
import { BehaviorSubject }            from 'rxjs';
import { TerrorComponent }            from './terror.component';
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
  sesion$ = new BehaviorSubject<Sesion | null>({ email:'', nombre:'', rol:'admin', fechaLogin:'' });
}

describe('TerrorComponent (tests alternativos)', () => {
  let component: TerrorComponent;
  let fixture:   ComponentFixture<TerrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TerrorComponent],
      providers: [
        { provide: SupabaseService, useClass: MockSupabaseService },
        { provide: CartService,     useClass: MockCartService     },
        { provide: AuthService,     useClass: MockAuthService     },
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(TerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit e initForm
  });

  it('precioFinal debe aplicar descuento correctamente', () => {
    const peliSinDesc: Pelicula = {
      id: 3, titulo: 'Miedo', genero: 'terror', anio: 2020,
      descripcion: '', precio: 120, descuento: 0, imagen: ''
    };
    const peliConDesc = { ...peliSinDesc, descuento: 50 };

    expect(component.precioFinal(peliSinDesc)).toBe(120);
    expect(component.precioFinal(peliConDesc)).toBe(60);
  });

  it('cancelDelete() debe cerrar el diálogo de confirmación y limpiar movieToDelete', () => {
    // Primero simulamos que está abierto
    component.movieToDelete = { id:4, titulo:'Susto', genero:'terror', anio:2021, descripcion:'', precio:100, descuento:10, imagen:'' };
    component.showDeleteConfirm = true;

    component.cancelDelete();

    expect(component.showDeleteConfirm).toBeFalse();
    expect(component.movieToDelete).toBeUndefined();
  });
});
