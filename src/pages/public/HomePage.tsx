import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { ProductCard } from '../../components/public/ProductCard';
import { ProductDetailModal } from '../../components/public/ProductDetailModal';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { OrderRequestModal } from '../../components/cart/OrderRequestModal';
import { ToastNotification } from '../../components/common/ToastNotification';
import { COMPANY_CONFIG } from '../../config/company';
import { productsService } from '../../services/productsService';
import { categoriesService } from '../../services/categoriesService';
import type { Product } from '../../types/product';
import type { Category } from '../../types/category';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  PackageCheck,
  Coins,
  Truck,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  FolderTree,
  ShoppingBag,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          categoriesService.getCategories(false),
          productsService.getPublicProducts(),
        ]);
        setCategories(cats);
        setFeaturedProducts(prods.slice(0, 6)); // Top 6 produits phares

        // Calcul des comptages par catégorie
        const counts: Record<string, number> = {};
        prods.forEach((p) => {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (e) {
        console.error('Erreur chargement données accueil:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-light">
      <Header />

      <main className="flex-1 space-y-16 sm:space-y-24 pb-16">
        {/* =========================================================================
            SECTION 1 : HERO ÉPICERIE FINE & DISTRIBUTION COMMERCIALE
        ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 text-white pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-forest-900">
          {/* Motifs décoratifs de fond discrets */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#deb851_1px,transparent_1px)] [background-size:28px_28px]" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl space-y-6 text-center sm:text-left">
              {/* Badge entreprise officielle */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/90 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-bold backdrop-blur-xs shadow-warm-xs">
                <Sparkles className="w-4 h-4 text-gold-400" aria-hidden="true" />
                <span>{COMPANY_CONFIG.brandName} par {COMPANY_CONFIG.parentCompany} • Douala, Cameroun</span>
              </div>

              {/* Titre principal percutant avec typographie Playfair */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight sm:leading-none text-white">
                L'Épicerie Fine & Vos Denrées au Meilleur Prix Grossiste
              </h1>

              {/* Description proposition de valeur */}
              <p className="text-base sm:text-xl text-cream-200 leading-relaxed max-w-2xl">
                Approvisionnement direct pour les commerces, demi-grossistes, restaurateurs et familles en riz parfumé, huiles de qualité, farines panifiables, conserves et sucres au Marché Makepe Missoke.
              </p>

              {/* Double Bouton d'action CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 justify-center sm:justify-start">
                <Link
                  to="/catalogue"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-forest-950 font-black text-base transition-all duration-150 shadow-warm-lg shadow-forest-950/40 min-h-[52px]"
                >
                  <ShoppingBag className="w-5 h-5 text-forest-950" />
                  <span>Consulter les Rayons & Prix (FCFA)</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}?text=${encodeURIComponent(
                    `Bonjour ${COMPANY_CONFIG.fullName}, je souhaite connaître vos disponibilités actuelles en denrées alimentaires.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-base transition-all duration-150 min-h-[52px] border border-forest-600 shadow-warm-xs"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>Échanger sur WhatsApp</span>
                </a>
              </div>

              {/* Badges de Réassurance */}
              <div className="pt-6 border-t border-forest-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-cream-300">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Dépôt Marché Makepe Missoke</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Tarifs directs grossiste en FCFA</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Sans paiement en ligne obligatoire</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2 : RAYONS & CATÉGORIES DE PRODUITS
        ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-forest-800 font-extrabold text-xs uppercase tracking-wider mb-1">
                <FolderTree className="w-4 h-4 text-gold-600" />
                <span>Nos Familles de Produits</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
                Découvrez nos rayons alimentaires
              </h2>
            </div>

            <Link
              to="/catalogue"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-800 hover:text-forest-950 transition-colors"
            >
              <span>Voir l'ensemble du catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/catalogue?category=${cat.id}`)}
                  className="group p-5 sm:p-6 bg-white rounded-2xl border border-cream-200 hover:border-gold-500/70 shadow-warm-xs hover:shadow-warm-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-cream-100 text-forest-800 flex items-center justify-center font-bold border border-cream-200 group-hover:bg-forest-800 group-hover:text-gold-400 transition-colors">
                        <FolderTree className="w-5 h-5" />
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-cream-100 text-earth-700 font-black">
                        {count} article{count > 1 ? 's' : ''}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-black text-forest-950 group-hover:text-forest-700 transition-colors">
                      {cat.name}
                    </h3>

                    {cat.description && (
                      <p className="text-xs sm:text-sm text-earth-600 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-cream-100 flex items-center justify-between text-xs font-bold text-forest-800 group-hover:text-forest-950">
                    <span>Parcourir ce rayon</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gold-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3 : PRODUITS PHARES & ARRIVAGES RÉCENTS
        ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-forest-800 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>Arrivages Réguliers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
                Sélection de produits phares
              </h2>
              <p className="text-sm text-earth-600 mt-1">
                Tarifs officiels en gros et demi-gros exprimés en Francs CFA
              </p>
            </div>

            <Link
              to="/catalogue"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-800 hover:text-forest-950"
            >
              <span>Accéder à tous les produits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-cream-200/60 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {featuredProducts.map((product) => (
                <div key={product.id} className="h-full flex">
                  <ProductCard
                    product={product}
                    onSelect={handleOpenDetail}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 4 : COMMENT COMMANDER (PARCOURS EN 4 ÉTAPES)
        ========================================================================= */}
        <section
          id="comment-commander"
          className="bg-forest-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20 border-y border-forest-900"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
                Processus Simple & Transparent
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
                Comment passer votre commande en 4 étapes
              </h2>
              <p className="text-sm sm:text-base text-cream-300 leading-relaxed">
                Sans carte bancaire ni formalités complexes. Vous constituez votre sélection et finalisez directement avec nos commerciaux sur WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Étape 1 */}
              <div className="bg-forest-900/80 p-6 rounded-2xl border border-forest-800 space-y-3 relative shadow-warm-xs">
                <span className="w-10 h-10 rounded-xl bg-forest-800 border border-gold-500/50 text-gold-400 font-black text-lg flex items-center justify-center">
                  1
                </span>
                <h3 className="text-lg font-serif font-bold text-white">Sélectionnez vos denrées</h3>
                <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                  Consultez notre catalogue alimentaire en ligne avec nos tarifs officiels en FCFA et disponibilités.
                </p>
              </div>

              {/* Étape 2 */}
              <div className="bg-forest-900/80 p-6 rounded-2xl border border-forest-800 space-y-3 relative shadow-warm-xs">
                <span className="w-10 h-10 rounded-xl bg-forest-800 border border-gold-500/50 text-gold-400 font-black text-lg flex items-center justify-center">
                  2
                </span>
                <h3 className="text-lg font-serif font-bold text-white">Constituez votre panier</h3>
                <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                  Ajustez les quantités souhaitées (sacs, cartons, bidons) et visualisez le total indicatif estimé.
                </p>
              </div>

              {/* Étape 3 */}
              <div className="bg-forest-900/80 p-6 rounded-2xl border border-forest-800 space-y-3 relative shadow-warm-xs">
                <span className="w-10 h-10 rounded-xl bg-forest-800 border border-gold-500/50 text-gold-400 font-black text-lg flex items-center justify-center">
                  3
                </span>
                <h3 className="text-lg font-serif font-bold text-white">Renseignez vos coordonnées</h3>
                <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                  Indiquez votre nom, téléphone et quartier de livraison à Douala. Aucun paiement n'est exigé en ligne.
                </p>
              </div>

              {/* Étape 4 */}
              <div className="bg-forest-900/80 p-6 rounded-2xl border border-forest-800 space-y-3 relative shadow-warm-xs">
                <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-warm-xs">
                  4
                </span>
                <h3 className="text-lg font-serif font-bold text-white">Transmission WhatsApp</h3>
                <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                  Votre récapitulatif se charge instantanément sur WhatsApp. Notre commercial vous confirme le stock sous 2h.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5 : POURQUOI CHOISIR SAVEURS D'OR / AMIGO ?
        ========================================================================= */}
        <section id="engagements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">
              Nos Engagements Partenaires
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
              L'assurance d'un grossiste de confiance à Douala
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-warm-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cream-100 text-forest-800 flex items-center justify-center border border-cream-200">
                <PackageCheck className="w-6 h-6 text-forest-700" />
              </div>
              <h3 className="text-base font-serif font-bold text-forest-950">Arrivages & Stock Garanti</h3>
              <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                Approvisionnement régulier en riz parfumé, tomates en boîte, huiles de table et farines panifiables certifiées.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-warm-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cream-100 text-forest-800 flex items-center justify-center border border-cream-200">
                <Coins className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-base font-serif font-bold text-forest-950">Tarifs Grossiste en FCFA</h3>
              <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                Tarification transparente et dégressive adaptée aux revendeurs, traiteurs et achats groupés.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-warm-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cream-100 text-forest-800 flex items-center justify-center border border-cream-200">
                <Truck className="w-6 h-6 text-forest-700" />
              </div>
              <h3 className="text-base font-serif font-bold text-forest-950">Retrait ou Livraison Douala</h3>
              <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                Enlèvement direct au Marché Makepe Missoke ou livraison organisée selon vos volumes dans tout Douala.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-warm-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cream-100 text-forest-800 flex items-center justify-center border border-cream-200">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-serif font-bold text-forest-950">Conseil & Réactivité WhatsApp</h3>
              <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
                Contact direct avec notre équipe commerciale pour toute cotation spéciale ou commande prioritaire.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6 : LOCALISATION & CONTACT COMMERCIAL
        ========================================================================= */}
        <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-forest-800 shadow-warm-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
                    Contactez-nous directement
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                    Venez nous rendre visite au Dépôt Makepe Missoke
                  </h2>
                  <p className="text-cream-300 text-sm leading-relaxed">
                    Notre entrepôt et notre équipe de vente vous accueillent du lundi au samedi pour l'enlèvement de vos marchandises et le conseil sur les arrivages en stock.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-cream-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <span>{COMPANY_CONFIG.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                    <span>{COMPANY_CONFIG.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                    <a href={`tel:${COMPANY_CONFIG.phoneRaw}`} className="hover:text-white underline">
                      {COMPANY_CONFIG.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                    <a
                      href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-bold hover:underline"
                    >
                      WhatsApp Commercial : {COMPANY_CONFIG.whatsapp}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-forest-900/90 p-6 sm:p-8 rounded-2xl border border-forest-800 space-y-5 text-center shadow-warm-md">
                <h3 className="text-lg font-serif font-bold text-white">Besoin d'un devis pour des volumes importants ?</h3>
                <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                  Vous gérez un restaurant, un hôtel, une cantine ou une épicerie de quartier ? Discutez en direct de vos volumes mensuels avec nos commerciaux.
                </p>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}?text=${encodeURIComponent(
                      `Bonjour ${COMPANY_CONFIG.fullName}, je souhaite un devis pour une commande de gros volumes.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm min-h-[48px] shadow-warm-xs transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Échanger sur WhatsApp</span>
                  </a>

                  <Link
                    to="/catalogue"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm min-h-[44px] transition-colors"
                  >
                    <span>Voir le catalogue complet</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Tiroir Panier & Modale de Commande */}
      <CartDrawer />
      <OrderRequestModal />
      <ToastNotification />

      {/* Fiche Détaillée d'un Produit */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        allProducts={featuredProducts}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
};
