import { api } from "../api/axios";

export const getDecks = async (limit?: number) => {
  const { data } = await api.get("/decks", {
    params: { limit: limit || 1000 },
  });

  if (data?.success && Array.isArray(data.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

export const getDeckById = async (id: number) => {
  const { data } = await api.get(`/decks/${id}`);

  if (data?.success && data.data) return data.data;
  return data;
};

export const createDeck = async (nome: string) => {
  const { data } = await api.post("/decks", { nome });
  return data;
};

export const deleteDeck = async (id: number) => {
  await api.delete(`/decks/${id}`);
};
