"use client";

import * as React from "react";

export interface CurrentUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: CurrentUser | null;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const DEFAULT_USER: CurrentUser = {
  name: "Bahar Naaderi",
  email: "naaderidev@gmail.com",
  role: "Sales Manager",
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<CurrentUser | null>(DEFAULT_USER);
  const [isLoginOpen, setLoginOpen] = React.useState(false);

  const login = React.useCallback((email: string, name?: string) => {
    setUser({
      name: name?.trim() || email.split("@")[0] || "Sales Manager",
      email,
      role: "Sales Manager",
    });
    setLoginOpen(false);
  }, []);

  const logout = React.useCallback(() => setUser(null), []);
  const openLogin = React.useCallback(() => setLoginOpen(true), []);
  const closeLogin = React.useCallback(() => setLoginOpen(false), []);

  const value = React.useMemo(
    () => ({ user, isLoginOpen, openLogin, closeLogin, login, logout }),
    [user, isLoginOpen, openLogin, closeLogin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
