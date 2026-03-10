import { useEffect, useState } from "react";
import { getDecks, createDeck, deleteDeck } from "../../services/deckService";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
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


        <main className="main">
          <h1>Seus Decks</h1>
          <p>Organize seus flashcards dentro de decks.</p>

          <div className="cards">
            {/* Card Criar Deck */}
            <div className="card create-deck" onClick={() => setModal(true)}>
              <h3>+ Criar Deck</h3>
            </div>

            {/* Decks existentes */}
            {decks.map(deck => (
              <div
                key={deck.id}
                className="card"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest(".deck-settings")) return;
                  navigate(`/decks/${deck.id}`);
                }}
              >
                <h3>{deck.nome}</h3>

                <FiSettings
                  className="deck-settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeckMenuOpen(deckMenuOpen === deck.id ? null : deck.id);
                  }}
                />

                {deckMenuOpen === deck.id && (
                  <div className="deck-menu">
                    <button onClick={() => navigate(`/decks/${deck.id}`)}>
                      Visualizar Cards
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(deck.id);
                      }}
                    >
                      Deletar Deck
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      {/* MODAL */}
      {modal && (
        <div className="modal" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Deck</h2>
            <input
              placeholder="Nome do deck"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div className="modal-actions">
              <button className="cancel" onClick={() => setModal(false)}>Cancelar</button>
              <button className="create" onClick={handleCreate}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}