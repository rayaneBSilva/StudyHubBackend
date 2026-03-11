import { useEffect, useState } from "react";
import { getDecks, createDeck, deleteDeck } from "../../services/deckService";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal, FiEdit3, FiTrash2, FiLayers, FiBook, FiTarget } from "react-icons/fi";
import "./styles.css";
import Layout from "../../components/layout/layout";

interface Deck {
  id: number;
  nome: string;
}

export default function Decks() {
  const navigate = useNavigate();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [title, setTitle] = useState("");
  const [modal, setModal] = useState(false);
  const [deckMenuOpen, setDeckMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const data = await getDecks();
        const validDecks = data?.filter((d: Deck) => d?.id && d?.nome) || [];
        setDecks(validDecks);
      } catch (error) {
        console.error("Erro ao carregar decks", error);
      }
    }
    fetchDecks();
  }, []);

  async function handleCreate() {
    if (!title.trim()) return;

    try {
      const response = await createDeck(title);
      setModal(false);
      setTitle("");

      if (response?.success && response.data) {
        const newDeck = response.data;
        setDecks(prev => [...prev, newDeck]);
        navigate(`/decks/${newDeck.id}`);
      } else {
        const data = await getDecks();
        setDecks(data);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao criar deck");
    }
  }

  async function handleDelete(deckId: number) {
    if (!confirm("Deseja realmente deletar este deck?")) return;

    try {
      await deleteDeck(deckId);
      setDecks(prev => prev.filter(d => d.id !== deckId));
    } catch (error) {
      console.error("Erro ao deletar deck", error);
    }
  }

  return (
    <Layout title="Decks">
      <div className="decks-container">
        {/* Header Section */}
        <div className="decks-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">
                <FiLayers className="title-icon" />
                Seus Decks de Estudo
              </h1>
              <p className="page-subtitle">
                Organize seus flashcards em decks temáticos e acelere seu aprendizado
              </p>
            </div>
            <button className="create-deck-btn" onClick={() => setModal(true)}>
              <FiPlus />
              Criar Novo Deck
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FiBook />
            </div>
            <div className="stat-content">
              <h3>{decks.length}</h3>
              <p>Decks Criados</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FiTarget />
            </div>
            <div className="stat-content">
              <h3>{decks.length * 15}</h3>
              <p>Cards Estudados</p>
            </div>
          </div>
        </div>

        {/* Decks Grid */}
        <div className="decks-section">
          <h2 className="section-title">Meus Decks</h2>
          
          {decks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FiLayers />
              </div>
              <h3>Nenhum deck criado ainda</h3>
              <p>Comece criando seu primeiro deck de estudos!</p>
              <button className="empty-action-btn" onClick={() => setModal(true)}>
                <FiPlus />
                Criar Primeiro Deck
              </button>
            </div>
          ) : (
            <div className="decks-grid">
              {decks.map(deck => (
                <div key={deck.id} className="deck-card">
                  <div className="deck-card-header">
                    <div className="deck-icon">
                      <FiBook />
                    </div>
                    <button
                      className="deck-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeckMenuOpen(deckMenuOpen === deck.id ? null : deck.id);
                      }}
                    >
                      <FiMoreHorizontal />
                    </button>
                    
                    {deckMenuOpen === deck.id && (
                      <div className="deck-menu">
                        <button 
                          className="menu-item"
                          onClick={() => navigate(`/decks/${deck.id}`)}
                        >
                          <FiEdit3 />
                          Editar Deck
                        </button>
                        <button
                          className="menu-item danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(deck.id);
                            setDeckMenuOpen(null);
                          }}
                        >
                          <FiTrash2 />
                          Deletar
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="deck-content" onClick={() => navigate(`/decks/${deck.id}`)}>
                    <h3 className="deck-title">{deck.nome}</h3>
                    <div className="deck-stats">
                      <span className="stat-item">24 cards</span>
                      <span className="stat-divider">•</span>
                      <span className="stat-item">85% concluído</span>
                    </div>
                    <div className="deck-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="deck-footer">
                    <button className="study-btn" onClick={() => navigate(`/decks/${deck.id}`)}>
                      Estudar Agora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Criar Novo Deck</h2>
                <p>Dê um nome ao seu novo deck de estudos</p>
              </div>
              <div className="modal-body">
                <input
                  className="deck-name-input"
                  placeholder="Ex: Matemática Básica, Inglês Intermediário..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setModal(false)}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleCreate} disabled={!title.trim()}>
                  <FiPlus />
                  Criar Deck
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}