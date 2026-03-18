import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "teacher" | "student";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("@studyhub_user");
      if (!storedUser) return null;
      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.error("Erro ao ler usuário do localStorage", error);
      localStorage.removeItem("@studyhub_user");
      return null;
    }
  });

  // LOGIN SEMPRE FUNCIONA - SEM VALIDAÇÃO
  async function login(email: string, password: string) {
    const mockUser = {
      id: 1,
      name: "Usuário Teste",
      email: email || "test@test.com",
      role: "student" as const
    };

    localStorage.setItem("@studyhub_token", "mock-token-12345");
    localStorage.setItem("@studyhub_user", JSON.stringify(mockUser));
    setUser(mockUser);
  }

  function logout() {
    localStorage.removeItem("@studyhub_token");
    localStorage.removeItem("@studyhub_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};