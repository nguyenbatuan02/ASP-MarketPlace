import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type OdooUser } from '../services/authService';
import { useCartStore } from './cartStore';

interface AuthState {
  user: OdooUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const user = await authService.login(email, password);
          set({ user, isLoggedIn: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isLoggedIn: false });
        // clear cart khi logout
        useCartStore.getState().clearCart();
      },

      restoreSession: async () => {
        const user = await authService.getSession();
        if (user) set({ user, isLoggedIn: true });
        else set({ user: null, isLoggedIn: false });
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, isLoggedIn: s.isLoggedIn }) }
  )
);