import { useState } from "react";
import type { FormEvent } from "react";
import { registerRequest } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "../Login/styles.css"; // Certifique-se de que o caminho está correto

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await registerRequest(name, email, password, role);
      alert("Usuário criado com sucesso!");
      navigate("/"); // Redireciona para o login
    } catch {
      alert("Erro ao criar usuário. Tente novamente.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1>Criar Conta</h1>
          <p>Junte-se ao StudyHub e comece sua jornada.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="role">Eu sou:</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Aluno</option>
              <option value="teacher">Professor</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">Cadastrar</button>
        </form>

        <div className="login-footer">
          <span>Já tem uma conta?</span>
          <Link to="/" className="link-register"> Fazer Login</Link>
        </div>
      </div>
    </div>
  );
}