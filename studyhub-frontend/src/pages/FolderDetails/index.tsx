import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/layout";
import "./styles.css";
import { api } from "../../api/axios";

interface Summary {
  id: number;
  titulo: string;
  disciplina: string;
  conteudo: string;
}

export default function FolderDetails() {
  useParams();

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  async function loadSummaries() {
    const response = await api.get("/summaries");
    setSummaries(response.data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSummaries();
  }, []);

  async function handleCreateSummary() {
    if (!pdf) return;

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("disciplina", disciplina);
    formData.append("pdf", pdf);

    try {
      const response = await api.post("/summaries", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSummaries((prev) => [...prev, response.data.data]);
      setModalOpen(false);

      setTitulo("");
      setDisciplina("");
      setPdf(null);
    } catch {
      alert("Erro ao enviar PDF");
    }
  }

  return (
    <Layout title="Pasta">
      <h1>Resumos da Pasta</h1>

      <button onClick={() => setModalOpen(true)}>
        Adicionar Resumo
      </button>

      <div className="summaries-grid">
        {summaries.map((summary) => (
          <div key={summary.id} className="summary-card">
            <h3>{summary.titulo}</h3>
            <p>{summary.disciplina}</p>

            <a
              href={`http://localhost:3000/uploads/${summary.conteudo}`}
              target="_blank"
            >
              Ver PDF
            </a>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Novo Resumo</h2>

            <input
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <input
              placeholder="Disciplina"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setPdf(e.target.files ? e.target.files[0] : null)
              }
            />

            <button onClick={handleCreateSummary}>
              Enviar PDF
            </button>

            <button onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}