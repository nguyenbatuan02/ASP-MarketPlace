import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface UiState {
  isPageLoading: boolean;
  toasts: Toast[];
  setPageLoading: (v: boolean) => void;
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
}

let toastId = 0;

export const useUiStore = create<UiState>((set, get) => ({
  isPageLoading: false,
  toasts: [],

  setPageLoading: (v) => set({ isPageLoading: v }),

  showToast: (message, type = 'info') => {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => get().removeToast(id), 3000);
  },

  removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}));