
import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { loginRequest } from "../services/authService";

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

async function login(email: string, password: string) {

  const response = await loginRequest(email, password);

  const user = {
    id: response.data.id,
    name: response.data.name,
    email: response.data.email,
    role: response.data.role
  };

  const token = response.data.token;

  localStorage.setItem("@studyhub_token", token);
  localStorage.setItem("@studyhub_user", JSON.stringify(user));

  setUser(user);
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