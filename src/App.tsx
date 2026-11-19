import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CataloguePage } from './pages/public/CataloguePage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

/**
 * Garde de sécurité pour les routes d'administration
 */
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <LoadingSpinner label="Vérification des droits d'accès..." />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Page 404
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Page introuvable</h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-medium text-base transition-colors min-h-[48px] w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retourner au catalogue de produits</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<CataloguePage />} />
          <Route path="/catalogue" element={<Navigate to="/" replace />} />

          {/* Espace Administration */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <DashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/produits"
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminRoute>
                <AdminCategoriesPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
