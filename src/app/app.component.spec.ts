import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {} },
            params:       of({}),
            queryParams:  of({}),
            url:          of([])
          }
        }
      ]
    }).compileComponents();
  });

  it('debería crear la app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debería tener el título "cinemax"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance as { title: string };
    expect(app.title).toBe('cinemax');
  });
});
