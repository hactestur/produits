import React from 'react';
import { COMPANY_CONFIG } from '../../config/company';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-10 border-b border-stone-800">
          {/* Colonne 1 : Entreprise */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              {COMPANY_CONFIG.name}
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              {COMPANY_CONFIG.description}
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-brand-400 bg-brand-950/60 border border-brand-800/60 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Qualité & Traçabilité Garantie</span>
            </div>
          </div>

          {/* Colonne 2 : Coordonnées & Horaires */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">
              Contact & Disponibilité
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{COMPANY_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-500 shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${COMPANY_CONFIG.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-500 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${COMPANY_CONFIG.email}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-500 shrink-0" aria-hidden="true" />
                <span>{COMPANY_CONFIG.openingHours}</span>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Information catalogue */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">
              Note Importante
            </h3>
            <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 text-sm text-stone-300 leading-relaxed">
              <p>{COMPANY_CONFIG.catalogNotice}</p>
              <div className="mt-4 pt-3 border-t border-stone-700/60 flex items-center justify-between">
                <span className="text-xs text-stone-400">Devise officielle :</span>
                <span className="font-semibold text-brand-400">Franc CFA (FCFA)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pied inférieur */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-stone-300 transition-colors">
              Administration
            </Link>
            <span className="inline-flex items-center gap-1">
              Fait avec soin pour le commerce alimentaire <Heart className="w-3.5 h-3.5 text-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
