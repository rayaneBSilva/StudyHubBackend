import { useNavigate } from "react-router-dom";
import "./styles.css";
import Layout from "../../components/layout/layout";

export default function Dashboard() {

  const navigate = useNavigate();

  return (

    <Layout title="Dashboard">

      <h1>Painel de Estudos</h1>

      <p>
        Gerencie seus materiais e acompanhe seus estudos.
      </p>

      <div className="cards">

        <div
          className="card"
          onClick={() => navigate("/decks")}
        >
          <h3>Decks</h3>
          <p>Organize seus flashcards</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/summaries")}
        >
          <h3>Resumos</h3>
          <p>Compartilhe PDFs</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/folders")}
        >
          <h3>Pastas</h3>
          <p>Organize conteúdos</p>
        </div>

      </div>

    </Layout>

  );
}