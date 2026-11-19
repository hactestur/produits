import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { loginFormSchema } from '../../utils/validators';
import type { LoginFormData } from '../../utils/validators';
import { isSupabaseConfigured } from '../../config/supabase';
import { Button } from '../../components/common/Button';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Si déjà authentifié, rediriger directement vers le tableau de bord
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate('/admin');
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Échec de connexion. Veuillez vérifier vos identifiants.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'admin@saveursdor.ci');
    setValue('password', 'admin123');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue public</span>
        </Link>

        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-800 text-white flex items-center justify-center shadow-lg shadow-brand-900/20">
            <Shield className="w-7 h-7" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Espace Administration
        </h1>
        <p className="mt-2 text-center text-sm text-stone-600">
          Gestion du catalogue de {COMPANY_CONFIG.name}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-stone-200">
          {errorMessage && (
            <div
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erreur d'authentification</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-bold text-stone-800 mb-1.5">
                Adresse e-mail administrateur
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-stone-400 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@saveursdor.ci"
                  {...register('email')}
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-stone-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-bold text-stone-800 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-stone-400 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.password ? 'border-rose-500 bg-rose-50/20' : 'border-stone-300'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Bouton de connexion */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full shadow-md"
              >
                Se connecter à l'administration
              </Button>
            </div>
          </form>

          {/* Note sur l'accès et mode démo */}
          <div className="mt-6 pt-5 border-t border-stone-100 space-y-3">
            {!isSupabaseConfigured && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Mode démo local actif</span>
                </div>
                <p className="leading-relaxed">
                  Supabase n'étant pas encore lié via les variables d'environnement, vous pouvez tester l'administration avec le compte par défaut :
                </p>
                <div className="bg-white/80 p-2 rounded-lg font-mono text-[11px] text-stone-800 border border-amber-200">
                  Email : <strong>admin@saveursdor.ci</strong>
                  <br />
                  Mot de passe : <strong>admin123</strong>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs font-bold text-amber-900 underline hover:text-amber-950"
                >
                  Remplir automatiquement ces identifiants
                </button>
              </div>
            )}

            <p className="text-center text-xs text-stone-500 leading-relaxed">
              Cet espace est strictement réservé aux gestionnaires autorisés. Tout accès non autorisé est interdit et consigné.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
