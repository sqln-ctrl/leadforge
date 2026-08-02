import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("leadforge_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("leadforge_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await authApi.login(email, password);
    localStorage.setItem("leadforge_token", data.access_token);
    const { data: me } = await authApi.me();
    setUser(me);
    return me;
  }

  async function register(payload) {
  const { data } = await authApi.register(payload);
  return data;
}

  function logout() {
    localStorage.removeItem("leadforge_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
