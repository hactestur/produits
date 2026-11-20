import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({
  label = 'Chargement en cours...',
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-12 h-12 border-4 border-stone-200 border-t-brand-700 rounded-full animate-spin mb-4" />
      <p className="text-base font-medium text-stone-600">{label}</p>
    </div>
  );
};

export const SkeletonProductCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-warm-xs animate-pulse h-full flex flex-col justify-between">
      <div className="aspect-[4/3] bg-cream-200/70 w-full shrink-0" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="h-3.5 bg-cream-200 rounded-md w-1/4" />
          <div className="h-5 bg-cream-200 rounded-md w-3/4" />
          <div className="h-4 bg-cream-200 rounded-md w-full" />
        </div>
        <div className="pt-3.5 border-t border-cream-100 flex items-center justify-between">
          <div className="h-6 bg-cream-200 rounded-md w-1/3" />
          <div className="h-9 bg-cream-200 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
};
