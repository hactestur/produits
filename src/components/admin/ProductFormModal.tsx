import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product } from '../../types/product';
import type { Category } from '../../types/category';
import { productFormSchema, validateImageFile } from '../../utils/validators';
import type { ProductFormData } from '../../utils/validators';
import { storageService } from '../../services/storageService';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Upload, Trash2, Star, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  categories: Category[];
  onSubmitSuccess: () => void;
  onSaveProduct: (
    data: ProductFormData,
    images: Array<{ url: string; storage_path: string; is_primary: boolean; alt_text?: string }>
  ) => Promise<void>;
}

interface ImageState {
  id?: string;
  url: string;
  storage_path: string;
  is_primary: boolean;
  alt_text?: string;
  isNew?: boolean;
  file?: File;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  categories,
  onSubmitSuccess,
  onSaveProduct,
}) => {
  const isEditing = Boolean(productToEdit);
  const [images, setImages] = useState<ImageState[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: '',
      category_id: '',
      price: 1000,
      availability: 'in_stock',
      visibility: 'published',
      short_description: '',
      description: '',
    },
  });

  // Réinitialisation du formulaire lors de l'ouverture ou du changement de produit
  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      setImageError(null);
      if (productToEdit) {
        reset({
          name: productToEdit.name,
          category_id: productToEdit.category_id,
          price: productToEdit.price,
          availability: productToEdit.availability,
          visibility: productToEdit.visibility,
          short_description: productToEdit.short_description || '',
          description: productToEdit.description || '',
        });
        setImages(
          productToEdit.images.map((img) => ({
            id: img.id,
            url: img.url,
            storage_path: img.storage_path,
            is_primary: img.is_primary,
            alt_text: img.alt_text || '',
            isNew: false,
          }))
        );
      } else {
        reset({
          name: '',
          category_id: categories.length > 0 ? categories[0].id : '',
          price: 1000,
          availability: 'in_stock',
          visibility: 'published',
          short_description: '',
          description: '',
        });
        setImages([]);
      }
    }
  }, [isOpen, productToEdit, categories, reset]);

  // Gestion du téléversement de nouvelles photos
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError(null);
    const newImagesList: ImageState[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);

      if (!validation.valid) {
        setImageError(validation.error || 'Fichier image non valide.');
        continue;
      }

      try {
        const tempId = `temp-${Date.now()}-${i}`;
        const previewUrl = URL.createObjectURL(file);
        const shouldBePrimary = newImagesList.length === 0;

        newImagesList.push({
          id: tempId,
          url: previewUrl,
          storage_path: `pending/${file.name}`,
          is_primary: shouldBePrimary,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          isNew: true,
          file,
        });
      } catch {
        setImageError('Erreur lors de la lecture du fichier.');
      }
    }

    setImages(newImagesList);
    e.target.value = ''; // Réinitialiser le champ input
  };

  // Définir une photo comme photo principale
  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_primary: idx === index,
      }))
    );
  };

  // Supprimer une photo
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      // Si la photo supprimée était principale et qu'il reste des photos, désigner la première
      if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  };

  // Soumission finale du formulaire
  const onFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Téléversement des nouvelles images vers le stockage
      const processedImages: Array<{
        url: string;
        storage_path: string;
        is_primary: boolean;
        alt_text?: string;
      }> = [];

      for (const img of images) {
        if (img.isNew && img.file) {
          const uploadRes = await storageService.uploadProductImage(
            productToEdit ? productToEdit.id : 'new-product',
            img.file
          );
          processedImages.push({
            url: uploadRes.publicUrl,
            storage_path: uploadRes.storagePath,
            is_primary: img.is_primary,
            alt_text: img.alt_text,
          });
        } else {
          processedImages.push({
            url: img.url,
            storage_path: img.storage_path,
            is_primary: img.is_primary,
            alt_text: img.alt_text,
          });
        }
      }

      // S'assurer qu'au moins une photo est principale s'il y a des photos
      if (processedImages.length > 0 && !processedImages.some((i) => i.is_primary)) {
        processedImages[0].is_primary = true;
      }

      await onSaveProduct(data, processedImages);
      onSubmitSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erreur lors de la sauvegarde du produit:', err);
      setFormError(
        err instanceof Error ? err.message : 'Une erreur inattendue est survenue.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier le produit' : 'Créer un nouveau produit'}
      description="Remplissez les informations du produit. Les données sont enregistrées de façon sécurisée."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {formError && (
          <div
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Erreur d'enregistrement</p>
              <p className="mt-0.5">{formError}</p>
            </div>
          </div>
        )}

        {/* Section 1 : Informations principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nom du produit */}
          <div className="sm:col-span-2">
            <label htmlFor="prod-name" className="block text-sm font-bold text-stone-800 mb-1.5">
              Nom du produit <span className="text-rose-600">*</span>
            </label>
            <input
              id="prod-name"
              type="text"
              placeholder="Ex : Riz Parfumé Brisé Dinor — Sac 25 kg"
              {...register('name')}
              className={`w-full p-3 bg-white border rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                errors.name ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="prod-category" className="block text-sm font-bold text-stone-800 mb-1.5">
              Famille / Catégorie <span className="text-rose-600">*</span>
            </label>
            <select
              id="prod-category"
              {...register('category_id')}
              className={`w-full p-3 bg-white border rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                errors.category_id ? 'border-rose-500' : 'border-stone-300'
              }`}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories
                .filter((c) => c.is_active || (productToEdit && productToEdit.category_id === c.id))
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {!cat.is_active ? '(Désactivée)' : ''}
                  </option>
                ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.category_id.message}</p>
            )}
          </div>

          {/* Prix en FCFA */}
          <div>
            <label htmlFor="prod-price" className="block text-sm font-bold text-stone-800 mb-1.5">
              Prix en FCFA <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <input
                id="prod-price"
                type="number"
                min="1"
                step="1"
                placeholder="Ex : 18500"
                {...register('price')}
                className={`w-full p-3 pr-16 bg-white border rounded-xl text-stone-900 text-base font-bold min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.price ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300'
                }`}
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-bold text-stone-500 pointer-events-none">
                FCFA
              </span>
            </div>
            {errors.price && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.price.message}</p>
            )}
          </div>

          {/* Statut de disponibilité */}
          <div>
            <label htmlFor="prod-availability" className="block text-sm font-bold text-stone-800 mb-1.5">
              Disponibilité <span className="text-rose-600">*</span>
            </label>
            <select
              id="prod-availability"
              {...register('availability')}
              className="w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              <option value="in_stock">Disponible en stock</option>
              <option value="out_of_stock">En rupture de stock</option>
            </select>
          </div>

          {/* Statut de visibilité (Soft delete) */}
          <div>
            <label htmlFor="prod-visibility" className="block text-sm font-bold text-stone-800 mb-1.5">
              Visibilité publique
            </label>
            <select
              id="prod-visibility"
              {...register('visibility')}
              className="w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              <option value="published">Publié (visible dans le catalogue)</option>
              <option value="hidden">Masqué (invisible du public)</option>
            </select>
          </div>
        </div>

        {/* Section 2 : Descriptions */}
        <div className="space-y-4">
          <div>
            <label htmlFor="prod-short-desc" className="block text-sm font-bold text-stone-800 mb-1.5">
              Description courte (Affichée sur la carte produit)
            </label>
            <input
              id="prod-short-desc"
              type="text"
              placeholder="Ex : Riz blanc parfumé 100% brisé de qualité supérieure."
              {...register('short_description')}
              className="w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
            {errors.short_description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.short_description.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="prod-desc" className="block text-sm font-bold text-stone-800 mb-1.5">
              Description complète (Affichée sur la fiche détaillée)
            </label>
            <textarea
              id="prod-desc"
              rows={4}
              placeholder="Détails du conditionnement, caractéristiques nutritionnelles, conseils d'utilisation..."
              {...register('description')}
              className="w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-base focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Section 3 : Gestionnaire de Photos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Photos du produit ({images.length})
              </h3>
              <p className="text-xs text-stone-500">
                Formats acceptés : JPEG, PNG, WebP (Max 5 Mo par photo). Désignez une photo principale.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold cursor-pointer transition-colors min-h-[44px]">
              <Upload className="w-4 h-4" />
              <span>Ajouter des photos</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {imageError && (
            <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {imageError}
            </p>
          )}

          {/* Liste des aperçus des photos */}
          {images.length === 0 ? (
            <div className="py-8 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400">
              <ImageIcon className="w-10 h-10 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium">Aucune photo ajoutée pour ce produit</p>
              <p className="text-xs text-stone-400 mt-0.5">Cliquez sur « Ajouter des photos » ci-dessus</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`relative group rounded-xl overflow-hidden border-2 bg-white shadow-xs ${
                    img.is_primary ? 'border-brand-700 ring-2 ring-brand-700/20' : 'border-stone-200'
                  }`}
                >
                  <div className="aspect-square w-full bg-stone-100 overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt_text || `Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Badge Principale */}
                  {img.is_primary && (
                    <span className="absolute top-2 left-2 bg-brand-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> Principale
                    </span>
                  )}

                  {/* Actions sur chaque photo */}
                  <div className="p-2 bg-white flex items-center justify-between border-t border-stone-100">
                    {!img.is_primary ? (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="text-xs font-semibold text-stone-600 hover:text-brand-800 transition-colors p-1"
                        title="Définir comme photo principale"
                      >
                        Mettre en principale
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-brand-800 p-1">Sélectionnée</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Supprimer cette photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pied : Boutons d'action */}
        <div className="pt-4 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:w-auto min-w-[160px]"
          >
            {isEditing ? 'Enregistrer les modifications' : 'Créer le produit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
