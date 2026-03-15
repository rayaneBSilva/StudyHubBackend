import { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import { getUsers, deleteUser } from "../../services/userService";
import { FiTrash2 } from "react-icons/fi";
import "./users.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: "teacher" | "student";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getUsers(page, limit);

        const list = response.data || [];

        setUsers(list);
        setTotal(response.total || list.length);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, [page]);

  async function handleDelete(id: number) {
    if (!confirm("Excluir usuário?")) return;

    await deleteUser(id);

    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout title="Gerenciar Usuários">
      <div className="users-container">
        <h1>Alunos cadastrados</h1>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.role === "teacher" ? "Professor" : "Aluno"}</td>

                  <td className="actions">
                    <button
                      className="delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ←
          </button>

          <span>
            {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      </div>
    </Layout>
  );
}
