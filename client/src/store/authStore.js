import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          localStorage.setItem('accessToken', data.accessToken);
          set({ user: data, accessToken: data.accessToken, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('accessToken', data.accessToken);
          set({ user: data, accessToken: data.accessToken, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      loginAsGuest: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/guest');
          localStorage.setItem('accessToken', data.accessToken);
          set({ user: data, accessToken: data.accessToken, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Guest login failed';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      loginWithGoogle: async (token) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/google', { token });
          localStorage.setItem('accessToken', data.accessToken);
          set({ user: data, accessToken: data.accessToken, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Google login failed';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (_) {}
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null });
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data });
        } catch (_) {
          set({ user: null });
          localStorage.removeItem('accessToken');
        }
      },

      updateUser: (updatedData) => set((state) => ({
        user: { ...state.user, ...updatedData }
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);

export default useAuthStore;
