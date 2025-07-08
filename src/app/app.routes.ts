// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { HomeComponent }        from './pages/home/home.component';
import { ComediaComponent }     from './pages/comedia/comedia.component';
import { DramaComponent }       from './pages/drama/drama.component';
import { TerrorComponent }      from './pages/terror/terror.component';
import { EstrategiaComponent }  from './pages/estrategia/estrategia.component';
import { PerfilComponent }      from './pages/perfil/perfil.component';
import { AdminComponent }       from './pages/admin/admin.component';
import { RegistroComponent }    from './pages/registro/registro.component';
import { LoginComponent }       from './pages/login/login.component';
import { RecuperarComponent }   from './pages/recuperar/recuperar.component';

export const routes: Routes = [
  // Página de inicio
  { path: '',               component: HomeComponent },

  // Catálogos por género
  { path: 'comedia',        component: ComediaComponent },
  { path: 'drama',          component: DramaComponent },
  { path: 'terror',         component: TerrorComponent },
  { path: 'estrategia',     component: EstrategiaComponent },

  // Áreas de usuario
  { path: 'perfil',         component: PerfilComponent },
  { path: 'admin',          component: AdminComponent },

  // Autenticación
  { path: 'registro',       component: RegistroComponent },
  { path: 'login',          component: LoginComponent },
  { path: 'recuperar',      component: RecuperarComponent },

  // Ruta comodín: redirige a la home
  { path: '**',             redirectTo: '', pathMatch: 'full' }
];
