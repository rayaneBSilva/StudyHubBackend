import { api } from "../api/axios";

export const getCards = async (
  deckId: string,
  page: number,
  limit: number,
  column?: string | null,
  operator?: string | null,
  value?: string,
) => {
  const params = new URLSearchParams({
    deck_id: deckId,
    page: String(page),
    limit: String(limit),
  });

  if (column) params.append("filterColumn", column);
  if (operator) params.append("filterOperator", operator);
  if (value) params.append("filterValue", value);

  const { data } = await api.get(`/cards?${params.toString()}`);

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

export const updateCard = async (id: number, card: unknown) => {
  const { data } = await api.put(`/cards/${id}`, card);
  return data;
};
