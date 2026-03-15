import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { api } from "../../api/axios";
import "./study.css";

interface Card {
  id: number;
  frente: string;
  verso: string;
}

export default function StudyPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [showBack, setShowBack] = useState(false);

  async function loadCards() {
    const { data } = await api.get(`/cards/study/${deckId}`);
    setCards(data.data);
  }

  useEffect(() => {
    async function fetchCards() {
      const response = await api.get(`/cards/study/${deckId}`);

      const list = Array.isArray(response.data.data)
        ? response.data.data
        : response.data.data?.data || [];

      setCards(list);
    }

    fetchCards();
  }, [deckId]);
  
  async function reviewCard(quality: number) {
    const card = cards[current];

    await api.patch(`/cards/review/${card.id}`, { quality });

    setShowBack(false);

    if (current + 1 < cards.length) {
      setCurrent(current + 1);
    } else {
      alert("Estudo finalizado 🎉");
      navigate(-1);
    }
  }

  if (!cards.length)
    return (
      <Layout title="Estudar">
        <div className="study-empty">Nenhum card disponível para estudar</div>
      </Layout>
    );

  const card = cards[current];

  return (
    <Layout title="Modo Estudo">
      <div className="study-container">
        <div className="study-progress">
          {current + 1} / {cards.length}
        </div>

        <div className="flashcard" onClick={() => setShowBack(true)}>
          {!showBack ? card.frente : card.verso}
        </div>

        {!showBack && (
          <button className="show-answer" onClick={() => setShowBack(true)}>
            Mostrar resposta
          </button>
        )}

        {showBack && (
          <div className="review-buttons">
            <button onClick={() => reviewCard(1)}>Errei</button>
            <button onClick={() => reviewCard(3)}>Difícil</button>
            <button onClick={() => reviewCard(4)}>Bom</button>
            <button onClick={() => reviewCard(5)}>Fácil</button>
          </div>
        )}
      </div>
    </Layout>
  );
}
