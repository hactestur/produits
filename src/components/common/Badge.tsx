import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold backdrop-blur-xs transition-colors shadow-warm-xs ${sizeClasses} ${
        isAvailable
          ? 'bg-forest-50/95 text-forest-900 border border-forest-300/80'
          : 'bg-amber-50/95 text-amber-950 border border-amber-300'
      }`}
      role="status"
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          isAvailable ? 'bg-forest-600 animate-pulse' : 'bg-amber-600'
        }`}
        aria-hidden="true"
      />
      <span>{isAvailable ? 'En stock' : 'En rupture'}</span>
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
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${
        isPublished
          ? 'bg-sage-100 text-sage-900 border border-sage-300'
          : 'bg-earth-100 text-earth-700 border border-earth-300'
      }`}
      role="status"
    >
      {isPublished ? (
        <>
          <Eye className="w-4 h-4 text-forest-700 shrink-0" aria-hidden="true" />
          <span>Publié</span>
        </>
      ) : (
        <>
          <EyeOff className="w-4 h-4 text-earth-500 shrink-0" aria-hidden="true" />
          <span>Masqué</span>
        </>
      )}
    </span>
  );
};
