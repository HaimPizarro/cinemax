import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarComponent } from './recuperar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('RecuperarComponent', () => {
  let component: RecuperarComponent;
  let fixture: ComponentFixture<RecuperarComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecuperarComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar error si el correo no existe', () => {
    component.emailForm.setValue({ correo: 'no@existe.com' });
    component.verificarEmail();
    expect(component.emailError).toBe('No existe cuenta con ese correo.');
    expect(component.paso).toBe(1);
  });

  it('debería actualizar la contraseña correctamente', () => {
    const email = 'test@demo.com';
    const fakeUsers = {
      [email]: { email, nombre: 'Test', clave: 'Antigua123', rol: 'cliente' }
    };
    localStorage.setItem('usersCineMax', JSON.stringify(fakeUsers));

    component.targetEmail = email;
    component.paso = 2;
    component.resetForm.setValue({ clave: 'Nueva123', clave2: 'Nueva123' });
    component.resetearClave();

    const updated = JSON.parse(localStorage.getItem('usersCineMax') || '{}');
    expect(updated[email].clave).toBe('Nueva123');
    expect(component.toastText).toBe('Contraseña actualizada correctamente.');
    expect(component.toastType).toBe('success');
    expect(component.showToast).toBeTrue();
  });
});
