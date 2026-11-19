import { z } from 'zod';

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Schéma de validation pour le formulaire Produit
 */
export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom du produit doit contenir au moins 2 caractères')
    .max(150, 'Le nom ne peut pas dépasser 150 caractères')
    .trim(),
  category_id: z
    .string()
    .min(1, 'Veuillez sélectionner une catégorie valide'),
  price: z
    .coerce
    .number({ message: 'Le prix doit être un nombre valide' })
    .positive('Le prix doit être strictement supérieur à 0 FCFA')
    .int('Le prix doit être un montant entier en FCFA'),
  availability: z.enum(['in_stock', 'out_of_stock'], {
    message: 'Veuillez sélectionner un statut de disponibilité',
  }),
  visibility: z.enum(['published', 'hidden']).default('published'),
  short_description: z
    .string()
    .max(250, 'La description courte ne doit pas dépasser 250 caractères')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(2000, 'La description détaillée ne doit pas dépasser 2000 caractères')
    .optional()
    .or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

/**
 * Schéma de validation pour le formulaire Catégorie
 */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom de la catégorie doit contenir au moins 2 caractères')
    .max(80, 'Le nom ne peut pas dépasser 80 caractères')
    .trim(),
  description: z
    .string()
    .max(300, 'La description ne doit pas dépasser 300 caractères')
    .optional()
    .or(z.literal('')),
  display_order: z
    .coerce
    .number()
    .min(0, "L'ordre d'affichage doit être positif ou nul")
    .default(0),
  is_active: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

/**
 * Schéma de validation de connexion administrateur
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .email('Veuillez saisir une adresse e-mail valide')
    .trim(),
  password: z
    .string()
    .min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * Vérifie la validité d'un fichier photo uploadé
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Format non supporté (${file.type}). Formats acceptés : JPEG, PNG, WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Le fichier est trop volumineux (${sizeInMB} Mo). La taille maximale est de 5 Mo.`,
    };
  }

  return { valid: true };
}
