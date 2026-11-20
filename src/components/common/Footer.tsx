import React from 'react';
import { COMPANY_CONFIG } from '../../config/company';
import { Phone, Mail, MapPin, Clock, ShieldCheck, MessageSquare, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-cream-200 pt-16 pb-10 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-forest-900">
          {/* Colonne 1 : Entreprise Saveurs d'Or / AMIGO */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-900 border border-forest-700 text-gold-400 flex items-center justify-center shadow-warm-md">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-xl font-serif font-black text-white tracking-tight block">
                  {COMPANY_CONFIG.brandName}
                </span>
                <span className="text-xs text-gold-400 font-bold block">
                  par {COMPANY_CONFIG.legalName}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
              {COMPANY_CONFIG.description}
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-gold-300 bg-forest-900/90 border border-forest-700/80 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
              <span>Grossiste & Demi-gros certifié Douala</span>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Navigation & Rayons
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-cream-200 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="text-cream-200 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Rayons & Prix en FCFA</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
                </Link>
              </li>
              <li>
                <a href="/#comment-commander" className="text-cream-200 hover:text-white transition-colors">
                  <span>Comment commander</span>
                </a>
              </li>
              <li>
                <a href="/#engagements" className="text-cream-200 hover:text-white transition-colors">
                  <span>Nos engagements professionnels</span>
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-cream-200 hover:text-white transition-colors">
                  <span>Localisation Dépôt Makepe</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact direct Douala */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Dépôt & Contact Douala
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" aria-hidden="true" />
                <span className="text-cream-300">{COMPANY_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <a
                  href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors text-emerald-400 font-bold"
                >
                  WhatsApp : {COMPANY_CONFIG.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${COMPANY_CONFIG.phoneRaw}`}
                  className="hover:text-white transition-colors text-cream-300"
                >
                  {COMPANY_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${COMPANY_CONFIG.email}`}
                  className="hover:text-white transition-colors text-cream-300"
                >
                  {COMPANY_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-forest-400 shrink-0" aria-hidden="true" />
                <span className="text-xs text-cream-400">{COMPANY_CONFIG.openingHours}</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Mention Commerciale & Transparence */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Demandes Commerciales
            </h3>
            <div className="bg-forest-900/90 p-4 rounded-2xl border border-forest-800 text-xs text-cream-300 leading-relaxed space-y-3">
              <p>{COMPANY_CONFIG.catalogNotice}</p>
              <div className="pt-2 border-t border-forest-800 text-cream-400">
                <span className="block font-bold text-white mb-0.5">Sans paiement en ligne :</span>
                Toutes les commandes sont confirmées et réglées directement avec notre équipe commerciale lors du retrait ou de la livraison.
              </div>
            </div>
          </div>
        </div>

        {/* Pied inférieur */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>© {CURRENT_YEAR} {COMPANY_CONFIG.brandName} par {COMPANY_CONFIG.parentCompany} — Distribution Alimentaire. Douala, Cameroun.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-gold-300 transition-colors">
              Espace Gestion
            </Link>
            <span className="text-forest-800">|</span>
            <span className="text-gold-400 font-bold">Devise : FCFA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
