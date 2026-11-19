export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin';
  full_name?: string | null;
  created_at: string;
}

export interface AuthState {
  user: AdminProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}
