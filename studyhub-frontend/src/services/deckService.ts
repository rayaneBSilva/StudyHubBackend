import { api } from "../api/axios";

export const getDecks = async (limit?: number) => {
  const { data } = await api.get("/decks", {
    params: { limit: limit || 1000 }, // pega até 1000 decks
  });
  console.log("data: ", data);

  if (data?.success && Array.isArray(data.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

export const createDeck = async (nome: string) => {
  const { data } = await api.post("/decks", { nome }); // ⚠️ envia `nome` corretamente
  return data; // retorna deck criado
};

export const deleteDeck = async (id: number) => {
  await api.delete(`/decks/${id}`);
};
