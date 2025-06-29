import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }        from '@angular/forms';
import { Router }                     from '@angular/router';

import { LoginComponent }             from './login.component';
import { UsuariosService, Usuario }   from '../../services/usuarios.services';
import { AuthService }                from '../../services/auth.services';

// — Mocks —
class MockUsuariosService {
  get(email: string): Usuario | undefined {
    if (email === 'admin@cinemax.com') {
      return {
        email: 'admin@cinemax.com',
        nombre: 'Haim',
        clave: 'Admin123',
        rol: 'admin'
      };
    }
    return undefined;
  }
}

class MockAuthService {
  login = jasmine.createSpy('login');
}

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture:   ComponentFixture<LoginComponent>;
  let usuarios:  UsuariosService;
  let auth:      MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,    // standalone component
        ReactiveFormsModule
      ],
      providers: [
        { provide: UsuariosService, useClass: MockUsuariosService },
        { provide: AuthService,     useClass: MockAuthService      },
        { provide: Router,          useValue: mockRouter          }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    usuarios  = TestBed.inject(UsuariosService);
    auth      = TestBed.inject(AuthService) as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar error si el formulario está vacío', () => {
    component.loginForm.setValue({ email: '', password: '', recordar: false });
    component.onSubmit();
    expect(component.errorMsg)
      .toBe('Por favor completa los datos correctamente.');
  });

  it('debe mostrar error con credenciales incorrectas', () => {
    component.loginForm.setValue({
      email: 'noexiste@cinemax.com',
      password: 'cualquier',
      recordar: false
    });
    component.onSubmit();
    expect(component.errorMsg)
      .toBe('Credenciales incorrectas. Verifica tu email y contraseña.');
  });

  it('debe loguear correctamente al usuario admin', () => {
    component.loginForm.setValue({
      email: 'admin@cinemax.com',
      password: 'Admin123',
      recordar: false
    });

    component.onSubmit();

    // AuthService.login debe haber sido llamado con la sesión
    expect(auth.login).toHaveBeenCalledWith(
      jasmine.objectContaining({ email: 'admin@cinemax.com', rol: 'admin' })
    );

    // Router.navigate debe haberse llamado con ['/admin']
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);

    // No debe quedar mensaje de error
    expect(component.errorMsg).toBeNull();
  });
});
