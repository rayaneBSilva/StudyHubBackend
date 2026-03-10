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
    setFolders(response.data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFolders();
  }, []);

  async function handleCreateFolder() {
    if (!nome.trim()) return;

    try {
      const response = await api.post("/folders", { nome });

      setFolders((prev) => [...prev, response.data]);
      setModalOpen(false);
      setNome("");
    } catch {
      alert("Erro ao criar pasta");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja deletar esta pasta?")) return;

    await api.delete(`/folders/${id}`);
    setFolders((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <Layout title="Pastas">
      <h1>Pastas</h1>

      <button onClick={() => setModalOpen(true)}>Nova Pasta</button>

      <div className="folders-grid">
        {folders.map((folder) => (
          <div key={folder.id} className="folder-card">
            <h3 onClick={() => navigate(`/folders/${folder.id}`)}>
              {folder.nome}
            </h3>

            <button onClick={() => handleDelete(folder.id)}>
              Deletar
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Criar Pasta</h2>

            <input
              placeholder="Nome da pasta"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <button onClick={handleCreateFolder}>Criar</button>
            <button onClick={() => setModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </Layout>
  );
}