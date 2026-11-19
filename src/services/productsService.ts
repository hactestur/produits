import { supabase, isSupabaseConfigured, STORAGE_BUCKET_NAME } from '../config/supabase';
import type {
  Product,
  ProductFilters,
  ProductKPIs,
  CreateProductInput,
  UpdateProductInput,
  ProductAvailability,
  ProductVisibility,
  ProductImage,
} from '../types/product';
import { INITIAL_PRODUCTS } from './mockData';
import { categoriesService } from './categoriesService';
import { slugify, cleanSearchTerm } from '../utils/formatters';

const LOCAL_STORAGE_PRODUCTS_KEY = 'saveursdor_products_v1';

function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
}

export const productsService = {
  /**
   * Récupère les produits du catalogue public.
   * RÈGLE CRITIQUE : Retourne STRICTEMENT les produits dont la visibilité est 'published'
   */
  async getPublicProducts(filters?: ProductFilters): Promise<Product[]> {
    const activeCategories = await categoriesService.getCategories(false);
    const activeCategoryIds = new Set(activeCategories.map((c) => c.id));

    if (isSupabaseConfigured && supabase) {
      let query = (supabase.from('products') as any)
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('visibility', 'published');

      if (filters?.categoryId && filters.categoryId !== 'all') {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.availability && filters.availability !== 'all') {
        query = query.eq('availability', filters.availability);
      }

      if (filters?.minPrice !== undefined && filters.minPrice > 0) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (filters?.sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else if (filters?.sortBy === 'name_asc') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase error fetching public products:', error);
        throw new Error(`Erreur lors du chargement des produits: ${error.message}`);
      }

      let results: Product[] = ((data || []) as any[]).map((row) => ({
        ...row,
        images: (row.images || []).map((img: any) => ({
          ...img,
          url: img.storage_path.startsWith('http')
            ? img.storage_path
            : supabase!.storage.from(STORAGE_BUCKET_NAME).getPublicUrl(img.storage_path).data.publicUrl,
        })),
      }));

      // Filtrer pour ne garder que les catégories actives
      results = results.filter((p) => activeCategoryIds.has(p.category_id));

      // Recherche textuelle côté client
      if (filters?.search) {
        const cleanQuery = cleanSearchTerm(filters.search).toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(cleanQuery) ||
            (p.short_description && p.short_description.toLowerCase().includes(cleanQuery)) ||
            (p.description && p.description.toLowerCase().includes(cleanQuery))
        );
      }

      return results;
    }

    // Mode Local / Démo
    let products = getLocalProducts().filter((p) => p.visibility === 'published');

    // Ne retenir que les catégories actives
    products = products.filter((p) => activeCategoryIds.has(p.category_id));

    // Enrichir avec la catégorie correspondante
    products = products.map((p) => ({
      ...p,
      category: activeCategories.find((c) => c.id === p.category_id),
    }));

    // Filtre catégorie
    if (filters?.categoryId && filters.categoryId !== 'all') {
      products = products.filter((p) => p.category_id === filters.categoryId);
    }

    // Filtre disponibilité
    if (filters?.availability && filters.availability !== 'all') {
      products = products.filter((p) => p.availability === filters.availability);
    }

    // Filtre prix min
    if (filters?.minPrice !== undefined && filters.minPrice > 0) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }

    // Filtre prix max
    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    // Recherche
    if (filters?.search) {
      const cleanQuery = cleanSearchTerm(filters.search).toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          (p.short_description && p.short_description.toLowerCase().includes(cleanQuery)) ||
          (p.description && p.description.toLowerCase().includes(cleanQuery))
      );
    }

    // Tri
    if (filters?.sortBy === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (filters?.sortBy === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    } else {
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return products;
  },

  /**
   * Récupère tous les produits pour l'espace administration (y compris les produits masqués)
   */
  async getAllProductsAdmin(
    filters?: ProductFilters & { visibility?: 'all' | ProductVisibility }
  ): Promise<Product[]> {
    const allCategories = await categoriesService.getCategories(true);

    if (isSupabaseConfigured && supabase) {
      let query = (supabase.from('products') as any)
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `);

      if (filters?.visibility && filters.visibility !== 'all') {
        query = query.eq('visibility', filters.visibility);
      }

      if (filters?.categoryId && filters.categoryId !== 'all') {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.availability && filters.availability !== 'all') {
        query = query.eq('availability', filters.availability);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error('Supabase admin products fetch error:', error);
        throw new Error(`Erreur administrateur: ${error.message}`);
      }

      let results: Product[] = ((data || []) as any[]).map((row) => ({
        ...row,
        images: (row.images || []).map((img: any) => ({
          ...img,
          url: img.storage_path.startsWith('http')
            ? img.storage_path
            : supabase!.storage.from(STORAGE_BUCKET_NAME).getPublicUrl(img.storage_path).data.publicUrl,
        })),
      }));

      if (filters?.search) {
        const cleanQuery = cleanSearchTerm(filters.search).toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(cleanQuery) ||
            (p.short_description && p.short_description.toLowerCase().includes(cleanQuery))
        );
      }

      return results;
    }

    // Mode Local
    let products = getLocalProducts().map((p) => ({
      ...p,
      category: allCategories.find((c) => c.id === p.category_id),
    }));

    if (filters?.visibility && filters.visibility !== 'all') {
      products = products.filter((p) => p.visibility === filters.visibility);
    }

    if (filters?.categoryId && filters.categoryId !== 'all') {
      products = products.filter((p) => p.category_id === filters.categoryId);
    }

    if (filters?.availability && filters.availability !== 'all') {
      products = products.filter((p) => p.availability === filters.availability);
    }

    if (filters?.search) {
      const cleanQuery = cleanSearchTerm(filters.search).toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          (p.short_description && p.short_description.toLowerCase().includes(cleanQuery))
      );
    }

    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return products;
  },

  /**
   * Calcule les indicateurs clés (KPIs) en temps réel depuis les données
   */
  async getProductKPIs(): Promise<ProductKPIs> {
    const allProducts = await this.getAllProductsAdmin();

    const totalRegistered = allProducts.length;
    const publishedCount = allProducts.filter((p) => p.visibility === 'published').length;
    const availableCount = allProducts.filter((p) => p.availability === 'in_stock').length;
    const outOfStockCount = allProducts.filter((p) => p.availability === 'out_of_stock').length;
    const hiddenCount = allProducts.filter((p) => p.visibility === 'hidden').length;

    return {
      totalRegistered,
      publishedCount,
      availableCount,
      outOfStockCount,
      hiddenCount,
    };
  },

  /**
   * Récupère un produit par son identifiant
   */
  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await (supabase.from('products') as any)
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.warn('Supabase getProductById warning:', error.message);
        }
        return null;
      }

      return {
        ...data,
        images: (data.images || []).map((img: any) => ({
          ...img,
          url: img.storage_path.startsWith('http')
            ? img.storage_path
            : supabase!.storage.from(STORAGE_BUCKET_NAME).getPublicUrl(img.storage_path).data.publicUrl,
        })),
      } as Product;
    }

    const all = getLocalProducts();
    return all.find((p) => p.id === id) || null;
  },

  /**
   * Crée un nouveau produit avec ses images
   */
  async createProduct(
    input: CreateProductInput,
    imagesData: Array<{ url: string; storage_path: string; is_primary: boolean; alt_text?: string }> = []
  ): Promise<Product> {
    const slug = `${slugify(input.name)}-${Date.now().toString(36)}`;

    if (isSupabaseConfigured && supabase) {
      const { data: productRow, error: productErr } = await (supabase.from('products') as any)
        .insert({
          name: input.name,
          slug,
          category_id: input.category_id,
          price: input.price,
          availability: input.availability,
          visibility: input.visibility ?? 'published',
          short_description: input.short_description || null,
          description: input.description || null,
        })
        .select()
        .single();

      if (productErr) {
        console.error('Supabase error creating product:', productErr);
        throw new Error(`Échec de création du produit: ${productErr.message}`);
      }

      if (imagesData.length > 0) {
        const imageInserts = imagesData.map((img, idx) => ({
          product_id: productRow.id,
          storage_path: img.storage_path,
          alt_text: img.alt_text || input.name,
          display_order: idx,
          is_primary: img.is_primary,
        }));

        const { error: imageErr } = await (supabase.from('product_images') as any).insert(imageInserts);
        if (imageErr) {
          console.error('Supabase error saving product images:', imageErr);
          throw new Error(`Échec de l'enregistrement des photos: ${imageErr.message}`);
        }
      }

      return (await this.getProductById(productRow.id))!;
    }

    // Mode Local
    const local = getLocalProducts();
    const newId = `prod-${Date.now()}`;
    const newImages: ProductImage[] = imagesData.map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      product_id: newId,
      storage_path: img.storage_path,
      url: img.url,
      alt_text: img.alt_text || input.name,
      display_order: idx,
      is_primary: img.is_primary,
      created_at: new Date().toISOString(),
    }));

    // S'assurer qu'au moins une image est marquée principale s'il y a des images
    if (newImages.length > 0 && !newImages.some((i) => i.is_primary)) {
      newImages[0].is_primary = true;
    }

    const newProduct: Product = {
      id: newId,
      name: input.name,
      slug,
      short_description: input.short_description || null,
      description: input.description || null,
      price: input.price,
      category_id: input.category_id,
      availability: input.availability,
      visibility: input.visibility ?? 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: newImages,
    };

    local.unshift(newProduct);
    saveLocalProducts(local);
    return newProduct;
  },

  /**
   * Met à jour un produit existant et sa liste d'images
   */
  async updateProduct(
    id: string,
    input: UpdateProductInput,
    images?: ProductImage[]
  ): Promise<Product> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
      updateData.slug = `${slugify(input.name)}-${id.slice(-4)}`;
    }
    if (input.price !== undefined) updateData.price = input.price;
    if (input.category_id !== undefined) updateData.category_id = input.category_id;
    if (input.availability !== undefined) updateData.availability = input.availability;
    if (input.visibility !== undefined) updateData.visibility = input.visibility;
    if (input.short_description !== undefined) updateData.short_description = input.short_description;
    if (input.description !== undefined) updateData.description = input.description;

    if (isSupabaseConfigured && supabase) {
      const { error: updateErr } = await (supabase.from('products') as any)
        .update(updateData)
        .eq('id', id);

      if (updateErr) {
        throw new Error(`Erreur lors de la mise à jour: ${updateErr.message}`);
      }

      if (images) {
        // Remplacer les images
        const { error: delErr } = await (supabase.from('product_images') as any).delete().eq('product_id', id);
        if (delErr) {
          console.error('Supabase error deleting old images:', delErr);
          throw new Error(`Erreur lors du remplacement des images: ${delErr.message}`);
        }

        if (images.length > 0) {
          const { error: insErr } = await (supabase.from('product_images') as any).insert(
            images.map((img, idx) => ({
              product_id: id,
              storage_path: img.storage_path,
              alt_text: img.alt_text || null,
              display_order: idx,
              is_primary: img.is_primary,
            }))
          );
          if (insErr) {
            console.error('Supabase error saving updated images:', insErr);
            throw new Error(`Erreur lors de l'enregistrement des nouvelles images: ${insErr.message}`);
          }
        }
      }

      return (await this.getProductById(id))!;
    }

    // Local
    const local = getLocalProducts();
    const index = local.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Produit introuvable.');
    }

    local[index] = {
      ...local[index],
      ...updateData,
      images: images !== undefined ? images : local[index].images,
      updated_at: new Date().toISOString(),
    } as Product;

    // Vérification de la photo principale
    if (local[index].images.length > 0 && !local[index].images.some((i) => i.is_primary)) {
      local[index].images[0].is_primary = true;
    }

    saveLocalProducts(local);
    return local[index];
  },

  /**
   * Bascule la visibilité (Masquage / Démasquage — Soft Delete)
   * Conserve scrupuleusement le produit, ses images et son historique.
   */
  async toggleVisibility(id: string, visibility: ProductVisibility): Promise<Product> {
    return this.updateProduct(id, { visibility });
  },

  /**
   * Modifie le statut de disponibilité (En stock / En rupture de stock)
   */
  async toggleAvailability(id: string, availability: ProductAvailability): Promise<Product> {
    return this.updateProduct(id, { availability });
  },
};
