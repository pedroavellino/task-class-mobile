import React, { createContext, useContext, useMemo, useState } from "react";
import { http } from "../api/http";
import axios from "axios"

export type UserRole = "admin" | "student";

type AuthState = {
  token: string | null;
  role: UserRole | null;
};

type SignInInput = { email: string; password: string };

type AuthContextValue = {
  token: string | null;
  role: UserRole | null;
  isSignedIn: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, role: null });

async function signIn(input: SignInInput) {
  try {
    const { data } = await axios.post<{ access_token: string; role: UserRole }>(
      "https://task-class-api-latest.onrender.com/auth/login",
      input
    );

    setState({ token: data.access_token, role: data.role });
  } catch (err) {
    throw new Error("Credenciais inválidas");
  }
}


  function signOut() {
    setState({ token: null, role: null });
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token: state.token,
      role: state.role,
      isSignedIn: Boolean(state.token),
      signIn,
      signOut,
    }),
    [state.token, state.role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
