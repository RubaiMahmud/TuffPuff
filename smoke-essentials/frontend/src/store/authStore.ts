import { create } from 'zustand';
import api from '@/lib/api';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  ageVerified: boolean;
  termsAccepted: boolean;
}

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; password: string; ageVerified: boolean; termsAccepted: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  initAuthListener: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    // 1. Authenticate with Firebase
    await signInWithEmailAndPassword(auth, email, password);
    // 2. The onAuthStateChanged listener will automatically fetch the Postgres profile
  },

  signup: async (signupData) => {
    // 1. Create user in Firebase
    await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);

    // 2. Sync user profile with our PostgreSQL backend
    const { data } = await api.post('/auth/sync', {
      name: signupData.name,
      phone: signupData.phone,
      ageVerified: signupData.ageVerified,
      termsAccepted: signupData.termsAccepted
    });

    set({ user: data.data, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, firebaseUser: null, isAuthenticated: false, isLoading: false });
  },

  initAuthListener: () => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      set({ firebaseUser, isLoading: !!firebaseUser });

      if (firebaseUser) {
        try {
          // Fetch Postgres profile using Firebase token
          const { data } = await api.get('/auth/profile');
          set({ user: data.data, isAuthenticated: true, isLoading: false });
        } catch {
          // If profile fetch fails (e.g. they exist in Firebase but not Postgres yet from cross-environment migration),
          // attempt to seamlessly sync and create their profile.
          try {
            const { data } = await api.post('/auth/sync', {
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email
            });
            set({ user: data.data, isAuthenticated: true, isLoading: false });
          } catch (syncError) {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));

// Initialize auth listener automatically
if (typeof window !== 'undefined') {
  useAuthStore.getState().initAuthListener();
}

