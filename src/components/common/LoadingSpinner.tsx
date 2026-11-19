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
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs animate-pulse">
      <div className="aspect-4/3 bg-stone-200 w-full" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-4 bg-stone-200 rounded-md w-1/3" />
        <div className="h-6 bg-stone-200 rounded-md w-3/4" />
        <div className="h-4 bg-stone-200 rounded-md w-full" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-7 bg-stone-200 rounded-md w-2/5" />
          <div className="h-7 bg-stone-200 rounded-full w-1/4" />
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
