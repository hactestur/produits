import React from 'react';
import { CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import type { ProductAvailability, ProductVisibility } from '../../types/product';

interface AvailabilityBadgeProps {
  availability: ProductAvailability;
  size?: 'sm' | 'md';
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  availability,
  size = 'md',
}) => {
  const isAvailable = availability === 'in_stock';
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${
        isAvailable
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          : 'bg-amber-50 text-amber-900 border border-amber-300'
      }`}
      role="status"
    >
      {isAvailable ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Disponible</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>En rupture</span>
        </>
      )}
    </span>
  );
};

interface VisibilityBadgeProps {
  visibility: ProductVisibility;
  size?: 'sm' | 'md';
}

export const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({
  visibility,
  size = 'md',
}) => {
  const isPublished = visibility === 'published';
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${
        isPublished
          ? 'bg-brand-50 text-brand-800 border border-brand-200'
          : 'bg-stone-100 text-stone-700 border border-stone-300'
      }`}
      role="status"
    >
      {isPublished ? (
        <>
          <Eye className="w-4 h-4 text-brand-700 shrink-0" aria-hidden="true" />
          <span>Publié</span>
        </>
      ) : (
        <>
          <EyeOff className="w-4 h-4 text-stone-500 shrink-0" aria-hidden="true" />
          <span>Masqué</span>
        </>
      )}
    </span>
  );
};
