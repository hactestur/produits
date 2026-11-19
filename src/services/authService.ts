import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { AdminProfile } from '../types/auth';

const LOCAL_ADMIN_KEY = 'saveursdor_admin_session';

export const authService = {
  /**
   * Connexion avec email et mot de passe
   */
  async signIn(email: string, password: string): Promise<AdminProfile> {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw new Error(
          error.message === 'Invalid login credentials'
            ? 'Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe.'
            : error.message
        );
      }

      if (!data.user) {
        throw new Error('Utilisateur non trouvé.');
      }

      // Vérifier le rôle administrateur dans la table admin_profiles
      const { data: profileData, error: profileErr } = await (supabase.from('admin_profiles') as any)
        .select('*')
        .eq('id', data.user.id)
        .single();

      const profile = profileData as AdminProfile | null;

      if (profileErr || !profile || profile.role !== 'admin') {
        if (profileErr) {
          console.error('Supabase error querying admin_profiles:', profileErr);
        }
        await supabase.auth.signOut();
        throw new Error(
          "Accès refusé : Ce compte ne dispose pas des privilèges d'administrateur."
        );
      }

      return profile;
    }

    // Mode Local / Démo : permet de tester l'administration sans configuration Supabase immédiate
    // Identifiants par défaut documentés pour les tests : admin@saveursdor.ci / admin123
    if (cleanEmail === 'admin@saveursdor.ci' && password === 'admin123') {
      const demoAdmin: AdminProfile = {
        id: 'admin-demo-uuid',
        email: 'admin@saveursdor.ci',
        role: 'admin',
        full_name: 'Gestionnaire Démo',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(demoAdmin));
      return demoAdmin;
    }

    throw new Error(
      'Identifiants incorrects. En mode démo local, utilisez "admin@saveursdor.ci" et le mot de passe "admin123".'
    );
  },

  /**
   * Déconnexion
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
  },

  /**
   * Récupère le profil administrateur de la session courante
   */
  async getCurrentProfile(): Promise<AdminProfile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        return null;
      }

      const { data: profileData, error: profileErr } = await (supabase.from('admin_profiles') as any)
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (profileErr) {
        console.warn('Supabase getCurrentProfile error:', profileErr.message);
      }

      const profile = profileData as AdminProfile | null;

      if (profile && profile.role === 'admin') {
        return profile;
      }
      return null;
    }

    // Mode Local
    try {
      const stored = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      return null;
    }
    return null;
  },
};
