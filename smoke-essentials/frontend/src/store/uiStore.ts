import { create } from 'zustand';

interface UIState {
  showAgeModal: boolean;
  showMobileMenu: boolean;
  setShowAgeModal: (show: boolean) => void;
  setShowMobileMenu: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showAgeModal: false,
  showMobileMenu: false,
  setShowAgeModal: (show) => set({ showAgeModal: show }),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
}));
