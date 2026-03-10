import { api } from "../api/axios";

export const getCards = async (deckId: string) => {
  const { data } = await api.get(`/cards?deck_id=${deckId}`);
  return data;
};

export const createCard = async (card: unknown) => {
  const { data } = await api.post("/cards", card);
  return data; // card criado já com status: "pending"
};

export const deleteCard = async (id: number) => {
  await api.delete(`/cards/${id}`);
};

export const approveCard = async (id: number) => {
  const { data } = await api.patch(`/cards/${id}/approve`);
  return data;
};

export const rejectCard = async (id: number) => {
  const { data } = await api.patch(`/cards/${id}/reject`);
  return data;
};
