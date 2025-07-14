import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DramaComponent } from './drama.component';
import { SupabaseService, Pelicula } from '../../services/supabase.services';
import { CartService } from '../../services/cart.services';
import { AuthService, Sesion } from '../../services/auth.services';

class MockSupabaseService {
  getPeliculas(): Promise<Pelicula[]> {
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
  sesion$ = new BehaviorSubject<Sesion | null>({ email:'', nombre:'', rol:'admin', fechaLogin:'' });
}

describe('DramaComponent', () => {
  let component: DramaComponent;
  let fixture: ComponentFixture<DramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DramaComponent],
      providers: [
        { provide: SupabaseService, useClass: MockSupabaseService },
        { provide: CartService,    useClass: MockCartService    },
        { provide: AuthService,    useClass: MockAuthService    },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('precioFinal debe aplicar correctamente el descuento', () => {
    const sinDesc: Pelicula = { id:1, titulo:'X', genero:'drama', anio:2020, descripcion:'', precio:200, descuento:0, imagen:'' };
    const conDesc: Pelicula = { ...sinDesc, descuento:50 };
    expect(component.precioFinal(sinDesc)).toBe(200);
    expect(component.precioFinal(conDesc)).toBe(100);
  });

  it('editarPelicula debe preparar el formulario con los datos y abrir el modal en modo edición', () => {
    const peli: Pelicula = {
      id: 5,
      titulo: 'DramaTest',
      genero: 'drama',
      anio: 1999,
      descripcion: 'Desc',
      precio: 10,
      descuento: 5,
      imagen: 'url'
    };
    // Al inicio no está en edición ni abierto
    expect(component.isEditMode).toBeFalse();
    expect(component.addModalOpen).toBeFalse();

    component.editarPelicula(peli);

    expect(component.isEditMode).toBeTrue();
    expect(component.selectedMovieId).toBe(5);
    expect(component.addModalOpen).toBeTrue();
    // El formulario debe tener los mismos valores
    const f = component.newMovieForm.value;
    expect(f.titulo).toBe('DramaTest');
    expect(f.anio).toBe(1999);
    expect(f.precio).toBe(10);
    expect(f.descuento).toBe(5);
    expect(f.imagen).toBe('url');
  });
});
