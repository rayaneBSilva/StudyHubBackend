import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./styles.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // BYPASS TOTAL - sempre faz login com sucesso
    const mockUser = {
      id: 1,
      name: "Usuário Teste",
      email: email || "test@test.com",
      role: "student" as const
    };
    
    localStorage.setItem("@studyhub_token", "mock-token-12345");
    localStorage.setItem("@studyhub_user", JSON.stringify(mockUser));
    
    navigate("/dashboard");
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1>StudyHub</h1>
          <p>Bem-vindo de volta! Por favor, insira seus dados.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Entrar</button>
        </form>

        <div className="login-footer">
          <span>Não tem uma conta?</span>
          <Link to="/register" className="link-register"> Criar conta</Link>
        </div>
      </div>
    </div>
  );
}