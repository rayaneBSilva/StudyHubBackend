import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/layout";
import "./styles.css";
import { api } from "../../api/axios";

interface Folder {
  id: number;
  nome: string;
}

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");

  const navigate = useNavigate();

  async function loadFolders() {
    const response = await api.get("/folders");
    const list = Array.isArray(response.data?.data)
      ? response.data.data
      : response.data?.data?.data || [];

    setFolders(list);
  }

  useEffect(() => {
    loadFolders();
  }, []);

  async function handleCreateFolder() {
    if (!nome.trim()) return;

    try {
      const response = await api.post("/folders", { nome });
      const created = response.data?.data || response.data;

      setFolders((prev) => [...prev, created]);
      setModalOpen(false);
      setNome("");
    } catch {
      alert("Erro ao criar pasta");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja deletar esta pasta?")) return;

    try {
      await api.delete(`/folders/${id}`);
      setFolders((prev) => prev.filter((f) => f.id !== id));
    } catch {
      alert("Erro ao deletar pasta");
    }
  }

  return (
    <Layout title="Pastas">
      <div className="folders-header">
        <h1>Pastas</h1>
        <button className="btn-create" onClick={() => setModalOpen(true)}>
          Nova Pasta
        </button>
      </div>

      <div className="folders-grid">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="folder-card"
            onClick={() => navigate(`/folders/${folder.id}`)}
          >
            <h3>{folder.nome}</h3>
            <button
              className="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(folder.id);
              }}
            >
              Deletar
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-box">
            <h2>Criar Pasta</h2>

            <input
              placeholder="Nome da pasta"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={() => setModalOpen(false)}>Cancelar</button>
              <button onClick={handleCreateFolder}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}