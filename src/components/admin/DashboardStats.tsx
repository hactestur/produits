import React from 'react';
import type { ProductKPIs } from '../../types/product';
import { Package, Globe, CheckCircle2, AlertTriangle, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStatsProps {
  kpis: ProductKPIs;
  isLoading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ kpis, isLoading = false }) => {
  const cards = [
    {
      title: 'Total Enregistrés',
      subtitle: 'Tous les produits (masqués compris)',
      value: kpis.totalRegistered,
      icon: Package,
      color: 'bg-stone-800 text-white',
      filterUrl: '/admin/produits',
    },
    {
      title: 'Produits Publiés',
      subtitle: 'Visibles dans le catalogue public',
      value: kpis.publishedCount,
      icon: Globe,
      color: 'bg-brand-700 text-white',
      filterUrl: '/admin/produits?visibility=published',
    },
    {
      title: 'Disponibles en Stock',
      subtitle: 'Prêts à être servis',
      value: kpis.availableCount,
      icon: CheckCircle2,
      color: 'bg-emerald-600 text-white',
      filterUrl: '/admin/produits?availability=in_stock',
    },
    {
      title: 'En Rupture de Stock',
      subtitle: 'Nécessite réapprovisionnement',
      value: kpis.outOfStockCount,
      icon: AlertTriangle,
      color: 'bg-amber-600 text-white',
      filterUrl: '/admin/produits?availability=out_of_stock',
    },
    {
      title: 'Produits Masqués',
      subtitle: 'Conservés en base (non publics)',
      value: kpis.hiddenCount,
      icon: EyeOff,
      color: 'bg-stone-500 text-white',
      filterUrl: '/admin/produits?visibility=hidden',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            to={card.filterUrl}
            className="group bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all duration-150 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color} shrink-0`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {isLoading ? (
                  <span className="inline-block w-12 h-9 bg-stone-200 animate-pulse rounded-md" />
                ) : (
                  card.value
                )}
              </div>
              <p className="mt-1 text-xs text-stone-500 leading-snug">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-brand-700 group-hover:text-brand-800">
              <span>Voir les produits</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
