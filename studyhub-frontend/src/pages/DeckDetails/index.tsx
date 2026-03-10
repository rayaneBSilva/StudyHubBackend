import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  getCards,
  createCard,
  deleteCard,
  approveCard,
  rejectCard,
} from "../../services/cardService";
import { AuthContext } from "../../context/AuthContext";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBookOpen,
  FiPlus,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { AxiosError } from "axios";
import Layout from "../../components/layout/layout";
import "./styles.css";

interface Card {
  id: number;
  front: string;
  back: string;
  status?: "pending" | "approved" | "rejected";
}

interface CardResponse {
  id: number;
  frente: string;
  verso: string;
  status?: string;
}

export default function DeckDetails() {
  const { id } = useParams<{ id: string }>();
  const deckId = id ? Number(id) : null;

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cards, setCards] = useState<Card[]>([]);
  const [modal, setModal] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [filterColumn, setFilterColumn] = useState<string | null>(null);
  const [filterOperator, setFilterOperator] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const isTeacher = user?.role === "teacher";

  // ===========================
  // LISTAR CARDS
  // ===========================
  async function toggleCards() {
    if (showCards) {
      setShowCards(false);
      return;
    }

    if (!deckId) return;

    setLoading(true);

    try {
      const response = await getCards(deckId.toString());

      const mappedCards: Card[] = (response.data || []).map(
        (c: CardResponse) => ({
          id: c.id,
          front: c.frente,
          back: c.verso,
          status:
            c.status?.toLowerCase() === "approved"
              ? "approved"
              : c.status?.toLowerCase() === "rejected"
              ? "rejected"
              : "pending",
        })
      );

      setCards(mappedCards);
      setShowCards(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // ===========================
  // FILTRO
  // ===========================
  const filteredCards = cards.filter((card) => {
    if (!filterColumn || !filterOperator || !filterValue) return true;

    const value =
      filterColumn === "front"
        ? card.front
        : filterColumn === "back"
        ? card.back
        : card.status || "";

    const v = value.toLowerCase();
    const f = filterValue.toLowerCase();

    switch (filterOperator) {
      case "equals":
        return v === f;

      case "contains":
        return v.includes(f);

      case "not_equals":
        return v !== f;

      case "not_contains":
        return !v.includes(f);

      default:
        return true;
    }
  });

  function clearFilter() {
    setFilterColumn(null);
    setFilterOperator(null);
    setFilterValue("");
  }

  // ===========================
  // CREATE CARD
  // ===========================
  async function handleCreateCard() {
    if (!deckId || !front.trim() || !back.trim()) return;

    try {
      await createCard({
        frente: front,
        verso: back,
        deck_id: deckId,
      });

      setModal(false);
      setFront("");
      setBack("");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message || "Erro ao criar card");
      }
    }
  }

  // ===========================
  // DELETE
  // ===========================
  async function handleDeleteCard(cardId: number) {
    if (!confirm("Excluir este card?")) return;

    await deleteCard(cardId);

    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }

  async function handleApprove(cardId: number) {
    await approveCard(cardId);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: "approved" } : c))
    );
  }

  async function handleReject(cardId: number) {
    await rejectCard(cardId);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: "rejected" } : c))
    );
  }

  return (
    <Layout title={`Deck #${deckId}`}>
      <div className="deck-header-actions">
        <h1>Gerenciar Cards</h1>

        <div className="button-group">
          <button className="btn-create" onClick={() => setModal(true)}>
            <FiPlus /> Criar
          </button>

          <button
            className="btn-study"
            onClick={() => navigate(`/study/${deckId}`)}
          >
            <FiBookOpen /> Estudar
          </button>

          <button className="btn-list" onClick={toggleCards}>
            <FiSearch /> {showCards ? "Ocultar" : "Listar"}
          </button>
        </div>
      </div>

      {showCards && (
        <>
          {/* SEARCH */}
          <div className="search-container">
            <FiSearch className="search-icon" />

            <input
              placeholder="Pesquisar ou criar filtro..."
              onFocus={() => setShowFilterMenu(true)}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />

            {showFilterMenu && (
              <div className="filter-menu">
                {!filterColumn && (
                  <>
                    <div onClick={() => setFilterColumn("front")}>Frente</div>
                    <div onClick={() => setFilterColumn("back")}>Verso</div>
                    <div onClick={() => setFilterColumn("status")}>Status</div>
                  </>
                )}

                {filterColumn && !filterOperator && (
                  <>
                    <div onClick={() => setFilterOperator("contains")}>
                      Contém
                    </div>

                    <div onClick={() => setFilterOperator("equals")}>
                      Igual a
                    </div>

                    <div onClick={() => setFilterOperator("not_contains")}>
                      Não contém
                    </div>

                    <div onClick={() => setFilterOperator("not_equals")}>
                      Diferente de
                    </div>
                  </>
                )}

                <div className="clear-filter" onClick={clearFilter}>
                  Limpar filtros
                </div>
              </div>
            )}
          </div>

          {/* TABLE */}
          <div className="table-container">
            <table className="cards-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Frente</th>
                  <th>Verso</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredCards.map((card) => (
                  <tr key={card.id}>
                    <td>{card.id}</td>
                    <td>{card.front}</td>
                    <td>{card.back}</td>

                    <td>
                      <span className={`status ${card.status}`}>
                        {card.status}
                      </span>
                    </td>

                    <td className="actions">
                      <button>
                        <FiEdit2 />
                      </button>

                      <button onClick={() => handleDeleteCard(card.id)}>
                        <FiTrash2 />
                      </button>

                      {isTeacher && card.status === "pending" && (
                        <>
                          <button
                            className="approve"
                            onClick={() => handleApprove(card.id)}
                          >
                            <FiCheck />
                          </button>

                          <button
                            className="reject"
                            onClick={() => handleReject(card.id)}
                          >
                            <FiX />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL */}
      {modal && (
        <div className="modal">
          <div className="modal-professional">
            <h2>Novo Flashcard</h2>

            <input
              placeholder="Frente"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />

            <textarea
              placeholder="Verso"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={() => setModal(false)}>Cancelar</button>
              <button onClick={handleCreateCard}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}