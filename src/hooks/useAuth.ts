import { create } from 'zustand';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { store } from '../services/storeService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, pass: string) => Promise<User>;
  register: (data: Parameters<typeof authService.registerUser>[0]) => Promise<User>;
  logout: () => Promise<void>;
  switchUserRole: (role: UserRole) => void;
  updateCurrentUser: (data: Partial<User>) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Check saved user session
const savedUid = localStorage.getItem('pol_auth_uid') || 'user_student_1';
const initialUser = store.findUserById(savedUid) || store.getUsers().find((u) => u.role === 'student') || null;

export const useAuth = create<AuthState>((set, get) => ({
  user: initialUser,
  loading: false,
  error: null,

  async login(identifier: string, pass: string) {
    set({ loading: true, error: null });
    try {
      const user = await authService.loginUser(identifier, pass);
      localStorage.setItem('pol_auth_uid', user.uid);
      set({ user, loading: false });
      return user;
    } catch (err: any) {
      set({ error: err.message || 'خطا در ورود', loading: false });
      throw err;
    }
  },

  async register(data) {
    set({ loading: true, error: null });
    try {
      const user = await authService.registerUser(data);
      localStorage.setItem('pol_auth_uid', user.uid);
      set({ user, loading: false });
      return user;
    } catch (err: any) {
      set({ error: err.message || 'خطا در ثبت نام', loading: false });
      throw err;
    }
  },

  async logout() {
    await authService.logoutUser();
    localStorage.removeItem('pol_auth_uid');
    set({ user: null });
  },

  switchUserRole(role: UserRole) {
    const targetUser = store.getUsers().find((u) => u.role === role);
    if (targetUser) {
      localStorage.setItem('pol_auth_uid', targetUser.uid);
      set({ user: targetUser });
    }
  },

  updateCurrentUser(data: Partial<User>) {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data };
    store.saveUser(updated);
    set({ user: updated });
  },

  async updateProfile(data: Partial<User>) {
    get().updateCurrentUser(data);
  },
}));
