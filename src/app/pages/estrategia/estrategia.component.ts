// src/app/pages/estrategia/estrategia.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CartService } from '../../services/cart.services';
import { AuthService, Sesion } from '../../services/auth.services';
import { SupabaseService, Pelicula } from '../../services/supabase.services';

@Component({
  selector: 'app-estrategia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estrategia.component.html',
})
export class EstrategiaComponent implements OnInit {
  estrategiaMovies: Pelicula[] = [];
  isClient = false;
  isAdmin = false;
  loading = false;
  errorMessage = '';

  // Confirm delete
  showDeleteConfirm = false;
  movieToDelete?: Pelicula;

  // Modal state
  addModalOpen = false;
  isEditMode = false;
  selectedMovieId?: number;

  newMovieForm!: FormGroup;
  submitting = false;

  constructor(
    private supabaseService: SupabaseService,
    private cartService: CartService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMovies();
    this.auth.sesion$.subscribe((s: Sesion | null) => {
      this.isClient = s?.rol === 'cliente';
      this.isAdmin = s?.rol === 'admin';
    });
  }

  private initForm(): void {
    this.newMovieForm = this.fb.group({
      titulo:      ['', [Validators.required, Validators.maxLength(100)]],
      genero:      ['estrategia', Validators.required],
      anio:        [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      descripcion: ['', [Validators.required, Validators.maxLength(400)]],
      precio:      [0,  [Validators.required, Validators.min(0)]],
      descuento:   [0,  [Validators.min(0), Validators.max(100)]],
      imagen:      ['', Validators.required],
    });
  }

  private async loadMovies(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.estrategiaMovies =
        await this.supabaseService.getPeliculasByGenero('estrategia');
    } catch (err) {
      console.error('Error cargando películas de estrategia:', err);
      this.errorMessage = 'No se pudieron cargar las películas de estrategia.';
    } finally {
      this.loading = false;
    }
  }

  openDialog(): void {
    this.isEditMode = false;
    this.selectedMovieId = undefined;
    this.newMovieForm.reset({
      genero: 'estrategia',
      anio: new Date().getFullYear(),
      descuento: 0
    });
    this.addModalOpen = true;
  }

  closeDialog(): void {
    this.addModalOpen = false;
  }

  editarPelicula(p: Pelicula): void {
    this.isEditMode = true;
    this.selectedMovieId = p.id;
    this.newMovieForm.patchValue({
      titulo:      p.titulo,
      genero:      p.genero,
      anio:        p.anio,
      descripcion: p.descripcion,
      precio:      p.precio,
      descuento:   p.descuento,
      imagen:      p.imagen
    });
    this.addModalOpen = true;
  }

  async guardarPelicula(): Promise<void> {
    if (this.newMovieForm.invalid) return;
    this.submitting = true;
    try {
      const payload = this.newMovieForm.value;
      if (this.isEditMode && this.selectedMovieId != null) {
        await this.supabaseService.updatePelicula(this.selectedMovieId, payload);
      } else {
        await this.supabaseService.createPelicula(payload);
      }
      await this.loadMovies();
      this.closeDialog();
    } catch (err) {
      console.error('Error al guardar la película:', err);
      alert('No se pudo guardar la película.');
    } finally {
      this.submitting = false;
    }
  }

  eliminarPelicula(p: Pelicula): void {
    this.movieToDelete = p;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.movieToDelete = undefined;
  }

  async confirmDelete(): Promise<void> {
    if (!this.movieToDelete) return;
    try {
      await this.supabaseService.deletePelicula(this.movieToDelete.id!);
      await this.loadMovies();
    } catch (err) {
      console.error('Error al eliminar película:', err);
      alert('No se pudo eliminar la película.');
    } finally {
      this.cancelDelete();
    }
  }

  agregarAlCarrito(p: Pelicula): void {
    this.cartService.agregarAlCarrito(p.titulo, this.precioFinal(p));
  }

  precioFinal(p: Pelicula): number {
    return p.descuento > 0
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
  }
}
