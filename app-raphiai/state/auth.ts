import { apiLogin, apiRegister } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'raphiai.token.v1';

export type AuthState = {
  token: string;
};

export async function signIn(email: string, password: string): Promise<AuthState> {
  if (!email.trim() || !password.trim()) throw new Error('Email y contraseña requeridos');
  const { token } = await apiLogin(email.trim(), password);
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  return { token };
}

export async function signUp(email: string, password: string): Promise<AuthState> {
  if (!email.trim() || !password.trim()) throw new Error('Email y contraseña requeridos');
  const { token } = await apiRegister(email.trim(), password);
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  return { token };
}

export async function signOut(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getCurrentUser(): Promise<AuthState | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token ? { token } : null;
  } catch {
    return null;
  }
}

