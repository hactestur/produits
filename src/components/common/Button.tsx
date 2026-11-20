import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-sm px-3.5 py-2 min-h-[40px]',
    md: 'text-base px-5 py-2.5 min-h-[48px]', // 48px minimum touch target for mobile & senior accessibility
    lg: 'text-lg px-6 py-3.5 min-h-[54px]',
  };

  const variantStyles = {
    primary:
      'bg-forest-800 hover:bg-forest-700 active:bg-forest-900 text-white shadow-warm-sm hover:shadow-warm-md focus-visible:ring-forest-700 border border-forest-900/30',
    secondary:
      'bg-cream-100 hover:bg-cream-200 text-earth-900 border border-cream-300 focus-visible:ring-forest-600',
    gold:
      'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-forest-950 font-black shadow-warm-sm hover:shadow-warm-md focus-visible:ring-gold-500',
    outline:
      'border-2 border-forest-700 text-forest-800 hover:bg-forest-50 hover:text-forest-900 bg-white focus-visible:ring-forest-700',
    danger:
      'bg-rose-700 hover:bg-rose-800 text-white shadow-warm-xs focus-visible:ring-rose-600',
    ghost:
      'text-earth-800 hover:bg-cream-100/80 hover:text-forest-900 focus-visible:ring-forest-700',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2 inline-flex items-center shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
