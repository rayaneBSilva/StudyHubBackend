import { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import "./styles.css";
import { getSummaries, uploadSummary } from "../../services/summaryService";

interface Summary {
  id: number;
  titulo: string;
  disciplina: string;
  conteudo: string;
}

export default function Summaries() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  useEffect(() => {
    async function loadSummaries() {
      try {
        const response = await getSummaries();

        const list = Array.isArray(response.data?.data)
          ? response.data.data
          : response.data?.data?.data || [];

        setSummaries(list);
      } catch {
        // erro simples de carregamento
      }
    }

    loadSummaries();
  }, []);

  async function handleCreateSummary() {
    if (!pdf || !titulo.trim() || !disciplina.trim()) return;

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("disciplina", disciplina);
    formData.append("pdf", pdf);

    try {
      const response = await uploadSummary(formData);
      const created = response.data?.data || response.data;

      setSummaries((prev) => [...prev, created]);
      setModalOpen(false);
      setTitulo("");
      setDisciplina("");
      setPdf(null);
    } catch {
      alert("Erro ao enviar resumo");
    }
  }

  return (
    <Layout title="Resumos">
      <div className="summaries-header">
        <h1>Resumos</h1>
        <button className="btn-create" onClick={() => setModalOpen(true)}>
          Novo Resumo
        </button>
      </div>

      <div className="summaries-grid">
        {summaries.map((summary) => (
          <div key={summary.id} className="summary-card">
            <h3>{summary.titulo}</h3>
            <p>{summary.disciplina}</p>
            <a
              href={`http://localhost:3000/uploads/${summary.conteudo}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver PDF
            </a>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-box large">
            <h2>Novo Resumo</h2>

            <div className="summary-upload">
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
            </div>

            <div className="modal-actions">
              <button onClick={() => setModalOpen(false)}>Cancelar</button>
              <button onClick={handleCreateSummary}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

