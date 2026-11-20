import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category';
import { INITIAL_CATEGORIES } from './mockData';
import { slugify, sanitizeCategoryName } from '../utils/formatters';

const LOCAL_STORAGE_KEY = 'saveursdor_categories_v1';

function getLocalCategories(): Category[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

function saveLocalCategories(cats: Category[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {
    console.error('Failed to save categories to localStorage', e);
  }
}

export const categoriesService = {
  /**
   * Récupère toutes les catégories (actives uniquement pour le public, toutes pour l'admin)
   */
  async getCategories(includeInactive = false): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      let query = (supabase.from('categories') as any)
        .select('*')
        .order('display_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase error fetching categories:', error);
        throw new Error(`Erreur lors du chargement des catégories: ${error.message}`);
      }
      return ((data || []) as Category[]).map((c) => ({
        ...c,
        name: sanitizeCategoryName(c.name),
      }));
    }

    // Mode Local / Démo
    const local = getLocalCategories();
    return local
      .filter((c) => (includeInactive ? true : c.is_active))
      .sort((a, b) => a.display_order - b.display_order)
      .map((c) => ({
        ...c,
        name: sanitizeCategoryName(c.name),
      }));
  },

  /**
   * Récupère une catégorie par son identifiant
   */
  async getCategoryById(id: string): Promise<Category | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await (supabase.from('categories') as any)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.warn('Supabase getCategoryById warning:', error.message);
        }
        return null;
      }
      return {
        ...(data as Category),
        name: sanitizeCategoryName((data as Category).name),
      };
    }

    const local = getLocalCategories();
    const found = local.find((c) => c.id === id);
    if (!found) return null;
    return {
      ...found,
      name: sanitizeCategoryName(found.name),
    };
  },

  /**
   * Crée une nouvelle catégorie
   */
  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const slug = slugify(input.name);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await (supabase.from('categories') as any)
        .insert({
          name: input.name,
          slug,
          description: input.description || null,
          is_active: input.is_active ?? true,
          display_order: input.display_order ?? 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating category:', error);
        throw new Error(`Impossible de créer la catégorie: ${error.message}`);
      }
      return data as Category;
    }

    // Local / Démo
    const local = getLocalCategories();
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: input.name,
      slug,
      description: input.description || null,
      is_active: input.is_active ?? true,
      display_order: input.display_order ?? (local.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    local.push(newCategory);
    saveLocalCategories(local);
    return newCategory;
  },

  /**
   * Met à jour une catégorie existante
   */
  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
      updateData.slug = slugify(input.name);
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    if (input.is_active !== undefined) {
      updateData.is_active = input.is_active;
    }
    if (input.display_order !== undefined) {
      updateData.display_order = input.display_order;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await (supabase.from('categories') as any)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating category:', error);
        throw new Error(`Erreur lors de la modification de la catégorie: ${error.message}`);
      }
      return data as Category;
    }

    const local = getLocalCategories();
    const index = local.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Catégorie introuvable.');
    }

    local[index] = {
      ...local[index],
      ...updateData,
      updated_at: new Date().toISOString(),
    } as Category;

    saveLocalCategories(local);
    return local[index];
  },

  /**
   * Active ou désactive une catégorie
   */
  async toggleCategoryStatus(id: string, is_active: boolean): Promise<Category> {
    return this.updateCategory(id, { is_active });
  },
};
