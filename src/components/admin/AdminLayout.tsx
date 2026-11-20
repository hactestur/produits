import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/admin/produits', label: 'Gestion des Produits', icon: Package, end: false },
    { to: '/admin/categories', label: 'Gestion des Catégories', icon: FolderTree, end: false },
  ];

  return (
    <div className="min-h-screen bg-surface-light flex flex-col">
      {/* En-tête Administration */}
      <header className="sticky top-0 z-40 bg-forest-950 text-white shadow-warm-md border-b border-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo / Marque Espace Gestion */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="flex items-center gap-2.5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg p-1"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-800 border border-forest-700 text-gold-400 flex items-center justify-center shadow-warm-xs">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-lg font-serif font-black block leading-tight">
                    Espace Gestion
                  </span>
                  <span className="text-xs text-cream-300 block">
                    {COMPANY_CONFIG.brandName} par {COMPANY_CONFIG.parentCompany}
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Menu d'administration">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-forest-800 text-white shadow-warm-xs border border-forest-700'
                          : 'text-cream-300 hover:text-white hover:bg-forest-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-gold-400" aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Actions Desktop : Visiter le site & Déconnexion */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/catalogue"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-cream-200 hover:text-white bg-forest-900 hover:bg-forest-800 rounded-xl transition-colors min-h-[40px] border border-forest-800"
                aria-label="Voir le catalogue public dans un nouvel onglet"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                <span>Voir le catalogue public</span>
                <ExternalLink className="w-3 h-3 text-cream-400" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-950/80 rounded-xl transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                aria-label="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>

            {/* Bouton Menu Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/"
                className="p-2 text-cream-300 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Voir le site public"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-cream-300 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                aria-label="Ouvrir le menu de navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu déroulant Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-forest-900 bg-forest-950 px-4 pt-3 pb-5 space-y-2">
            <div className="pb-2 border-b border-forest-900 text-xs text-cream-400 px-2">
              Connecté en tant que :{' '}
              <span className="font-semibold text-white">{user?.email || 'Administrateur'}</span>
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                      isActive
                        ? 'bg-forest-800 text-white'
                        : 'text-cream-300 hover:text-white hover:bg-forest-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 text-gold-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-forest-900 space-y-2">
              <Link
                to="/catalogue"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3 rounded-xl text-base text-cream-200 hover:bg-forest-900 min-h-[48px]"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-400" />
                  <span>Consulter le catalogue public</span>
                </span>
                <ExternalLink className="w-4 h-4 text-cream-400" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-base font-semibold text-rose-400 hover:bg-rose-950/60 min-h-[48px]"
              >
                <LogOut className="w-5 h-5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Contenu de la page */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};
