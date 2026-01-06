import React, { createContext, useContext, useMemo, useState } from "react";

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
    // ✅ Por enquanto, o app assume que o backend tem /auth/login retornando { access_token, role }
    // Depois, se seu backend ainda não tiver isso, a gente implementa nele.
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Credenciais inválidas");
    }

    const data: { access_token: string; role: UserRole } = await res.json();
    setState({ token: data.access_token, role: data.role });
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
