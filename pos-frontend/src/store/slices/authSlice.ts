// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/pos';
import { currentUser } from '@/data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  error?: unknown;
}

const initialState: AuthState = {
  user: currentUser,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      // state.isAuthenticated = true
      // Save to localStorage
      localStorage.setItem('chatapp_user', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      // Clear localStorage
      localStorage.setItem('Auth_Status', JSON.stringify({isAuthenticated: false}));

    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<unknown | null>) => {
      state.error = action.payload
    },
    setAuthStatus: (state, action: PayloadAction<{isAuthenticated : boolean}>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      localStorage.setItem('Auth_Status', JSON.stringify({isUserAuthenticated: action.payload.isAuthenticated}));
    },
  },
});

export const { logout, setLoading, setError, setAuthStatus, setUser } = authSlice.actions;
export default authSlice.reducer;