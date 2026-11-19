import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-sm px-3 py-2 min-h-[40px]',
    md: 'text-base px-5 py-2.5 min-h-[48px]', // 48px minimum touch target for mobile & elderly accessibility
    lg: 'text-lg px-6 py-3.5 min-h-[54px]',
  };

  const variantStyles = {
    primary:
      'bg-brand-700 hover:bg-brand-800 text-white shadow-sm hover:shadow focus-visible:ring-brand-700',
    secondary:
      'bg-stone-100 hover:bg-stone-200 text-stone-800 focus-visible:ring-stone-400',
    outline:
      'border-2 border-stone-300 hover:border-brand-700 hover:text-brand-800 text-stone-700 bg-white focus-visible:ring-brand-700',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:ring-rose-600',
    ghost:
      'text-stone-700 hover:bg-stone-100 focus-visible:ring-stone-400',
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
          {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
