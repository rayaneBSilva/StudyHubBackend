// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Layout from "../../components/layout/layout";
// import "./styles.css";
// import { api } from "../../api/axios";

// interface Summary {
//   id: number;
//   titulo: string;
//   disciplina: string;
//   conteudo: string;
// }

// export default function FolderDetails() {
//   useParams();

//   const [summaries, setSummaries] = useState<Summary[]>([]);
//   const [modalOpen, setModalOpen] = useState(false);

//   const [titulo, setTitulo] = useState("");
//   const [disciplina, setDisciplina] = useState("");
//   const [pdf, setPdf] = useState<File | null>(null);

//   async function loadSummaries() {
//     const response = await api.get("/summaries");
//     setSummaries(response.data);
//   }

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadSummaries();
//   }, []);

//   async function handleCreateSummary() {
//     if (!pdf) return;

//     const formData = new FormData();

//     formData.append("titulo", titulo);
//     formData.append("disciplina", disciplina);
//     formData.append("pdf", pdf);

//     try {
//       const response = await api.post("/summaries", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setSummaries((prev) => [...prev, response.data.data]);
//       setModalOpen(false);

//       setTitulo("");
//       setDisciplina("");
//       setPdf(null);
//     } catch {
//       alert("Erro ao enviar PDF");
//     }
//   }

//   return (
//     <Layout title="Pasta">
//       <h1>Resumos da Pasta</h1>

//       <button onClick={() => setModalOpen(true)}>
//         Adicionar Resumo
//       </button>

//       <div className="summaries-grid">
//         {summaries.map((summary) => (
//           <div key={summary.id} className="summary-card">
//             <h3>{summary.titulo}</h3>
//             <p>{summary.disciplina}</p>

//             <a
//               href={`http://localhost:3000/uploads/${summary.conteudo}`}
//               target="_blank"
//             >
//               Ver PDF
//             </a>
//           </div>
//         ))}
//       </div>

//       {modalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Novo Resumo</h2>

//             <input
//               placeholder="Título"
//               value={titulo}
//               onChange={(e) => setTitulo(e.target.value)}
//             />

//             <input
//               placeholder="Disciplina"
//               value={disciplina}
//               onChange={(e) => setDisciplina(e.target.value)}
//             />

//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={(e) =>
//                 setPdf(e.target.files ? e.target.files[0] : null)
//               }
//             />

//             <button onClick={handleCreateSummary}>
//               Enviar PDF
//             </button>

//             <button onClick={() => setModalOpen(false)}>
//               Cancelar
//             </button>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/layout";
import "../Folders/styles.css";
import { api } from "../../api/axios";

interface Summary {
  id: number;
  titulo: string;
  disciplina: string;
  conteudo: string;
}

interface Folder {
  id: number;
  nome: string;
}

export default function FolderDetails() {
  const { id } = useParams<{ id: string }>();

  const [folder, setFolder] = useState<Folder | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const folderRes = await api.get(`/folders/${id}`);
        const folderData: Folder =
          folderRes.data?.data || folderRes.data || ({ } as Folder);

        setFolder(folderData);
        setDisciplina(folderData.nome || "");

        const summariesRes = await api.get("/summaries", {
          params: { disciplina: folderData.nome },
        });

        const list = Array.isArray(summariesRes.data?.data)
          ? summariesRes.data.data
          : summariesRes.data?.data?.data || [];

        setSummaries(list);
      } catch {
        // fallback simples em caso de erro
      }
    }

    loadData();
  }, [id]);

  async function handleCreateSummary() {
    if (!pdf) return;

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("disciplina", disciplina || folder?.nome || "");
    formData.append("pdf", pdf);

    try {
      const response = await api.post("/summaries", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const created = response.data?.data || response.data;

      setSummaries((prev) => [...prev, created]);
      setModalOpen(false);

      setTitulo("");
      setDisciplina(folder?.nome || "");
      setPdf(null);
    } catch {
      alert("Erro ao enviar PDF");
    }
  }

  return (
    <Layout title={folder ? folder.nome : "Pasta"}>
      <div className="folders-header">
        <h1>Resumos da Pasta {folder?.nome}</h1>
        <button className="btn-create" onClick={() => setModalOpen(true)}>
          Adicionar Resumo
        </button>
      </div>

      <div className="summary-list">
        {summaries.map((summary) => (
          <div key={summary.id} className="summary-item">
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
              <button onClick={handleCreateSummary}>Enviar PDF</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}