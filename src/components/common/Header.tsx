import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Lock,
  Phone,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatFCFA } from '../../utils/formatters';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { totalItems, totalAmount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isCatalogue = location.pathname.startsWith('/catalogue');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200 transition-shadow duration-200 shadow-warm-xs">
      {/* Barre supérieure d'information B2B & Grossiste */}
      <div className="bg-forest-950 text-cream-200 text-xs px-4 py-1.5 border-b border-forest-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-extrabold uppercase tracking-wider text-[10px] bg-gold-500 text-forest-950 px-2 py-0.5 rounded shadow-warm-xs">
              Épicerie Fine & Grossiste
            </span>
            <span className="hidden sm:inline text-forest-700">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-cream-300">
              <MapPin className="w-3 h-3 text-gold-400" />
              <span>{COMPANY_CONFIG.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-medium">
            <a
              href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}?text=${encodeURIComponent(
                `Bonjour ${COMPANY_CONFIG.fullName}, je souhaite des informations sur vos disponibilités et arrivages.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gold-300 hover:text-gold-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-gold-400" aria-hidden="true" />
              <span className="hidden md:inline">WhatsApp Commercial :</span>
              <span className="font-bold">{COMPANY_CONFIG.whatsapp}</span>
            </a>

            <span className="hidden md:inline text-forest-800">•</span>

            <a
              href={`tel:${COMPANY_CONFIG.phoneRaw}`}
              className="hidden md:inline-flex items-center gap-1.5 text-cream-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-forest-400" aria-hidden="true" />
              <span>{COMPANY_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Identité Saveurs d'Or / AMIGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 rounded-2xl p-1"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 text-gold-400 flex items-center justify-center shadow-warm-md border border-forest-700/50 group-hover:from-forest-700 group-hover:to-forest-900 transition-all duration-200">
              <Sparkles className="w-6 h-6 stroke-[2]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-forest-950 leading-tight">
                  {COMPANY_CONFIG.brandName}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-forest-50 text-forest-800 border border-forest-200">
                  par {COMPANY_CONFIG.parentCompany}
                </span>
              </div>
              <span className="text-xs text-earth-600 font-medium block -mt-0.5">
                {COMPANY_CONFIG.subTagline}
              </span>
            </div>
          </Link>

          {/* Liens de Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] flex items-center ${
                isHome
                  ? 'text-forest-900 bg-cream-100/90 shadow-warm-xs'
                  : 'text-earth-700 hover:text-forest-950 hover:bg-cream-50'
              }`}
            >
              Accueil
            </Link>

            <Link
              to="/catalogue"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] flex items-center gap-1.5 ${
                isCatalogue
                  ? 'text-forest-900 bg-cream-100/90 shadow-warm-xs'
                  : 'text-earth-700 hover:text-forest-950 hover:bg-cream-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Rayons & Prix (FCFA)</span>
            </Link>

            <a
              href="/#comment-commander"
              className="px-4 py-2 rounded-xl text-sm font-bold text-earth-700 hover:text-forest-950 hover:bg-cream-50 transition-colors min-h-[44px] flex items-center"
            >
              Comment commander
            </a>

            <a
              href="/#engagements"
              className="px-4 py-2 rounded-xl text-sm font-bold text-earth-700 hover:text-forest-950 hover:bg-cream-50 transition-colors min-h-[44px] flex items-center"
            >
              Engagements
            </a>

            <a
              href="/#contact"
              className="px-4 py-2 rounded-xl text-sm font-bold text-earth-700 hover:text-forest-950 hover:bg-cream-50 transition-colors min-h-[44px] flex items-center"
            >
              Contact & Dépôt
            </a>
          </nav>

          {/* Actions : Panier + WhatsApp + Espace Gestion */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bouton Panier Dynamique */}
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-cream-100/80 hover:bg-cream-200/90 text-forest-950 border border-cream-300 transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 shadow-warm-xs"
              aria-label={`Ouvrir le panier : ${totalItems} article(s), total ${formatFCFA(totalAmount)}`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-forest-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-forest-800 text-gold-300 text-[11px] font-black rounded-full flex items-center justify-center animate-scale-in shadow-warm-xs border border-forest-950">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-700">Panier</span>
                <span className="text-xs font-black text-forest-950 font-serif">
                  {totalAmount > 0 ? formatFCFA(totalAmount) : '0 FCFA'}
                </span>
              </div>
            </button>

            {/* Bouton WhatsApp Direct */}
            <a
              href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}?text=${encodeURIComponent(
                `Bonjour ${COMPANY_CONFIG.fullName}, je consulte votre catalogue et souhaite échanger avec votre service commercial.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all duration-150 min-h-[44px] shadow-warm-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Accès Espace Administration */}
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              className="p-2 sm:px-3 sm:py-2 text-earth-600 hover:text-forest-950 hover:bg-cream-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-cream-200"
              aria-label="Accès à l'espace de gestion et d'administration"
              title="Espace Gestion Administrateur"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-bold ml-1.5">
                {isAuthenticated ? 'Admin' : 'Connexion'}
              </span>
            </Link>

            {/* Bouton Menu Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-earth-700 hover:text-forest-950 hover:bg-cream-100 rounded-xl lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center border border-cream-200"
              aria-label="Ouvrir le menu de navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-warm-xl">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-earth-900 hover:bg-cream-50 min-h-[48px]"
            >
              <span>Accueil</span>
            </Link>

            <Link
              to="/catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-forest-900 bg-cream-100/80 min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>Tous les Rayons & Prix (FCFA)</span>
              </span>
            </Link>

            <a
              href="/#comment-commander"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-earth-900 hover:bg-cream-50 min-h-[48px]"
            >
              <span>Comment commander</span>
            </a>

            <a
              href="/#engagements"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-earth-900 hover:bg-cream-50 min-h-[48px]"
            >
              <span>Nos engagements</span>
            </a>

            <a
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-earth-900 hover:bg-cream-50 min-h-[48px]"
            >
              <span>Contact & Dépôt Makepe</span>
            </a>
          </nav>

          <div className="pt-3 border-t border-cream-100 space-y-2">
            <a
              href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}?text=${encodeURIComponent(
                `Bonjour ${COMPANY_CONFIG.fullName}, je consulte votre catalogue et souhaite passer une commande.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm min-h-[48px] shadow-warm-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contacter sur WhatsApp ({COMPANY_CONFIG.whatsapp})</span>
            </a>

            <a
              href={`tel:${COMPANY_CONFIG.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cream-100 text-earth-900 font-bold text-sm min-h-[48px]"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler le service client ({COMPANY_CONFIG.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
