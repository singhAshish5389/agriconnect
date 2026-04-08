import { create } from "zustand";
import type { Toast, ToastType, UserProfile } from "../types";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface SidebarState {
  isOpen: boolean;
}

interface NotificationsState {
  toasts: Toast[];
}

interface AppStore {
  auth: AuthState;
  sidebar: SidebarState;
  notifications: NotificationsState;

  // Auth actions
  setUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setAuthLoading: (value: boolean) => void;

  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Toast actions
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  },
  sidebar: {
    isOpen: true,
  },
  notifications: {
    toasts: [],
  },

  setUser: (user) =>
    set((state) => ({
      auth: { ...state.auth, user, isAuthenticated: !!user },
    })),
  setIsAuthenticated: (value) =>
    set((state) => ({ auth: { ...state.auth, isAuthenticated: value } })),
  setAuthLoading: (value) =>
    set((state) => ({ auth: { ...state.auth, isLoading: value } })),

  toggleSidebar: () =>
    set((state) => ({
      sidebar: { isOpen: !state.sidebar.isOpen },
    })),
  setSidebarOpen: (open) => set({ sidebar: { isOpen: open } }),

  addToast: (message, type) =>
    set((state) => ({
      notifications: {
        toasts: [
          ...state.notifications.toasts,
          { id: crypto.randomUUID(), message, type },
        ],
      },
    })),
  removeToast: (id) =>
    set((state) => ({
      notifications: {
        toasts: state.notifications.toasts.filter((t) => t.id !== id),
      },
    })),
}));
