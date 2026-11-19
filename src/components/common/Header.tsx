import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Lock, Phone } from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-shadow duration-200 shadow-xs">
      {/* Barre supérieure d'information entreprise */}
      <div className="bg-brand-900 text-brand-100 text-xs sm:text-sm px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-semibold text-white uppercase tracking-wider text-[11px] sm:text-xs bg-brand-800 px-2 py-0.5 rounded-sm">
            Grossiste & Demi-gros
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">{COMPANY_CONFIG.address}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 font-medium text-white">
          <a
            href={`tel:${COMPANY_CONFIG.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 hover:text-brand-300 transition-colors min-h-[32px]"
            aria-label={`Appeler le service client au ${COMPANY_CONFIG.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm">{COMPANY_CONFIG.phone}</span>
          </a>
        </div>
      </div>

      {/* Navigation Principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Identité Entreprise */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-xl p-1"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-md shadow-brand-900/10 group-hover:bg-brand-800 transition-colors">
              <ShoppingBag className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 block leading-tight">
                {COMPANY_CONFIG.name}
              </span>
              <span className="text-xs sm:text-sm text-stone-500 font-medium block">
                {COMPANY_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* Accès Espace Administration */}
          <div className="flex items-center gap-2">
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-brand-800 bg-stone-100 hover:bg-brand-50 hover:border-brand-300 border border-stone-200 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              aria-label="Accès à l'espace de gestion et d'administration"
            >
              <Lock className="w-4 h-4 text-stone-500" aria-hidden="true" />
              <span className="hidden sm:inline">
                {isAuthenticated ? 'Tableau de bord' : 'Espace Gestion'}
              </span>
              <span className="sm:hidden">Gestion</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
