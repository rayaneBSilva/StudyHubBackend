import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  getCards,
  createCard,
  deleteCard,
  approveCard,
  rejectCard,
  updateCard,
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
import { getDeckById } from "../../services/deckService";
import "./styles.css";
import { useEffect, useRef } from "react";

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
  const [deckName, setDeckName] = useState<string>("Deck");
  const searchRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [total, setTotal] = useState(0);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const isTeacher = user?.role === "teacher";

  // ===========================
  // LISTAR CARDS
  // ===========================
  async function loadCards() {
    if (!deckId) return;

    setLoading(true);

    try {
      const response = await getCards(deckId.toString(), page, itemsPerPage);

      const list = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setTotal(response.total);

      const mappedCards: Card[] = list.map((c: CardResponse) => ({
        id: c.id,
        front: c.frente,
        back: c.verso,
        status:
          c.status?.toLowerCase() === "approved"
            ? "approved"
            : c.status?.toLowerCase() === "rejected"
              ? "rejected"
              : "pending",
      }));

      setCards(mappedCards);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadDeck() {
      if (!deckId) return;

      try {
        const response = await getDeckById(deckId);
        setDeckName(response.nome);
      } catch (error) {
        console.error(error);
      }
    }

    loadDeck();
  }, [deckId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showCards) {
      loadCards();
    }
  }, [page, showCards]);

  // ===========================
  // FILTRO
  // ===========================
  const filteredCards = cards.filter((card) => {
    if (!filterColumn || !filterOperator || !filterValue) return true;

    let value = "";

    if (filterColumn === "front") value = card.front;
    if (filterColumn === "back") value = card.back;
    if (filterColumn === "status") value = card.status || "";
    if (filterColumn === "id") value = String(card.id);

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

  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }

    if (totalPages === 0) {
      setPage(1);
    }
  }, [total]);

  function clearFilter() {
    setFilterColumn(null);
    setFilterOperator(null);
    setFilterValue("");
    setPage(1);
  }
  // ===========================
  // CREATE CARD
  // ===========================
  async function handleSaveCard() {
    if (!deckId || !front.trim() || !back.trim()) return;

    try {
      if (editingCard) {
        await updateCard(editingCard.id, {
          frente: front,
          verso: back,
        });
      } else {
        await createCard({
          frente: front,
          verso: back,
          deck_id: deckId,
        });
      }

      await loadCards();

      setModal(false);
      setFront("");
      setBack("");
      setEditingCard(null);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message || "Erro ao salvar card");
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
      prev.map((c) => (c.id === cardId ? { ...c, status: "approved" } : c)),
    );
  }

  async function handleReject(cardId: number) {
    const reason = prompt("Motivo da rejeição:");

    if (!reason) return;

    await rejectCard(cardId, reason);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: "rejected" } : c)),
    );
  }

  function toggleCards() {
    setShowCards((prev) => !prev);
  }

  const columnNames: Record<string, string> = {
    front: "Frente",
    back: "Verso",
    status: "Status",
    id: "Id",
  };

  const operatorNames: Record<string, string> = {
    contains: "contém",
    equals: "igual",
    not_equals: "diferente",
    not_contains: "não contém",
  };

  return (
    <Layout
      title={
        <span className="breadcrumb-header">
          <span onClick={() => navigate("/dashboard")}>Página Inicial</span>
          {" / "}
          <span onClick={() => navigate("/decks")}>Decks</span>
          {" / "}
          <span className="current">{deckName}</span>
        </span>
      }
    >
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
          <div className="search-container" ref={searchRef}>
            <FiSearch className="search-icon" />

            <div className="search-input-wrapper">
              {filterColumn && (
                <span className="chip">{columnNames[filterColumn]}</span>
              )}

              {filterOperator && (
                <span className="chip">{operatorNames[filterOperator]}</span>
              )}

              <input
                placeholder="Filtrar..."
                value={filterValue}
                onFocus={() => {
                  if (!filterColumn || !filterOperator) setShowFilterMenu(true);
                }}
                onChange={(e) => setFilterValue(e.target.value)}
              />

              {(filterColumn || filterOperator || filterValue) && (
                <button className="clear-x" onClick={clearFilter}>
                  X
                </button>
              )}
            </div>
            {showFilterMenu && (
              <div className="filter-menu">
                {!filterColumn && (
                  <>
                    <div className="menu-header">Filtrar por</div>
                    <div onClick={() => setFilterColumn("front")}>Frente</div>
                    <div onClick={() => setFilterColumn("back")}>Verso</div>
                    <div onClick={() => setFilterColumn("status")}>Status</div>
                    <div onClick={() => setFilterColumn("id")}>Id</div>
                  </>
                )}

                {filterColumn && !filterOperator && (
                  <>
                    <div className="menu-header">
                      Condição ({columnNames[filterColumn]})
                    </div>

                    <div onClick={() => setFilterOperator("contains")}>
                      Contém
                    </div>

                    <div onClick={() => setFilterOperator("equals")}>Igual</div>

                    <div onClick={() => setFilterOperator("not_contains")}>
                      Não contém
                    </div>

                    <div onClick={() => setFilterOperator("not_equals")}>
                      Diferente
                    </div>
                  </>
                )}
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
                      <button
                        onClick={() => {
                          setEditingCard(card);
                          setFront(card.front);
                          setBack(card.back);
                          setModal(true);
                        }}
                      >
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
              <button
                onClick={() => {
                  setModal(false);
                  setEditingCard(null);
                }}
              >
                Cancelar
              </button>
              <button onClick={handleSaveCard}>
                {editingCard ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}