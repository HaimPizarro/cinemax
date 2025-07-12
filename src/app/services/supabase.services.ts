import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Pelicula {
  id?: number;
  genero: string;
  titulo: string;
  anio: number;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  // CRUD Operations

  async getPeliculas(): Promise<Pelicula[]> {
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .order('titulo', { ascending: true });

    if (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
    return data || [];
  }

  async getPelicula(id: number): Promise<Pelicula | null> {
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching movie:', error);
      throw error;
    }
    return data;
  }

  async getPeliculasByGenero(genero: string): Promise<Pelicula[]> {
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .ilike('genero', `%${genero}%`)
      .order('titulo', { ascending: true });

    if (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
    return data || [];
  }

  async createPelicula(pelicula: Omit<Pelicula, 'id'>): Promise<Pelicula> {
    const { data, error } = await this.supabase
      .from('peliculas')
      .insert([pelicula])
      .select()
      .single();

    if (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
    return data;
  }

  async updatePelicula(id: number, changes: Partial<Pelicula>): Promise<Pelicula> {
    const { data, error } = await this.supabase
      .from('peliculas')
      .update(changes)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
    return data;
  }

  async deletePelicula(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('peliculas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }

  // Método de búsqueda
  async searchPeliculas(searchTerm: string): Promise<Pelicula[]> {
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .or(`titulo.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
      .order('titulo', { ascending: true });

    if (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
    return data || [];
  }
}
